#!/bin/bash
# Safe Exa MCP search wrapper with automatic retry
# Использование: ./exa-search-safe.sh "query string" [numResults]

QUERY="$1"
NUM_RESULTS="${2:-5}"
MAX_RETRIES=3
RETRY_DELAY=2

if [ -z "$QUERY" ]; then
    echo "Error: Query required"
    echo "Usage: $0 \"query string\" [numResults]"
    exit 1
fi

for i in $(seq 1 $MAX_RETRIES); do
    # Пробуем выполнить запрос
    result=$(timeout 30 mcporter call exa.web_search_exa query="$QUERY" numResults:$NUM_RESULTS --output json 2>&1)
    exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        # Успех - выводим результат
        echo "$result"
        exit 0
    else
        # Ошибка - логируем и retry
        echo "⚠️ Попытка $i/$MAX_RETRIES не удалась" >&2
        
        if [ $i -lt $MAX_RETRIES ]; then
            echo "   Повтор через ${RETRY_DELAY}с..." >&2
            sleep $RETRY_DELAY
        fi
    fi
done

# Все попытки провалились
echo "❌ Exa MCP недоступен после $MAX_RETRIES попыток" >&2
exit 1
