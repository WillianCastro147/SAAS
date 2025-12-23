export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Apenas POST' });

  const { name, style, fmt, phrase } = req.body;
  const API_KEY = process.env.NANO_BANANA_KEY;

  if (!API_KEY) return res.status(500).json({ error: "Chave API não configurada." });

  const styleText = style === 'luxury' ? "elegant gold" : style === 'cute' ? "3d cartoon" : "classic red green";
  
  // Prompt focado em deixar espaço para a foto
  const prompt = `Christmas background, ${styleText} style, central empty square frame for a photo. Text: "FELIZ NATAL ${name.toUpperCase()}" and "${phrase}". 8k.`;

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
