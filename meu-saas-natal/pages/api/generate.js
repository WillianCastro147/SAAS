export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { name, style, fmt } = req.body;
  const API_KEY = process.env.NANO_BANANA_KEY;

  const prompt = `Professional Christmas card, text "Feliz Natal ${name}" clearly written, style ${style}, high resolution, 8k, festive.`;

  try {
    const response = await fetch("https://api.nanobanana.com/v1/images/generations", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        size: fmt === 'st' ? "1024x1792" : "1024x1024",
        n: 1
      })
    });

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url || data.output?.[0];

    if (imageUrl) {
      res.status(200).json({ url: imageUrl });
    } else {
      res.status(500).json({ error: "Erro na API", detail: data });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
