const { chromium } = require('playwright');
const path = require('path');
const { execSync } = require('child_process');

const COOKIES_FILE = path.join(__dirname, 'cookies.json');

// Проверяем сессию перед публикацией
function checkSessionSync() {
  try {
    execSync(`node ${path.join(__dirname, 'check-session.js')}`, { stdio: 'inherit', timeout: 60000 });
    return true;
  } catch (e) {
    return false;
  }
}

async function postToThreads(text) {
  console.log('🚀 Запускаю браузер...');
  
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
    console.log('📱 Открываю Threads...');
    await page.goto('https://www.threads.net/', { waitUntil: 'networkidle', timeout: 30000 });
    
    await page.screenshot({ path: '/tmp/threads-1-loaded.png' });
    console.log('✅ Страница загружена, скрин: /tmp/threads-1-loaded.png');

    // Ищем кнопку "New thread" или поле для ввода
    console.log('🔍 Ищу кнопку создания поста...');
    
    // Пробуем разные селекторы для кнопки создания поста
    const selectors = [
      '[aria-label="New thread"]',
      '[aria-label="Create"]',
      'a[href="/compose"]',
      'svg[aria-label="New post"]',
      '[data-testid="new-thread-button"]',
    ];

    let clicked = false;
    for (const selector of selectors) {
      try {
        const el = await page.$(selector);
        if (el) {
          await el.click();
          clicked = true;
          console.log(`✅ Кликнул по: ${selector}`);
          break;
        }
      } catch (e) {}
    }

    if (!clicked) {
      // Попробуем найти по тексту
      const newThreadBtn = await page.getByRole('link', { name: /new thread|compose/i }).first();
      if (newThreadBtn) {
        await newThreadBtn.click();
        clicked = true;
        console.log('✅ Кликнул по кнопке через role');
      }
    }

    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/threads-2-compose.png' });
    console.log('📸 Скрин после клика: /tmp/threads-2-compose.png');

    // Ищем поле для ввода текста
    console.log('⌨️ Ищу поле для текста...');
    const textareaSelectors = [
      '[contenteditable="true"]',
      'textarea[placeholder]',
      '[aria-label="What\'s new?"]',
      '[aria-placeholder="What\'s new?"]',
      '[data-testid="thread-composer-input"]',
    ];

    let textArea = null;
    for (const selector of textareaSelectors) {
      try {
        const el = await page.$(selector);
        if (el) {
          textArea = el;
          console.log(`✅ Нашёл поле: ${selector}`);
          break;
        }
      } catch (e) {}
    }

    if (!textArea) {
      throw new Error('Не нашёл поле для ввода текста');
    }

    await textArea.click();
    await textArea.fill(text);
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: '/tmp/threads-3-typed.png' });
    console.log('📸 Скрин с текстом: /tmp/threads-3-typed.png');

    // Ищем кнопку публикации
    console.log('🔍 Ищу кнопку публикации...');
    
    let publishBtn = null;
    
    // Пробуем через getByRole в диалоге
    try {
      publishBtn = page.getByRole('button', { name: /^Post$/i }).last();
      const isVisible = await publishBtn.isVisible();
      if (isVisible) {
        console.log('✅ Нашёл кнопку Post через getByRole');
      } else {
        publishBtn = null;
      }
    } catch (e) {}

    if (!publishBtn) {
      // Ищем в модальном окне
      const publishSelectors = [
        '[role="dialog"] button',
        'div[class*="modal"] button',
        'div[class*="sheet"] button',
      ];
      for (const selector of publishSelectors) {
        try {
          const buttons = await page.$$(selector);
          for (const btn of buttons) {
            const text = await btn.innerText().catch(() => '');
            if (text.trim() === 'Post') {
              publishBtn = btn;
              console.log(`✅ Нашёл кнопку Post в модальном окне`);
              break;
            }
          }
          if (publishBtn) break;
        } catch (e) {}
      }
    }

    if (!publishBtn) {
      // Последняя попытка — все кнопки на странице
      const allButtons = await page.$$('button');
      for (const btn of allButtons) {
        const text = await btn.innerText().catch(() => '');
        if (text.trim() === 'Post') {
          publishBtn = btn;
          console.log('✅ Нашёл кнопку Post среди всех кнопок');
          break;
        }
      }
    }

    if (!publishBtn) {
      throw new Error('Не нашёл кнопку публикации');
    }

    // Публикуем!
    console.log('📤 Публикую пост...');
    await publishBtn.click();
    await page.waitForTimeout(3000);

    await page.screenshot({ path: '/tmp/threads-4-ready.png' });
    console.log('✅ Готово! Скрин: /tmp/threads-4-ready.png');
    console.log('🎉 Всё выглядит хорошо! Для реальной публикации раскомментируй publishBtn.click()');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    await page.screenshot({ path: '/tmp/threads-error.png' });
    console.log('📸 Скрин ошибки: /tmp/threads-error.png');
    throw error;
  } finally {
    await browser.close();
  }
}

// Запуск
const postText = process.argv[2];
if (!postText) {
  console.error('❌ Укажи текст поста: node post.js "Текст поста"');
  process.exit(1);
}

console.log('🔍 Проверяю сессию перед публикацией...');
const sessionOk = checkSessionSync();

if (!sessionOk) {
  console.error('❌ Сессия мертва. Уведомление отправлено в Telegram. Публикация отменена.');
  process.exit(1);
}

postToThreads(postText).catch(console.error);
