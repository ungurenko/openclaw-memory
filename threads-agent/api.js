/**
 * OpenClaw Gateway API helper
 * Вызывает Claude через локальный gateway — никаких внешних ключей не нужно
 */
const http = require('http');

const GATEWAY_URL = 'http://localhost:18789';
const GATEWAY_TOKEN = 'e7335a220d944443d539d5e3d222c906eeec1a1716ce7928';
const MODEL = 'anthropic/claude-sonnet-4-6';

async function callClaude(prompt, maxTokens = 2000) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens
    });

    const options = {
      hostname: 'localhost',
      port: 18789,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_TOKEN}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.choices && json.choices[0] && json.choices[0].message) {
            resolve(json.choices[0].message.content);
          } else {
            reject(new Error('Unexpected response: ' + data.slice(0, 200)));
          }
        } catch (e) {
          reject(new Error('Parse error: ' + e.message + ' | data: ' + data.slice(0, 200)));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.write(body);
    req.end();
  });
}

module.exports = { callClaude };
