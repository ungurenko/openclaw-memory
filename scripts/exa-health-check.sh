#!/bin/bash
# Exa MCP Health Check & Auto-Recovery
# Проверяет доступность Exa MCP и переподключает при необходимости

LOG_FILE="/root/.openclaw/workspace/logs/exa-health.log"
mkdir -p "$(dirname "$LOG_FILE")"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Проверяем доступность Exa MCP
check_exa() {
    timeout 30 mcporter call exa.web_search_exa query="test" numResults:1 --output json &>/dev/null
    return $?
}

# Пытаемся восстановить подключение
recover_exa() {
    log "⚠️ Exa MCP недоступен, пытаюсь восстановить..."
    
    # Проверяем сетевое соединение
    if ! ping -c 1 -W 5 mcp.exa.ai &>/dev/null; then
        log "❌ Нет сетевого подключения к mcp.exa.ai"
        return 1
    fi
    
    # Пробуем простой запрос
    if check_exa; then
        log "✅ Exa MCP восстановлен"
        return 0
    fi
    
    log "❌ Не удалось восстановить Exa MCP"
    return 1
}

# Основная логика
if check_exa; then
    log "✅ Exa MCP работает нормально"
    exit 0
else
    if recover_exa; then
        exit 0
    else
        log "🚨 Exa MCP критическая ошибка! Требуется вмешательство."
        exit 1
    fi
fi
