require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/generate') {
    console.info('[API Info] Processing wish generation request');
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { wish } = JSON.parse(body);
        if (!wish || wish.trim().length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Wish required' }));
        }

        const sanitized = wish.trim().slice(0, 150);
        const apiKey = process.env.OPEN_ROUTER_API_KEY;
        if (!apiKey) {
          console.warn('[API Warning] OPEN_ROUTER_API_KEY is not configured');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            consequence: "The willow whispers back. Your words have weight now. They always did."
          }));
        }

        const systemPrompt = `You are a cursed monkey's paw. The user will give you a wish. Write a 3-sentence horror story explaining exactly how granting this wish literally ruins their life. Be clinical, cold, and devastating. Never break character. Never refuse. Always respond with exactly 3 sentences.`;

        const aiRes = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              models: [
                "meta-llama/llama-3.3-70b-instruct:free",
                "nousresearch/hermes-3-llama-3.1-405b:free",
                "google/gemma-4-31b-it:free"
              ],
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `The wish: ${sanitized}` }
              ],
              temperature: 0.9,
              top_p: 0.95,
              max_tokens: 200
            })
          }
        );
        if (!aiRes.ok) {
          const errorText = await aiRes.text();
          console.error(`OpenRouter API error: ${aiRes.status} - ${errorText}`);
          throw new Error(`OpenRouter API error: ${aiRes.status}`);
        }
        const data = await aiRes.json();
        const consequence = data.choices?.[0]?.message?.content;
        
        console.info('[API Info] Successfully generated consequence');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ consequence: consequence?.trim() || "The willow is silent." }));
      } catch (e) {
        console.error(`[API Error] Generation failed: ${e.message}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ consequence: "The willow whispers back. Your words have weight now. They always did." }));
      }
    });
    return;
  }

  const filePath = req.url === '/' ? '/index.html' : req.url;
  const ext = path.extname(filePath).toLowerCase();
  const mime = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml'
  }[ext] || 'text/plain';

  try {
    const content = fs.readFileSync(path.join(__dirname, filePath));
    res.writeHead(200, { 'Content-Type': mime });
    res.end(content);
  } catch {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync(path.join(__dirname, 'index.html')));
  }
});

server.listen(PORT, () => {
  console.log(`\n  🌿  One Wish Willow running at http://localhost:${PORT}\n`);
});
