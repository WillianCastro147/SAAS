export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Apenas POST' });

  const { name, style, fmt, phrase } = req.body;
  const API_KEY = process.env.NANO_BANANA_KEY;

  if (!API_KEY) return res.status(500).json({ error: "Chave do Google não configurada." });

  // URL do Google Gemini para Geração de Imagem (Imagen 3)
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3:generateContent?key=${API_KEY}`;

  const styleText = style === 'luxury' ? "gold and black elegant" : style === 'cute' ? "3d clay cartoon" : "traditional red and green";
  
  const prompt = `Professional Christmas card design. Style: ${styleText}. 
  In the center, there is a clean, empty rectangular photo frame. 
  Below the frame, the text "FELIZ NATAL ${name.toUpperCase()}" and "${phrase}" are written in festive typography. 
  High resolution, 8k, studio lighting.`;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          "responseMimeType": "application/json"
        }
      })
    });

    const data = await response.json();
    
    // O Gemini geralmente retorna a imagem em base64 ou link dependendo da conta
    const base64Image = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const imageLink = data.candidates?.[0]?.content?.parts?.[0]?.fileData?.fileUri;

    if (base64Image || imageLink) {
      const finalUrl = imageLink ? imageLink : `data:image/png;base64,${base64Image}`;
      res.status(200).json({ url: finalUrl });
    } else {
      console.error("Erro Google:", JSON.stringify(data));
      res.status(500).json({ error: "O Google não gerou a imagem. Tente um nome mais curto." });
    }
  } catch (error) {
    res.status(500).json({ error: "Falha de conexão com o Google." });
  }
}
