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
  // Поддержка веток: строка или массив
  const parts = Array.isArray(text) ? text : [text];
  
  if (parts.length === 0) {
    throw new Error('Нет текста для публикации');
  }
  
  console.log(`🚀 Запускаю браузер... Постим ${parts.length} частей`);
  
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
      try {
        const newThreadBtn = await page.getByRole('link', { name: /new thread|compose/i }).first();
        if (newThreadBtn) {
          await newThreadBtn.click();
          clicked = true;
          console.log('✅ Кликнул по кнопке через role');
        }
      } catch (e) {}
    }

    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/threads-2-compose.png' });
    console.log('📸 Скрин после клика: /tmp/threads-2-compose.png');

    // Публикуем каждую часть ветки
    for (let i = 0; i < parts.length; i++) {
      const partText = parts[i];
      console.log(`⌨️ Ввожу часть ${i + 1}/${parts.length} (${partText.length} символов)...`);
      
      // Ищем последнее поле contenteditable
      const contentEditable = await page.$('div[contenteditable="true"]');
      if (!contentEditable) {
        throw new Error(`Не нашёл поле для ввода текста (часть ${i + 1})`);
      }
      
      await contentEditable.click();
      await contentEditable.fill(partText);
      await page.waitForTimeout(500);
      
      await page.screenshot({ path: `/tmp/threads-3-part-${i + 1}.png` });
      
      // Если это не последняя часть — добавляем к ветке
      if (i < parts.length - 1) {
        console.log('➕ Кликаю "Add to thread"...');
        
        // Ищем кнопку Add to thread
        let addToThreadClicked = false;
        const addSelectors = [
          'button:has-text("Add to thread")',
          '[aria-label="Add to thread"]',
          'text=Add to thread',
        ];
        
        for (const selector of addSelectors) {
          try {
            const btn = await page.$(selector);
            if (btn) {
              await btn.click();
              addToThreadClicked = true;
              console.log(`✅ Кликнул "Add to thread" по: ${selector}`);
              break;
            }
          } catch (e) {}
        }
        
        if (!addToThreadClicked) {
          // Пробуем найти по роли
          try {
            const btns = await page.$$('button');
            for (const btn of btns) {
              const text = await btn.innerText().catch(() => '');
              if (text.toLowerCase().includes('add to thread')) {
                await btn.click();
                addToThreadClicked = true;
                console.log('✅ Кликнул "Add to thread" по тексту кнопки');
                break;
              }
            }
          } catch (e) {}
        }
        
        if (!addToThreadClicked) {
          throw new Error('Не нашёл кнопку "Add to thread"');
        }
        
        await page.waitForTimeout(1000);
      }
    }
    
    await page.screenshot({ path: '/tmp/threads-4-ready.png' });
    console.log('📸 Скрин перед публикацией: /tmp/threads-4-ready.png');

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
            const txt = await btn.innerText().catch(() => '');
            if (txt.trim() === 'Post') {
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
        const txt = await btn.innerText().catch(() => '');
        if (txt.trim() === 'Post') {
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

    await page.screenshot({ path: '/tmp/threads-5-published.png' });
    console.log('✅ Готово! Скрин: /tmp/threads-5-published.png');
    console.log('🎉 Пост опубликован!');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    await page.screenshot({ path: '/tmp/threads-error.png' });
    console.log('📸 Скрин ошибки: /tmp/threads-error.png');
    throw error;
  } finally {
    await browser.close();
  }
}

// Экспортируем для использования из других модулей
module.exports = { postToThreads };

// Если запущен напрямую (CLI)
if (require.main === module) {
  async function main() {
    let input;
    const fromFileIdx = process.argv.indexOf('--from-file');
    if (fromFileIdx !== -1 && process.argv[fromFileIdx + 1]) {
      const filePath = process.argv[fromFileIdx + 1];
      const raw = require('fs').readFileSync(filePath, 'utf8');
      input = JSON.parse(raw);
      console.log(`📂 Загружено ${input.length} частей из ${filePath}`);
    } else if (process.argv[2]) {
      input = process.argv[2];
    } else {
      console.error('❌ Укажи текст: node post.js "Текст" или node post.js --from-file parts.json');
      process.exit(1);
    }

    console.log('🔍 Проверяю сессию перед публикацией...');
    const sessionOk = checkSessionSync();
    if (!sessionOk) {
      console.error('❌ Сессия мертва. Уведомление отправлено в Telegram. Публикация отменена.');
      process.exit(1);
    }

    await postToThreads(input);
  }
  main().catch(console.error);
}
