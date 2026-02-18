#!/usr/bin/env python3
"""
Generate images via kie.ai API using z-image (Tongyi-MAI) model.

Usage:
    python generate_image.py --prompt "beautiful sunset" [--ratio 16:9] [--output image.jpg]

Supported ratios: 1:1, 4:3, 3:4, 16:9, 9:16
"""

import argparse
import json
import os
import sys
import time
import requests

KIE_API_KEY = os.environ.get("KIE_API_KEY", "d46b34762504b9d8d6422a8157c2ce43")
BASE_URL = "https://api.kie.ai"


def die(msg: str):
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def headers() -> dict:
    return {
        "Authorization": f"Bearer {KIE_API_KEY}",
        "Content-Type": "application/json",
    }


def submit_task(prompt: str, aspect_ratio: str) -> str:
    """Submit z-image generation task, return taskId."""
    url = f"{BASE_URL}/api/v1/jobs/createTask"
    payload = {
        "model": "z-image",
        "userPath": "z-image",
        "input": json.dumps({
            "prompt": prompt,
            "aspect_ratio": aspect_ratio,
        }),
    }
    resp = requests.post(url, json=payload, headers=headers(), timeout=30)
    data = resp.json()
    if data.get("code") != 200:
        die(f"Submit failed: {data.get('msg')}")
    return data["data"]["taskId"]


def poll_task(task_id: str, timeout: int = 300) -> str:
    """Poll until done, return image URL."""
    url = f"{BASE_URL}/api/v1/jobs/recordInfo"
    deadline = time.time() + timeout
    while time.time() < deadline:
        resp = requests.get(url, params={"taskId": task_id}, headers=headers(), timeout=15)
        d = resp.json().get("data", {})
        if not d:
            print("  z-image: queuing...", flush=True)
            time.sleep(8)
            continue
        state = d.get("state", "")
        if state == "success":
            result_json = d.get("resultJson") or "{}"
            result = json.loads(result_json) if isinstance(result_json, str) else result_json
            urls = result.get("resultUrls") or []
            if urls:
                return urls[0]
            die("No result URLs in response")
        if state == "fail":
            die(f"Generation failed: {d.get('failMsg')}")
        cost = d.get("costTime")
        print(f"  z-image: {state or 'generating'}... ({cost or 0}s)", flush=True)
        time.sleep(8)
    die("Timeout waiting for z-image")


def download(url: str, dest: str):
    resp = requests.get(url, timeout=60, stream=True)
    resp.raise_for_status()
    with open(dest, "wb") as f:
        for chunk in resp.iter_content(8192):
            f.write(chunk)


def main():
    parser = argparse.ArgumentParser(description="Generate image via kie.ai z-image")
    parser.add_argument("--prompt", required=True, help="Image description")
    parser.add_argument("--ratio", default="1:1",
                        choices=["1:1", "4:3", "3:4", "16:9", "9:16"],
                        help="Aspect ratio (default: 1:1)")
    parser.add_argument("--output", default="image.png", help="Output file path")
    args = parser.parse_args()

    print(f"🎨 Generating image with z-image model")
    print(f"   Prompt: {args.prompt[:80]}...")
    print(f"   Ratio: {args.ratio}")

    task_id = submit_task(args.prompt, args.ratio)
    print(f"   Task ID: {task_id}")

    image_url = poll_task(task_id)
    print(f"   Image URL: {image_url}")

    download(image_url, args.output)
    print(f"✅ Saved to: {args.output}")
    print(f"IMAGE_URL:{image_url}")


if __name__ == "__main__":
    main()
