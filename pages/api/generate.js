export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Apenas POST' });

  const { name, style, fmt, phrase } = req.body;
  const API_KEY = process.env.NANO_BANANA_KEY;

  if (!API_KEY) return res.status(500).json({ error: "Chave API não configurada na Vercel." });

  const styleText = style === 'luxury' ? "elegant gold and black" : style === 'cute' ? "3d cartoon clay" : "traditional christmas red and green";
  
  // DALL-E 3 é imbatível para seguir este prompt e escrever o texto
  const prompt = `A professional Christmas greeting card. Style: ${styleText}. 
  In the center, there is a large, clean, EMPTY square photo frame. 
  Below the frame, the text "FELIZ NATAL" and the phrase "${phrase}" are written in elegant gold typography. 
  At the very bottom, a small signature: "Com carinho, ${name}". 
  8k resolution, festive studio lighting.`;

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY.trim()}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: fmt === 'st' ? "1024x1792" : "1024x1024"
      })
    });

    const data = await response.json();

    if (data.data && data.data[0].url) {
      return res.status(200).json({ url: data.data[0].url });
    } else {
      return res.status(500).json({ error: data.error?.message || "Erro ao gerar imagem." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erro de conexão com OpenAI." });
  }
}
