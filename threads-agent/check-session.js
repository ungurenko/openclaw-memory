const { chromium } = require('playwright');
const path = require('path');
const https = require('https');

const COOKIES_FILE = path.join(__dirname, 'cookies.json');
const TG_BOT_TOKEN = '8317320763:AAHgRTuPdzS3MKS9Bw3UztLaGjBiy9PsrEg';
const TG_CHAT_ID = '275175013';

async function sendTelegramAlert(message) {
  return new Promise((resolve) => {
    const text = encodeURIComponent(message);
    const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${text}`;
    https.get(url, (res) => {
      res.on('data', () => {});
      res.on('end', resolve);
    }).on('error', resolve);
  });
}

async function checkSession() {
  console.log('🔍 Проверяю сессию Threads...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    storageState: COOKIES_FILE,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  try {
    await page.goto('https://www.threads.net/', { waitUntil: 'networkidle', timeout: 30000 });

    // Проверяем: если нас редиректнуло на login — сессия мертва
    const url = page.url();
    if (url.includes('/login') || url.includes('/accounts/login')) {
      throw new Error('Редирект на страницу логина — сессия протухла');
    }

    // Проверяем наличие элементов залогиненного пользователя
    const isLoggedIn = await page.evaluate(() => {
      // Ищем признаки авторизации: кнопка Create, профиль
      const hasCreate = !!document.querySelector('[aria-label="Create"]');
      const hasProfile = !!document.querySelector('[aria-label="Profile"]');
      const hasNewThread = !!document.querySelector('[aria-label="New thread"]');
      return hasCreate || hasProfile || hasNewThread;
    });

    if (!isLoggedIn) {
      throw new Error('Элементы залогиненного пользователя не найдены');
    }

    console.log('✅ Сессия живая!');
    await browser.close();
    return true;

  } catch (error) {
    console.error('❌ Сессия мертва:', error.message);
    await browser.close();

    // Отправляем уведомление в Telegram
    const alertMsg = `🔐 Threads Agent: сессия протухла!\n\nОшибка: ${error.message}\n\nНужно обновить куки:\n1. Открой threads.net в Chrome\n2. Cookie-Editor → Export → JSON\n3. Скинь мне обновлённые куки`;

    console.log('📱 Отправляю уведомление в Telegram...');
    await sendTelegramAlert(alertMsg);
    console.log('✅ Уведомление отправлено');

    return false;
  }
}

// Запуск
checkSession().then((alive) => {
  process.exit(alive ? 0 : 1);
}).catch((err) => {
  console.error('Критическая ошибка:', err);
  process.exit(1);
});
