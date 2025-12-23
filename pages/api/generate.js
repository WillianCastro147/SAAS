export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Apenas POST' });

  const { name, style, fmt, phrase } = req.body;
  const API_KEY = process.env.NANO_BANANA_KEY; // Sua chave da OpenAI aqui

  if (!API_KEY) return res.status(500).json({ error: "API Key não configurada na Vercel." });

  // Prompt otimizado para DALL-E 3 (O melhor para textos)
  const styleText = style === 'luxury' ? "elegant gold and black" : style === 'cute' ? "3d cartoon clay" : "classic christmas red and green";
  
  const prompt = `A professional Christmas card. Background style: ${styleText}. 
  In the center, there is a clean, empty square picture frame for a photo. 
  Below the frame, the text "FELIZ NATAL ${name.toUpperCase()}" and "${phrase}" are written in beautiful typography. 
  High quality, 8k, festive lighting.`;

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: fmt === 'st' ? "1024x1792" : "1024x1024",
        quality: "standard"
      })
    });

    const data = await response.json();

    if (data.data && data.data[0].url) {
      return res.status(200).json({ url: data.data[0].url });
    } else {
      console.error("Erro OpenAI:", data);
      return res.status(500).json({ error: data.error?.message || "Erro ao gerar imagem." });
    }

  } catch (error) {
    return res.status(500).json({ error: "Erro de conexão com OpenAI." });
  }
}
