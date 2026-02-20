#!/bin/bash
# Запуск компонентов agents

case "$1" in
  topics) node /root/.openclaw/workspace/threads-agent/generate-topics.js ;;
  post)   node /root/.openclaw/workspace/threads-agent/generate-post.js ;;
  check)  node /root/.openclaw/workspace/threads-agent/check-session.js ;;
  *)      echo "Usage: $0 {topics|post|check}" ;;
esac
