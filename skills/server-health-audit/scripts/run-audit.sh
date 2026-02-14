#!/usr/bin/env bash
set -u

echo "=== SYSTEM ==="
echo "timestamp: $(date -Is)"
echo "hostname: $(hostname 2>/dev/null)"
(printf "os: "; grep -E '^PRETTY_NAME=' /etc/os-release 2>/dev/null | cut -d= -f2- | tr -d '"') || true
echo "kernel: $(uname -r 2>/dev/null)"
echo

echo "=== LOAD & RESOURCES ==="
(printf "uptime: "; uptime -p 2>/dev/null) || true
(printf "load: "; cat /proc/loadavg 2>/dev/null | awk '{print $1" "$2" "$3}') || true
(printf "cpu: "; nproc 2>/dev/null | awk '{print $1" cores"}') || true
free -h 2>/dev/null || true
echo

echo "=== STORAGE ==="
df -hT -x tmpfs -x devtmpfs 2>/dev/null || true
echo

echo "=== SERVICES ==="
systemctl --failed --no-pager 2>/dev/null || echo "systemctl unavailable or no permissions"
echo

echo "=== NETWORK EXPOSURE ==="
ss -tulpen 2>/dev/null | sed -n '1,40p' || echo "ss unavailable or no permissions"
echo

echo "=== SECURITY POSTURE ==="
if command -v ufw >/dev/null 2>&1; then
  ufw status 2>/dev/null || echo "ufw status requires elevated privileges"
else
  echo "ufw: not installed"
fi

grep -E '^(PermitRootLogin|PasswordAuthentication|PubkeyAuthentication)' /etc/ssh/sshd_config 2>/dev/null || echo "sshd_config not readable"
echo

echo "=== UPDATES ==="
if command -v apt >/dev/null 2>&1; then
  apt list --upgradable 2>/dev/null | sed -n '1,30p'
else
  echo "package manager check not configured for this distro"
fi
