#!/usr/bin/env python3
"""
Generate Telegram post cover image via kie.ai API.
Supports GPT Image 1.5 (4o) and Nano Banana Pro models.

Usage:
    python generate_cover.py --title "ЗАГОЛОВОК" --prompt "image prompt" [--model gpt4o|nano-banana] [--output cover.jpg]
"""

import argparse
import os
import sys
import time
import requests


KIE_API_KEY = os.environ.get("KIE_API_KEY", "")
BASE_URL = "https://api.kie.ai"


def die(msg: str):
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


# ─── GPT Image 1.5 (4o) ────────────────────────────────────────────────────

def generate_gpt4o(prompt: str) -> str:
    """Submit task, return taskId."""
    url = f"{BASE_URL}/api/v1/gpt4o-image/generate"
    payload = {
        "prompt": prompt,
        "size": "3:2",      # closest to 16:9 available for this model
        "nVariants": 1,
        "isEnhance": True,
    }
    resp = requests.post(url, json=payload, headers=_headers(), timeout=30)
    data = resp.json()
    if data.get("code") != 200:
        die(f"GPT4o submit failed: {data.get('msg')}")
    return data["data"]["taskId"]


def poll_gpt4o(task_id: str, timeout: int = 300) -> str:
    """Poll until done, return image URL."""
    url = f"{BASE_URL}/api/v1/gpt4o-image/record-info"
    deadline = time.time() + timeout
    while time.time() < deadline:
        resp = requests.get(url, params={"taskId": task_id}, headers=_headers(), timeout=15)
        d = resp.json().get("data", {})
        flag = d.get("successFlag")
        if flag == 1:
            response = d.get("response", {})
            # API returns camelCase 'resultUrls' or snake_case 'result_urls'
            urls = response.get("resultUrls") or response.get("result_urls") or []
            if urls:
                return urls[0]
            die("No result URLs in response")
        if flag == 2:
            die(f"GPT4o generation failed: {d.get('errorMessage')}")
        prog = float(d.get("progress") or 0) * 100
        print(f"  GPT4o: generating... {prog:.0f}%", flush=True)
        time.sleep(8)
    die("Timeout waiting for GPT4o")


# ─── Nano Banana ────────────────────────────────────────────────────────────

def generate_nano_banana(prompt: str) -> str:
    """Submit task, return taskId."""
    url = f"{BASE_URL}/api/v1/jobs/createTask"
    payload = {
        "model": "google/nano-banana",
        "input": {
            "prompt": prompt,
            "image_size": "16:9",
            "output_format": "jpeg",
        },
    }
    resp = requests.post(url, json=payload, headers=_headers(), timeout=30)
    data = resp.json()
    if data.get("code") != 200:
        die(f"Nano Banana submit failed: {data.get('msg')}")
    return data["data"]["taskId"]


def poll_market(task_id: str, timeout: int = 300) -> str:
    """Poll market unified endpoint until done, return image URL."""
    url = f"{BASE_URL}/api/v1/jobs/recordInfo"
    deadline = time.time() + timeout
    while time.time() < deadline:
        resp = requests.get(url, params={"taskId": task_id}, headers=_headers(), timeout=15)
        d = resp.json().get("data", {})
        if d is None:
            print(f"  Nano Banana: queuing...", flush=True)
            time.sleep(8)
            continue
        state = d.get("state", "")
        if state == "success":
            result_json = d.get("resultJson") or "{}"
            import json as _json
            result = _json.loads(result_json) if isinstance(result_json, str) else result_json
            urls = result.get("resultUrls") or result.get("result_urls") or []
            if urls:
                return urls[0]
            die("No result URLs in Nano Banana response")
        if state == "fail":
            die(f"Nano Banana failed: {d.get('failMsg')}")
        print(f"  Nano Banana: {state or 'generating'}...", flush=True)
        time.sleep(8)
    die("Timeout waiting for Nano Banana")


# ─── Helpers ────────────────────────────────────────────────────────────────

def _headers() -> dict:
    if not KIE_API_KEY:
        die("KIE_API_KEY not set. Export it or pass via env.")
    return {
        "Authorization": f"Bearer {KIE_API_KEY}",
        "Content-Type": "application/json",
    }


def download(url: str, dest: str):
    resp = requests.get(url, timeout=60, stream=True)
    resp.raise_for_status()
    with open(dest, "wb") as f:
        for chunk in resp.iter_content(8192):
            f.write(chunk)


# ─── Main ───────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Generate TG post cover via kie.ai")
    parser.add_argument("--title", required=True, help="Short Russian headline for the cover")
    parser.add_argument("--prompt", required=True, help="Image generation prompt (English)")
    parser.add_argument("--model", choices=["gpt4o", "nano-banana"], default="gpt4o",
                        help="Model to use (default: gpt4o)")
    parser.add_argument("--output", default="cover.jpg", help="Output file path")
    args = parser.parse_args()

    print(f"🎨 Generating cover with model: {args.model}")
    print(f"   Title: {args.title}")
    print(f"   Prompt: {args.prompt[:80]}...")

    full_prompt = build_full_prompt(args.title, args.prompt)

    if args.model == "gpt4o":
        task_id = generate_gpt4o(full_prompt)
        print(f"   Task ID: {task_id}")
        image_url = poll_gpt4o(task_id)
    else:
        task_id = generate_nano_banana(full_prompt)
        print(f"   Task ID: {task_id}")
        image_url = poll_market(task_id)

    print(f"   Image URL: {image_url}")
    download(image_url, args.output)
    print(f"✅ Saved to: {args.output}")
    print(f"IMAGE_URL:{image_url}")


def build_full_prompt(title: str, visual_prompt: str) -> str:
    """Combine visual prompt with text overlay instructions."""
    return (
        f"{visual_prompt}. "
        f"The image has a bold Russian text overlay: \"{title}\". "
        f"The text is large, highly legible, placed prominently — top-left or center. "
        f"Aspect ratio 16:9 horizontal banner for Telegram channel post cover. "
        f"High contrast, visually striking, modern design."
    )


if __name__ == "__main__":
    main()
