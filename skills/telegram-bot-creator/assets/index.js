const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');
const express = require('express');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const app = express();

const WEBHOOK_PATH = '/telegram-webhook';
const WEBHOOK_URL = process.env.WEBHOOK_URL || `https://${process.env.RAILWAY_PUBLIC_DOMAIN}${WEBHOOK_PATH}`;

const SYSTEM_PROMPT = `{{SYSTEM_PROMPT}}`;

bot.start((ctx) => {
  ctx.reply(`{{START_MESSAGE}}`);
});

bot.on('text', async (ctx) => {
  const userText = ctx.message.text;

  // Игнорируем команды
  if (userText.startsWith('/')) return;

  try {
    ctx.reply('⏳ {{PROCESSING_MESSAGE}}');

    const response = await processText(userText);

    ctx.reply(response, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error:', error);
    ctx.reply('❌ {{ERROR_MESSAGE}}');
  }
});

async function processText(text) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.BOT_URL || 'https://t.me/YourBot',
      'X-Title': process.env.BOT_NAME || 'Telegram Bot'
    },
    body: JSON.stringify({
      model: process.env.MODEL_NAME || 'openrouter/aurora-alpha',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'OpenRouter API error');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Setup webhook
app.use(bot.webhookCallback(WEBHOOK_PATH));

app.get('/', (req, res) => {
  res.send(`🤖 ${process.env.BOT_NAME || 'Telegram Bot'} is running!`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🤖 Server running on port ${PORT}`);
  console.log(`📡 Webhook URL: ${WEBHOOK_URL}`);
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
