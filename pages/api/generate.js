export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Apenas POST' });

  const { name, style, fmt, phrase } = req.body;
  const API_KEY = process.env.NANO_BANANA_KEY;

  const styleText = style === 'luxury' ? "gold elegant" : style === 'cute' ? "3d cartoon" : "classic christmas";
  const prompt = `Christmas card background, ${styleText}, with a central square empty frame. Text: "FELIZ NATAL ${name.toUpperCase()}" and "${phrase}". 8k.`;

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
    const imageUrl = data.data?.[0]?.url || data.output?.[0] || data.url;

    if (imageUrl) {
      res.status(200).json({ url: imageUrl });
    } else {
      res.status(500).json({ error: "Erro na Nano Banana" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro de conexão" });
  }
}
