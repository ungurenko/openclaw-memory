/**
 * Threads Poster — reply-chain approach
 * Стратегия: часть 1 = новый тред, части 2+ = цепочка ответов
 */

const { chromium } = require('playwright');
const path = require('path');
const { execSync } = require('child_process');

const COOKIES_FILE = path.join(__dirname, 'cookies.json');
const PROFILE_URL = 'https://www.threads.net/@ungurenko';

function checkSessionSync() {
  try {
    execSync(`node ${path.join(__dirname, 'check-session.js')}`, { stdio: 'inherit', timeout: 60000 });
    return true;
  } catch (e) {
    return false;
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function makeBrowser() {
  return chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
}

function makeContext(browser) {
  return browser.newContext({
    storageState: COOKIES_FILE,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });
}

// Нажать кнопку публикации (Post / Reply)
async function clickSubmitButton(page) {
  // 1) getByRole
  for (const name of ['Post', 'Reply']) {
    try {
      const btn = page.getByRole('button', { name: new RegExp(`^${name}$`, 'i') }).last();
      if (await btn.isVisible({ timeout: 3000 })) {
        await btn.click();
        console.log(`✅ Кликнул "${name}" через getByRole`);
        return;
      }
    } catch (e) {}
  }

  // 2) Перебор всех кнопок
  const allBtns = await page.$$('button');
  for (const btn of allBtns) {
    const txt = await btn.innerText().catch(() => '');
    if (txt.trim() === 'Post' || txt.trim() === 'Reply') {
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
        console.log(`✅ Кликнул "${txt.trim()}" через перебор`);
        return;
      }
    }
  }

  await page.screenshot({ path: '/tmp/threads-submit-fail.png' });
  throw new Error('Кнопка публикации не найдена (скрин: /tmp/threads-submit-fail.png)');
}

// Опубликовать первую часть как новый тред
async function postNewThread(page, text) {
  console.log('📝 Открываю главную...');
  await page.goto('https://www.threads.net/', { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2000);
  await page.screenshot({ path: '/tmp/threads-1-home.png' });

  // Открыть compose
  const composeSelectors = [
    '[aria-label="New thread"]',
    '[aria-label="Create"]',
    'a[href="/compose"]',
    '[data-testid="new-thread-button"]',
  ];

  let clicked = false;
  for (const sel of composeSelectors) {
    try {
      const el = await page.$(sel);
      if (el) {
        await el.click();
        clicked = true;
        console.log(`✅ Открыл compose: ${sel}`);
        break;
      }
    } catch (e) {}
  }

  if (!clicked) {
    try {
      await page.getByRole('link', { name: /new thread|compose/i }).first().click();
      clicked = true;
    } catch (e) {}
  }

  if (!clicked) {
    await page.screenshot({ path: '/tmp/threads-compose-fail.png' });
    throw new Error('Не нашёл кнопку создания поста (скрин: /tmp/threads-compose-fail.png)');
  }

  await sleep(2000);
  await page.screenshot({ path: '/tmp/threads-2-compose.png' });

  // Ввести текст
  const textarea = await page.waitForSelector('div[contenteditable="true"]', { timeout: 10000 });
  await textarea.click();
  await textarea.fill(text);
  await sleep(1000);
  await page.screenshot({ path: '/tmp/threads-3-typed.png' });

  // Опубликовать
  await clickSubmitButton(page);
  await sleep(5000);
  await page.screenshot({ path: '/tmp/threads-4-posted.png' });
  console.log('✅ Часть 1 опубликована');
}

// Получить URL последнего поста из профиля
async function getLatestPostUrl(page) {
  console.log('🔍 Ищу последний пост в профиле...');
  await page.goto(PROFILE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2000);
  await page.screenshot({ path: '/tmp/threads-5-profile.png' });

  const link = await page.$('a[href*="/post/"]');
  if (!link) throw new Error('Посты в профиле не найдены');

  const href = await link.getAttribute('href');
  const url = href.startsWith('http') ? href : `https://www.threads.net${href}`;
  console.log(`✅ URL первого поста: ${url}`);
  return url;
}

// Проверить что страница жива
async function isPageAlive(page) {
  try {
    await page.evaluate(() => 1);
    return true;
  } catch {
    return false;
  }
}

// Ответить на пост по URL, вернуть URL нового ответа
async function replyToPost(page, postUrl, text, partNum) {
  console.log(`💬 Часть ${partNum}: отвечаю на ${postUrl}`);
  
  // Проверка что страница жива
  if (!await isPageAlive(page)) {
    throw new Error('Браузер был закрыт до публикации части ' + partNum);
  }
  
  await page.goto(postUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(3000); // Увеличил задержку
  await page.screenshot({ path: `/tmp/threads-reply-${partNum}-a.png` });

  // Собрать все ссылки на посты ДО ответа (с обработкой ошибок)
  let linksBefore = [];
  try {
    linksBefore = await page.$$eval(
      'a[href*="/post/"]',
      (els, base) => els.map(el => {
        const h = el.getAttribute('href');
        return h.startsWith('http') ? h : base + h;
      }),
      'https://www.threads.net'
    );
  } catch (e) {
    console.log(`⚠️ Не удалось получить ссылки до: ${e.message}`);
  }

  // Найти кнопки Reply — нажать на ПОСЛЕДНЮЮ (для последнего поста в цепочке)
  let replyClicked = false;

  // Попытка 1: aria-label
  const replyBtnsByAria = await page.$$('[aria-label*="Reply"], [aria-label*="reply"]');
  if (replyBtnsByAria.length > 0) {
    await replyBtnsByAria[replyBtnsByAria.length - 1].click();
    replyClicked = true;
    console.log(`✅ Reply через aria-label (${replyBtnsByAria.length} штук)`);
  }

  // Попытка 2: перебор кнопок/ролей
  if (!replyClicked) {
    const allBtns = await page.$$('button, [role="button"]');
    const candidates = [];
    for (const btn of allBtns) {
      const txt = await btn.innerText().catch(() => '');
      const aria = await btn.getAttribute('aria-label').catch(() => '');
      if (txt.toLowerCase().includes('reply') || aria.toLowerCase().includes('reply')) {
        candidates.push(btn);
      }
    }
    if (candidates.length > 0) {
      await candidates[candidates.length - 1].click();
      replyClicked = true;
      console.log(`✅ Reply через перебор (${candidates.length} кандидатов)`);
    }
  }

  if (!replyClicked) {
    await page.screenshot({ path: `/tmp/threads-reply-${partNum}-fail.png` });
    throw new Error(`Не нашёл кнопку Reply для части ${partNum}`);
  }

  await sleep(1500);
  await page.screenshot({ path: `/tmp/threads-reply-${partNum}-b.png` });

  // Ввести текст ответа
  const textarea = await page.waitForSelector('div[contenteditable="true"]', { timeout: 10000 });
  await textarea.click();
  await textarea.fill(text);
  await sleep(1000);

  // Опубликовать
  await clickSubmitButton(page);
  await sleep(5000);
  await page.screenshot({ path: `/tmp/threads-reply-${partNum}-c.png` });
  console.log(`✅ Часть ${partNum} опубликована`);

  // Найти URL нового ответа
  await sleep(2000); // Дать время на обработку
  
  // Проверка что страница жива
  if (!await isPageAlive(page)) {
    console.log(`⚠️ Браузер закрыт после публикации части ${partNum}, продолжаю с тем же URL`);
    return postUrl.split('?')[0].replace(/\/$/, '');
  }
  
  try {
    await page.goto(postUrl, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    console.log(`⚠️ Навигация не удалась: ${e.message}, продолжаю с тем же URL`);
    return postUrl.split('?')[0].replace(/\/$/, '');
  }
  await sleep(2000);

  let linksAfter = [];
  try {
    linksAfter = await page.$$eval(
      'a[href*="/post/"]',
      (els, base) => els.map(el => {
        const h = el.getAttribute('href');
        return h.startsWith('http') ? h : base + h;
      }),
      'https://www.threads.net'
    );
  } catch (e) {
    console.log(`⚠️ Не удалось получить ссылки после: ${e.message}`);
  }

  // Ищем новые ссылки (не было до), очищаем от query params
  const cleanUrl = (u) => u.split('?')[0].replace(/\/$/, '');

  const newLinks = linksAfter
    .map(cleanUrl)
    .filter(l => !linksBefore.map(cleanUrl).includes(l) && l !== cleanUrl(postUrl));

  if (newLinks.length > 0) {
    console.log(`✅ URL нового ответа: ${newLinks[0]}`);
    return newLinks[0];
  }

  // Fallback: возвращаем тот же URL треда — при следующем открытии 
  // кликнем по ПОСЛЕДНЕЙ кнопке Reply и попадём на нужный пост
  const fallbackUrl = cleanUrl(postUrl);
  console.log(`⚠️ Fallback URL (тот же тред): ${fallbackUrl}`);
  return fallbackUrl;
}

// ===== ОСНОВНАЯ ФУНКЦИЯ =====
async function postToThreads(text) {
  const parts = Array.isArray(text) ? text : [text];
  if (parts.length === 0) throw new Error('Нет текста для публикации');

  console.log(`🚀 Публикую ${parts.length} частей в Threads...`);

  const browser = await makeBrowser();
  const context = await makeContext(browser);
  const page = await context.newPage();

  try {
    // Шаг 1: опубликовать первую часть как новый тред
    await postNewThread(page, parts[0]);

    if (parts.length === 1) {
      console.log('🎉 Пост опубликован!');
      return;
    }

    // Шаг 2: найти URL первого поста
    const firstPostUrl = await getLatestPostUrl(page);

    // Шаг 3: цепочка ответов
    let currentUrl = firstPostUrl;
    for (let i = 1; i < parts.length; i++) {
      try {
        currentUrl = await replyToPost(page, currentUrl, parts[i], i + 1);
        await sleep(3000); // Увеличил задержку между частями
      } catch (e) {
        console.error(`❌ Ошибка в части ${i + 1}: ${e.message}`);
        // Пробуем продолжить с тем же URL
      }
    }

    console.log('🎉 Все части опубликованы!');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    await page.screenshot({ path: '/tmp/threads-fatal-error.png' }).catch(() => {});
    throw error;
  } finally {
    await browser.close();
  }
}

// ===== ОТВЕТ НА ПОСЛЕДНИЙ ПОСТ В ПРОФИЛЕ =====
async function replyToLatestPost(text) {
  console.log('💬 Отвечаю на последний пост...');

  const browser = await makeBrowser();
  const context = await makeContext(browser);
  const page = await context.newPage();

  try {
    await page.goto(PROFILE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(2000);

    const firstPost = await page.$('a[href*="/post/"]');
    if (!firstPost) throw new Error('Не нашёл посты в профиле');

    const href = await firstPost.getAttribute('href');
    const postUrl = href.startsWith('http') ? href : `https://www.threads.net${href}`;

    await page.goto(postUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(2000);

    // Кликаем Reply (первая кнопка — на главном посте)
    const replyBtns = await page.$$('[aria-label*="Reply"], [aria-label*="reply"]');
    if (replyBtns.length > 0) {
      await replyBtns[0].click();
    } else {
      throw new Error('Не нашёл кнопку Reply');
    }
    await sleep(1500);

    const textarea = await page.waitForSelector('div[contenteditable="true"]', { timeout: 10000 });
    await textarea.fill(text);
    await sleep(1000);

    await clickSubmitButton(page);
    await sleep(3000);
    console.log('✅ Ответ опубликован!');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    await page.screenshot({ path: '/tmp/threads-reply-error.png' }).catch(() => {});
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = { postToThreads, replyToLatestPost };

// ===== CLI =====
if (require.main === module) {
  async function main() {
    const args = process.argv.slice(2);

    if (args[0] === 'reply') {
      const text = args.slice(1).join(' ');
      if (!text) {
        console.error('❌ Укажи текст: node post.js reply "Текст"');
        process.exit(1);
      }
      if (!checkSessionSync()) { console.error('❌ Сессия мертва'); process.exit(1); }
      await replyToLatestPost(text);
      return;
    }

    let input;
    const ffIdx = process.argv.indexOf('--from-file');
    if (ffIdx !== -1 && process.argv[ffIdx + 1]) {
      input = JSON.parse(require('fs').readFileSync(process.argv[ffIdx + 1], 'utf8'));
      console.log(`📂 Загружено ${input.length} частей из ${process.argv[ffIdx + 1]}`);
    } else if (args[0]) {
      input = args[0];
    } else {
      console.error('❌ Использование:\n  node post.js "Текст"\n  node post.js reply "Текст"\n  node post.js --from-file file.json');
      process.exit(1);
    }

    if (!checkSessionSync()) { console.error('❌ Сессия мертва'); process.exit(1); }
    await postToThreads(input);
  }

  main().catch(err => {
    console.error('❌ Fatal:', err.message);
    process.exit(1);
  });
}
