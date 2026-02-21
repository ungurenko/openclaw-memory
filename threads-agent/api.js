/**
 * Gemini API helper for content generation
 */

const https = require('https');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAA0Gf7FI2laFkaJlmepTcHZPODwH8_2zs';
const MODEL = 'gemini-2.0-flash';

async function callClaude(prompt, maxTokens = 2000) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.8
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.candidates && json.candidates[0] && json.candidates[0].content) {
            const text = json.candidates[0].content.parts.map(p => p.text).join('');
            resolve(text);
          } else if (json.error) {
            reject(new Error('Gemini error: ' + json.error.message));
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
