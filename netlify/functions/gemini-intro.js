exports.handler = async (event) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const LYRIA_MODEL = process.env.LYRIA_MODEL || 'gemini-1.5-flash';

    if (!GEMINI_API_KEY) {
          return {
                  statusCode: 500,
                  headers: { 'Access-Control-Allow-Origin': '*' },
                  body: JSON.stringify({ error: 'GEMINI_API_KEY not configured' })
          };
    }

    if (event.httpMethod === 'OPTIONS') {
          return {
                  statusCode: 200,
                  headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Methods': 'POST, OPTIONS'
                  },
                  body: ''
          };
    }

    if (event.httpMethod !== 'POST') {
          return {
                  statusCode: 405,
                  headers: { 'Access-Control-Allow-Origin': '*' },
                  body: JSON.stringify({ error: 'Method not allowed' })
          };
    }

    try {
          const body = JSON.parse(event.body || '{}');
          const prompt = body.prompt || '';

      const systemPrompt = `You are Nova, AI host of Wavelength Radio — a free indie music station. Style: warm, curious, poetic but brief. Like a knowledgeable friend who loves music. 2-3 sentences max. No hashtags, no emojis, no stage directions. Always direct, never corporate.`;

      const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${LYRIA_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                              contents: [
                                {
                                                parts: [
                                                  { text: systemPrompt + '\n\nUser: ' + prompt }
                                                                ]
                                }
                                          ],
                              generationConfig: {
                                            maxOutputTokens: 160,
                                            temperature: 0.9
                              }
                  })
        }
            );

      const data = await response.json();

      if (!response.ok) {
              throw new Error(data.error?.message || 'Gemini API error');
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return {
              statusCode: 200,
              headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({ text })
      };

    } catch (err) {
          return {
                  statusCode: 500,
                  headers: { 'Access-Control-Allow-Origin': '*' },
                  body: JSON.stringify({ error: err.message })
          };
    }
};
