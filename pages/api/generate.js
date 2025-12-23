export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Apenas POST' });

  const { name, style, fmt, phrase } = req.body;
  const API_KEY = process.env.NANO_BANANA_KEY; // Use a chave do Google AI Studio aqui

  if (!API_KEY) return res.status(500).json({ error: "API Key não configurada na Vercel." });

  // A URL oficial do Google (O verdadeiro Nano Banana)
  const MODEL_ID = "gemini-2.5-flash-image"; 
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${API_KEY}`;

  const styleText = style === 'luxury' ? "elegant gold and black" : style === 'cute' ? "3d cartoon clay" : "classic christmas red and green";
  
  const prompt = `Create a professional Christmas card. Background style: ${styleText}. 
  In the center, there must be a clean, empty square picture frame. 
  Below the frame, the text "FELIZ NATAL" and the phrase "${phrase}" must be clearly visible. 
  At the bottom, add the signature: "${name}". 
  High quality, studio lighting, 8k resolution.`;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          // Ajuste de formato (aspect ratio)
          "aspect_ratio": fmt === 'st' ? "9:16" : "1:1"
        }
      })
    });

    const data = await response.json();

    // O Google devolve a imagem em base64 ou como uma URL dependendo da config.
    // Para simplificar no seu SaaS, vamos extrair o conteúdo gerado:
    const base64Image = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (base64Image) {
      // Retornamos a imagem pronta para o seu <img> no frontend
      return res.status(200).json({ url: `data:image/png;base64,${base64Image}` });
    } else {
      console.error("Resposta do Google:", JSON.stringify(data));
      return res.status(500).json({ error: "A IA não gerou a imagem. Verifique seu saldo ou limites no Google AI Studio." });
    }

  } catch (error) {
    console.error("Erro de conexão:", error);
    return res.status(500).json({ error: "Erro ao conectar com o servidor do Google." });
  }
}
