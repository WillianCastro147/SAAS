export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Apenas POST' });

  const { name, style, fmt, phrase } = req.body;
  const API_KEY = process.env.NANO_BANANA_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "Chave NANO_BANANA_KEY não encontrada na Vercel. Vá em Settings > Environment Variables." });
  }

  const styleText = style === 'luxury' ? "gold elegant" : style === 'cute' ? "3d cartoon" : "classic christmas";
  const prompt = `Christmas background, ${styleText}, empty central frame, text "FELIZ NATAL ${name.toUpperCase()}" and "${phrase}". 8k.`;

  try {
    const response = await fetch("https://api.nanobanana.com/v1/images/generations", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "flux", // Muitas APIs exigem o nome do modelo
        prompt: prompt,
        size: fmt === 'st' ? "1024x1792" : "1024x1024",
        n: 1
      })
    });

    const data = await response.json();

    // Tenta pegar a imagem em todos os formatos possíveis que as APIs usam
    const imageUrl = data.data?.[0]?.url || data.output?.[0] || data.url || data.image || (data.images && data.images[0]);

    if (imageUrl) {
      return res.status(200).json({ url: imageUrl });
    } else {
      // Retorna o erro real da Nano Banana para o frontend mostrar
      const errorDetail = data.error?.message || data.message || JSON.stringify(data);
      return res.status(500).json({ error: `Erro da API: ${errorDetail}` });
    }
  } catch (error) {
    return res.status(500).json({ error: "Falha na conexão: " + error.message });
  }
}
