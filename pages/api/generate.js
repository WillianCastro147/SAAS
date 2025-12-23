export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Apenas POST' });

  const { name, style, fmt, phrase } = req.body;
  const API_KEY = process.env.NANO_BANANA_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "Chave API não configurada na Vercel." });
  }

  // Melhora o prompt para criar o espaço da foto
  const styleText = style === 'luxury' ? "gold and black elegant" : style === 'cute' ? "3d clay cute" : "classic red green";
  
  const prompt = `A professional Christmas card background, ${styleText} style. IMPORTANT: Leave a clean empty square frame in the middle for a photo. Below the frame, write "FELIZ NATAL" and "${phrase}". Signed by "${name}". 8k resolution, festive lighting.`;

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
      res.status(500).json({ error: data.error?.message || "Erro na Nano Banana" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro de conexão com a API" });
  }
}
