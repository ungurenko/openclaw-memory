const fs = require('fs');
const path = require('path');
const https = require('https');
const { callClaude } = require('./api');

const CONFIG_FILE = path.join(__dirname, 'config.md');
const QUEUE_FILE = path.join(__dirname, 'topics-queue.md');
const TG_BOT_TOKEN = '8317320763:AAHgRTuPdzS3MKS9Bw3UztLaGjBiy9PsrEg';
const TG_CHAT_ID = '275175013';

// Отправка уведомления в Telegram
async function sendTelegramMessage(message) {
  return new Promise((resolve) => {
    const text = encodeURIComponent(message);
    const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${text}`;
    https.get(url, (res) => {
      res.on('data', () => {});
      res.on('end', resolve);
    }).on('error', () => {
      console.error('❌ Не удалось отправить TG уведомление');
      resolve();
    });
  });
}

// Парсим темы из файла очереди
function parseTopicsFromQueue() {
  if (!fs.existsSync(QUEUE_FILE)) {
    return [];
  }
  const content = fs.readFileSync(QUEUE_FILE, 'utf8');
  const lines = content.split('\n');
  const topics = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Ищем строки с темами: "1. Тема" или "- Тема"
    if (/^(\d+\.|\-)\s+.+/.test(trimmed) && !trimmed.includes('Планировщик добавляет')) {
      topics.push(trimmed.replace(/^(\d+\.|\-)\s+/, ''));
    }
  }
  
  return topics;
}

// Генерация тем через Claude API
async function generateTopics() {
  const prompt = `Ты — контент-мейкер для блогеров и экспертов, которые используют нейросети.

Сгенерируй 7 заголовков для постов в Threads в таком стиле:

Примеры заголовков:
- "5 ошибок, из-за которых твои тексты из ChatGPT звучат как у всех"
- "Не проси ChatGPT писать текст — вставь эти 4 фразы, и он начнёт думать как ты"
- "5 промптов, которые делают контент вместо тебя (и звучат как ты)"
- "Открываю режим PRO: как я обучил ChatGPT писать в моём стиле за 20 минут"
- "5 промптов для сторителлинга, даже если ты не умеешь рассказывать истории"

Правила:
1. Всегда начинай с цифры (3, 4, 5)
2. Используй либо "боль" (ошибки, проблемы), либо обещание результата
3. Обращение на "ты"
4. Разговорный стиль
5. Тематика: промпты для ChatGPT, лайфхаки с AI для контентмейкеров

Верни только список заголовков, каждый с новой строки, без нумерации.`;

  const response = await callClaude(prompt, 1000);
  
  // Парсим заголовки
  const lines = response.split('\n').map(l => l.trim()).filter(l => l.length > 10);
  return lines.slice(0, 7);
}

// Добавляем темы в очередь
function addTopicsToQueue(topics) {
  let content = fs.existsSync(QUEUE_FILE) ? fs.readFileSync(QUEUE_FILE, 'utf8') : '# Topics Queue\n<!-- Планировщик добавляет темы сюда, публикатор берёт первую и удаляет -->\n';
  
  // Находим текущее количество тем
  const existingTopics = parseTopicsFromQueue();
  let startNumber = existingTopics.length + 1;
  
  // Добавляем новые темы
  for (const topic of topics) {
    content += `\n${startNumber}. ${topic}`;
    startNumber++;
  }
  
  fs.writeFileSync(QUEUE_FILE, content);
}

// Главная функция
async function main() {
  console.log('📋 Topics Agent: запуск...');
  
  // Проверяем очередь
  const existingTopics = parseTopicsFromQueue();
  console.log(`📊 В очереди ${existingTopics.length} тем`);
  
  if (existingTopics.length >= 5) {
    console.log('✅ Очередь полная, пропускаю генерацию');
    return;
  }
  
  try {
    console.log('🤖 Генерирую новые темы через Claude (OpenClaw gateway)...');
    const newTopics = await generateTopics();
    
    console.log('✅ Сгенерировано тем:', newTopics.length);
    
    // Добавляем в очередь
    addTopicsToQueue(newTopics);
    console.log('📝 Темы добавлены в очередь');
    
    // Отправляем уведомление
    const topicsList = newTopics.map((t, i) => `${i + 1}. ${t}`).join('\n');
    await sendTelegramMessage(`📋 Themes Agent: добавил ${newTopics.length} новых тем:\n\n${topicsList}`);
    console.log('📱 TG уведомление отправлено');
    
  } catch (error) {
    console.error('❌ Ошибка генерации:', error.message);
    await sendTelegramMessage(`❌ Themes Agent: ошибка генерации\n\n${error.message}`);
    process.exit(1);
  }
}

main();
