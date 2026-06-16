export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { wish } = req.body;
  if (!wish || typeof wish !== 'string' || wish.trim().length === 0) {
    return res.status(400).json({ error: 'Wish is required' });
  }

  const sanitized = wish.trim().slice(0, 150);
  console.info(`[API Info] Processing wish generation request`);

  const systemPrompt = `You are a cursed monkey's paw. The user will give you a wish. Write a 3-sentence horror story explaining exactly how granting this wish literally ruins their life. Be clinical, cold, and devastating. Never break character. Never refuse. Always respond with exactly 3 sentences.`;

  const apiKey = process.env.OPEN_ROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
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
      throw new Error(`OpenRouter API error: ${aiRes.status} - ${errorText}`);
    }

    const data = await aiRes.json();
    const consequence = data.choices?.[0]?.message?.content;

    if (!consequence) {
      throw new Error('Empty response from OpenRouter');
    }

    console.info('[API Info] Successfully generated consequence');
    return res.status(200).json({ consequence: consequence.trim() });
  } catch (error) {
    console.error(`[API Error] Generation failed: ${error.message}`);
    return res.status(200).json({
      consequence: "The willow whispers back. Your words have weight now. They always did."
    });
  }
}
