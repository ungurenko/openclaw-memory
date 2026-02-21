---
theme: default
title: AI FIRST МЫШЛЕНИЕ
highlighter: shiki
colorSchema: light
fonts:
  sans: 'Roboto'
  mono: 'Fira Code'
---

<style>
.slidev-layout {
  background: #FAFAFA;
  color: #1F2937;
  font-family: 'Roboto', sans-serif;
}

h1 {
  color: #7C3AED !important;
  font-weight: 800 !important;
}

h2 {
  color: #7C3AED !important;
  font-weight: 700 !important;
}

.tag {
  display: inline-block;
  background: #EDE9FE;
  color: #7C3AED;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 600;
}

.card {
  background: #F5F3FF;
  border-left: 4px solid #7C3AED;
  border-radius: 8px;
  padding: 16px 20px;
  margin: 8px 0;
}

.card-bad {
  background: #FEF2F2;
  border-left: 4px solid #EF4444;
  border-radius: 8px;
  padding: 16px 20px;
  margin: 8px 0;
}

.card-good {
  background: #F0FDF4;
  border-left: 4px solid #22C55E;
  border-radius: 8px;
  padding: 16px 20px;
  margin: 8px 0;
}

.footer-brand {
  position: absolute;
  bottom: 24px;
  right: 36px;
  color: #9CA3AF;
  font-size: 0.78em;
}

.num-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #7C3AED;
  color: white;
  font-weight: 700;
  font-size: 1.1em;
  flex-shrink: 0;
}
</style>

---
layout: cover
background: '#FAFAFA'
---

<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center">
  <div class="tag" style="margin-bottom:24px">Вайбс · Урок 3</div>
  <h1 style="font-size:3.8em;color:#7C3AED;font-weight:900;line-height:1.1;margin-bottom:16px">AI FIRST<br>МЫШЛЕНИЕ</h1>
  <p style="font-size:1.5em;color:#6B7280;font-weight:300">Как думать, когда не знаешь, что делать</p>
  <div style="margin-top:48px;color:#9CA3AF;font-size:0.9em">Александр Унгуренко · Вайбс · 2026</div>
</div>

---

# На этом уроке

<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:28px">
  <div class="card">
    <div style="font-size:1.8em;margin-bottom:8px">🧠</div>
    <div style="font-weight:600;font-size:1.05em">Что такое AI First мышление</div>
  </div>
  <div class="card">
    <div style="font-size:1.8em;margin-bottom:8px">💡</div>
    <div style="font-weight:600;font-size:1.05em">Аналогия, которая всё меняет</div>
  </div>
  <div class="card">
    <div style="font-size:1.8em;margin-bottom:8px">🛠</div>
    <div style="font-weight:600;font-size:1.05em">Реальные примеры из практики</div>
  </div>
  <div class="card">
    <div style="font-size:1.8em;margin-bottom:8px">✍️</div>
    <div style="font-weight:600;font-size:1.05em">Как правильно ставить задачи AI</div>
  </div>
</div>

<div class="footer-brand">Вайбс · Александр Унгуренко</div>

---

# С чего всё начинается

<div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:20px">
  <div>
    <div class="card-bad" style="margin-bottom:12px">
      <div style="font-weight:700;color:#DC2626;margin-bottom:10px">Старый рефлекс</div>
      <div style="color:#374151">Гуглить → YouTube → Застрять → Ещё туториал → ...</div>
    </div>
    <div style="color:#6B7280;font-size:0.88em;padding-left:8px">Алгоритм рекомендаций управляет тобой</div>
  </div>
  <div>
    <div class="card" style="margin-bottom:12px">
      <div style="font-weight:700;color:#7C3AED;margin-bottom:10px">AI First рефлекс</div>
      <div style="color:#374151">Описать → Спросить AI → Уточнить → Решить → Двигаться</div>
    </div>
    <div style="color:#6B7280;font-size:0.88em;padding-left:8px">Ты управляешь процессом</div>
  </div>
</div>

<div style="margin-top:28px;background:#EDE9FE;border-radius:12px;padding:16px 24px;text-align:center;font-size:1.1em;font-weight:600;color:#7C3AED">
  Разница не в скорости — в том, кто управляет процессом: ты или алгоритм рекомендаций.
</div>

<div class="footer-brand">Вайбс · Александр Унгуренко</div>

---
layout: center
---

<div style="text-align:center">
  <div style="font-size:3em;margin-bottom:16px">👨‍💼</div>
  <h1 style="font-size:3em;color:#7C3AED;font-weight:900;margin-bottom:12px">Сотрудник за $20</h1>
  <p style="font-size:1.2em;color:#4B5563;margin-bottom:28px">в месяц. Умеет всё. Знает всё.<br>Сидит прямо за экраном и ждёт твоё задание.</p>
  
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:520px;margin:0 auto 24px">
    <div style="background:#EDE9FE;border-radius:12px;padding:12px;font-weight:600;color:#7C3AED">PDF</div>
    <div style="background:#EDE9FE;border-radius:12px;padding:12px;font-weight:600;color:#7C3AED">Текст</div>
    <div style="background:#EDE9FE;border-radius:12px;padding:12px;font-weight:600;color:#7C3AED">Исследование</div>
    <div style="background:#EDE9FE;border-radius:12px;padding:12px;font-weight:600;color:#7C3AED">Расчёты</div>
    <div style="background:#EDE9FE;border-radius:12px;padding:12px;font-weight:600;color:#7C3AED">Сайт</div>
    <div style="background:#EDE9FE;border-radius:12px;padding:12px;font-weight:600;color:#7C3AED">Закон</div>
  </div>

  <p style="font-size:1.15em;color:#4B5563">Вот именно так и относись к <strong style="color:#7C3AED">Claude</strong>.</p>
</div>

---

# Что такое AI First мышление

<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:20px">
  <div class="card-bad">
    <div style="font-weight:700;color:#EF4444;margin-bottom:12px;font-size:1.05em">❌ Старый подход</div>
    <ul style="list-style:none;padding:0;space-y:8px;color:#374151">
      <li style="padding:4px 0">Найти урок на YouTube</li>
      <li style="padding:4px 0">Посмотреть → повторить</li>
      <li style="padding:4px 0">Застрять → искать ещё</li>
      <li style="padding:4px 0">Потерять час времени</li>
      <li style="padding:4px 0">Так и не понять почему</li>
    </ul>
  </div>
  <div class="card-good">
    <div style="font-weight:700;color:#16A34A;margin-bottom:12px;font-size:1.05em">✓ AI First подход</div>
    <ul style="list-style:none;padding:0;color:#374151">
      <li style="padding:4px 0">Описать задачу своими словами</li>
      <li style="padding:4px 0">Спросить AI → получить ответ</li>
      <li style="padding:4px 0">Уточнить детали → применить</li>
      <li style="padding:4px 0">Задача решена за 10 минут</li>
      <li style="padding:4px 0">Понять логику, не только код</li>
    </ul>
  </div>
</div>

<div style="margin-top:20px;background:#EDE9FE;border-radius:12px;padding:14px 20px;text-align:center;color:#7C3AED;font-weight:600">
  AI First — это не про копирование ответов. Это про то, чтобы думать задачами, а не инструкциями.
</div>

<div class="footer-brand">Вайбс · Александр Унгуренко</div>

---

# Пример 1: База данных

<div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:16px">
  <div>
    <div style="color:#6B7280;margin-bottom:16px;font-style:italic">Задача: подключить базу данных к проекту</div>
    <div class="card">
      <div style="font-weight:700;color:#7C3AED;margin-bottom:12px">Я спросил Claude:</div>
      <ul style="list-style:none;padding:0;color:#374151;font-size:0.95em">
        <li style="padding:3px 0">→ Нужна ли вообще база данных?</li>
        <li style="padding:3px 0">→ Какую выбрать для моего случая?</li>
        <li style="padding:3px 0">→ Как подключить шаг за шагом?</li>
        <li style="padding:3px 0">→ Как зарегистрироваться и что вводить?</li>
      </ul>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;justify-content:center">
    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:16px;padding:28px">
      <div style="font-size:2.5em;margin-bottom:8px">✅</div>
      <div style="font-weight:700;color:#15803D;margin-bottom:8px;font-size:1.05em">Результат</div>
      <p style="color:#374151;margin-bottom:12px">Claude провёл через весь процесс — под мой конкретный проект.</p>
      <p style="color:#6B7280;font-size:0.88em;font-weight:600">Ни одного сайта с документацией не открыл.</p>
    </div>
  </div>
</div>

<div class="footer-brand">Вайбс · Александр Унгуренко</div>

---

# Пример 2: Загрузка картинок

<div style="margin-top:12px">
  <div style="color:#6B7280;margin-bottom:16px;font-style:italic">Задача: добавить картинку на сайт. Я не знал, как это работает.</div>

  <div class="card" style="margin-bottom:20px">
    <div style="font-weight:600;color:#7C3AED;margin-bottom:6px">Мой вопрос:</div>
    <div style="font-style:italic;color:#374151">«Как мне загрузить картинку, чтобы ты сохранил её и вставил на сайт?»</div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
    <div style="background:#F5F3FF;border-radius:14px;padding:20px;text-align:center">
      <div style="font-size:1.8em;margin-bottom:8px">1️⃣</div>
      <div style="font-weight:600;color:#7C3AED;font-size:0.95em">Загрузи на imgbb.com</div>
    </div>
    <div style="background:#F5F3FF;border-radius:14px;padding:20px;text-align:center">
      <div style="font-size:1.8em;margin-bottom:8px">2️⃣</div>
      <div style="font-weight:600;color:#7C3AED;font-size:0.95em">Скопируй прямую ссылку</div>
    </div>
    <div style="background:#F5F3FF;border-radius:14px;padding:20px;text-align:center">
      <div style="font-size:1.8em;margin-bottom:8px">3️⃣</div>
      <div style="font-weight:600;color:#7C3AED;font-size:0.95em">Скинь ссылку — вставим в код</div>
    </div>
  </div>

  <div style="margin-top:20px;text-align:center;font-weight:600;color:#7C3AED;font-size:1.05em">
    До → не знал. После → знал и сделал за 5 минут.
  </div>
</div>

<div class="footer-brand">Вайбс · Александр Унгуренко</div>

---

# Три ситуации — одно решение

<div style="display:flex;flex-direction:column;gap:24px;margin-top:32px">
  <div style="display:flex;align-items:flex-start;gap:20px">
    <div class="num-circle">01</div>
    <div>
      <div style="font-weight:700;font-size:1.1em;margin-bottom:4px">Не знаешь, как сделать</div>
      <div style="color:#6B7280">→ Опиши задачу и спроси с чего начать</div>
    </div>
  </div>
  <div style="display:flex;align-items:flex-start;gap:20px">
    <div class="num-circle">02</div>
    <div>
      <div style="font-weight:700;font-size:1.1em;margin-bottom:4px">Получил ошибку</div>
      <div style="color:#6B7280">→ Скопируй текст ошибки и отправь Claude целиком</div>
    </div>
  </div>
  <div style="display:flex;align-items:flex-start;gap:20px">
    <div class="num-circle">03</div>
    <div>
      <div style="font-weight:700;font-size:1.1em;margin-bottom:4px">Не уверен в подходе</div>
      <div style="color:#6B7280">→ Опиши, что сделал, и попроси оценить</div>
    </div>
  </div>
</div>

<div class="footer-brand">Вайбс · Александр Унгуренко</div>

---

# Как правильно ставить задачу

<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:16px">
  <div class="card-bad">
    <div style="font-weight:700;color:#EF4444;margin-bottom:10px">❌ ПЛОХО</div>
    <div style="font-style:italic;color:#374151;font-size:1.1em;margin-bottom:10px">«Как подключить базу данных?»</div>
    <div style="color:#6B7280;font-size:0.9em">Слишком общий вопрос. AI не знает контекст. Ответ будет общим — и не для твоего случая.</div>
  </div>
  <div class="card-good">
    <div style="font-weight:700;color:#16A34A;margin-bottom:10px">✓ ХОРОШО</div>
    <div style="font-style:italic;color:#374151;font-size:0.88em;margin-bottom:10px">«Я делаю веб-приложение на Next.js, хочу хранить данные пользователей. Нужна ли мне база данных? Если да — какую посоветуешь для новичка и как её подключить шаг за шагом?»</div>
  </div>
</div>

<div style="margin-top:20px;background:#EDE9FE;border-radius:12px;padding:16px 24px;text-align:center">
  <div style="font-weight:700;color:#7C3AED;font-size:1.1em">Чем больше контекста — тем точнее ответ.</div>
  <div style="color:#6B7280;font-size:0.9em;margin-top:4px">Claude не читает мысли, но читает всё, что ты написал.</div>
</div>

<div class="footer-brand">Вайбс · Александр Унгуренко</div>

---

# Это уже новая норма

<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:16px">
  <div>
    <div class="card" style="margin-bottom:16px">
      <div style="font-size:2.8em;font-weight:900;color:#7C3AED;line-height:1">65%</div>
      <div style="color:#374151;font-size:0.9em;margin-top:4px">разработчиков используют AI каждую неделю</div>
      <div style="color:#9CA3AF;font-size:0.78em;margin-top:4px">Stack Overflow Developer Survey, 2025</div>
    </div>
    <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:16px;font-style:italic;color:#374151;font-size:0.88em">
      «Самый горячий язык программирования сейчас — это английский. И русский тоже работает.»
      <div style="margin-top:8px;color:#9CA3AF;font-style:normal">— Андрей Карпаты, сооснователь OpenAI</div>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div class="card">
      <div style="font-weight:600">Вайб-кодинг — не лайфхак.</div>
      <div style="color:#6B7280;font-size:0.9em">Это новый способ создавать продукты.</div>
    </div>
    <div class="card">
      <div style="font-weight:600">AI не заменяет мышление.</div>
      <div style="color:#6B7280;font-size:0.9em">Он усиливает мышление эксперта.</div>
    </div>
    <div class="card">
      <div style="font-weight:600">Ты уже в правильном месте.</div>
      <div style="color:#6B7280;font-size:0.9em">Ты учишься работать с этим сейчас.</div>
    </div>
  </div>
</div>

<div class="footer-brand">Вайбс · Александр Унгуренко</div>

---

# Чего не нужно бояться

<div style="display:flex;flex-direction:column;gap:16px;margin-top:20px">
  <div class="card">
    <div style="display:flex;align-items:flex-start;gap:16px">
      <div style="font-size:1.8em">🤔</div>
      <div>
        <div style="font-weight:700;margin-bottom:4px">Что Claude даст неправильный ответ</div>
        <div style="color:#6B7280">→ Проверяй, уточняй, переспрашивай. AI — это диалог, не оракул.</div>
      </div>
    </div>
  </div>
  <div class="card">
    <div style="display:flex;align-items:flex-start;gap:16px">
      <div style="font-size:1.8em">🤔</div>
      <div>
        <div style="font-weight:700;margin-bottom:4px">Что задача слишком сложная</div>
        <div style="color:#6B7280">→ Нет задачи, которую нельзя разбить на части. Разбей — и спроси по каждой части.</div>
      </div>
    </div>
  </div>
  <div class="card">
    <div style="display:flex;align-items:flex-start;gap:16px">
      <div style="font-size:1.8em">🤔</div>
      <div>
        <div style="font-weight:700;margin-bottom:4px">Что вопрос покажется «глупым»</div>
        <div style="color:#6B7280">→ Claude не осуждает. Он работает. Единственная ошибка — не спросить.</div>
      </div>
    </div>
  </div>
</div>

<div class="footer-brand">Вайбс · Александр Унгуренко</div>

---
layout: center
---

<div style="text-align:center;max-width:640px;margin:0 auto">
  <div class="tag" style="margin-bottom:20px">Итог</div>
  <h1 style="font-size:2.8em;color:#7C3AED;font-weight:900;margin-bottom:16px;line-height:1.2">AI First мышление — это рефлекс.</h1>
  <p style="font-size:1.1em;color:#4B5563;margin-bottom:12px">Каждый раз, когда застрял: <strong style="color:#7C3AED">сначала Claude</strong>, потом всё остальное.</p>
  <p style="color:#6B7280;margin-bottom:24px">Со временем ты перестанешь застревать, потому что научишься думать задачами.</p>
  <div style="background:#EDE9FE;border-radius:16px;padding:24px;font-size:1.2em;font-weight:700;color:#7C3AED">
    Ты уже платишь $20 в месяц за лучшего сотрудника в мире.<br>
    <span style="font-size:1.15em">Используй его.</span>
  </div>
</div>

---
layout: center
---

<div style="text-align:center;max-width:600px;margin:0 auto">
  <div class="tag" style="margin-bottom:20px">Домашнее задание</div>
  <h2 style="font-size:2em;color:#7C3AED;margin-bottom:24px">Задание</h2>
  
  <div class="card" style="text-align:left;margin-bottom:20px;font-size:1em;line-height:1.7">
    Возьми любую задачу прямо сейчас — по проекту, по коду, по дизайну.<br>
    Опиши её Claude <strong>максимально подробно</strong>.<br>
    Поговори с ним как с партнёром — не как с поисковиком.
  </div>

  <div style="background:#EDE9FE;border-radius:12px;padding:16px;font-size:1.05em;font-weight:600;color:#7C3AED;margin-bottom:24px">
    📸 Скинь скриншот диалога в чат курса
  </div>

  <p style="color:#6B7280">У тебя уже есть сотрудник, который умеет всё.<br><strong style="color:#374151">Просто дай ему задание.</strong></p>
  
  <div style="margin-top:32px;color:#D1D5DB;font-size:0.85em">Александр Унгуренко · Вайбс · 2026</div>
</div>
