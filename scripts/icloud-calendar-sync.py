#!/root/.openclaw/venv-calendar/bin/python3
"""
iCloud Calendar синхронизация
Читает события из iCloud Calendar и сохраняет в workspace
"""

import sys
import json
import caldav
from datetime import datetime, timedelta
from pathlib import Path

def load_credentials():
    """Загружаем учетные данные из защищенного файла"""
    creds_path = Path('/root/.openclaw/credentials/icloud.json')
    with open(creds_path, 'r') as f:
        return json.load(f)

def connect_to_calendar():
    """Подключаемся к iCloud Calendar через CalDAV"""
    creds = load_credentials()
    
    # iCloud CalDAV endpoint
    url = "https://caldav.icloud.com"
    
    # Создаём клиент
    client = caldav.DAVClient(
        url=url,
        username=creds['apple_id'],
        password=creds['app_password']
    )
    
    return client

def get_events(days_ahead=30):
    """Получаем события на N дней вперёд"""
    try:
        client = connect_to_calendar()
        principal = client.principal()
        calendars = principal.calendars()
        
        # Период поиска
        start = datetime.now()
        end = start + timedelta(days=days_ahead)
        
        all_events = []
        
        for calendar in calendars:
            print(f"📅 Календарь: {calendar.name}", file=sys.stderr)
            
            # Получаем события
            events = calendar.date_search(start=start, end=end, expand=True)
            
            for event in events:
                try:
                    ical = event.icalendar_component
                    
                    # Извлекаем данные
                    summary = str(ical.get('summary', 'Без названия'))
                    dtstart = ical.get('dtstart')
                    dtend = ical.get('dtend')
                    description = str(ical.get('description', ''))
                    location = str(ical.get('location', ''))
                    
                    # Форматируем дату
                    if dtstart:
                        if hasattr(dtstart.dt, 'isoformat'):
                            start_str = dtstart.dt.isoformat()
                        else:
                            start_str = str(dtstart.dt)
                    else:
                        start_str = None
                    
                    all_events.append({
                        'calendar': calendar.name,
                        'summary': summary,
                        'start': start_str,
                        'description': description,
                        'location': location
                    })
                    
                except Exception as e:
                    print(f"⚠️ Ошибка обработки события: {e}", file=sys.stderr)
                    continue
        
        return all_events
        
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}", file=sys.stderr)
        return None

def save_events(events):
    """Сохраняем события в workspace"""
    if not events:
        return
    
    output_path = Path('/root/.openclaw/workspace/memory/calendar-events.json')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump({
            'synced_at': datetime.now().isoformat(),
            'events_count': len(events),
            'events': events
        }, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Сохранено {len(events)} событий в {output_path}", file=sys.stderr)

def main():
    """Главная функция"""
    print("🔄 Синхронизация iCloud Calendar...", file=sys.stderr)
    
    events = get_events(days_ahead=30)
    
    if events is None:
        print("❌ Не удалось получить события", file=sys.stderr)
        sys.exit(1)
    
    if not events:
        print("ℹ️ Нет событий на ближайшие 30 дней", file=sys.stderr)
    else:
        save_events(events)
        
        # Выводим краткую сводку
        print(f"\n📊 Найдено событий: {len(events)}", file=sys.stderr)
        for event in sorted(events, key=lambda x: x['start'] or '')[:5]:
            print(f"  • {event['start'][:10] if event['start'] else '?'} — {event['summary']}", file=sys.stderr)
    
    print("\n✅ Синхронизация завершена", file=sys.stderr)

if __name__ == '__main__':
    main()
