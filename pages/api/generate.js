export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Apenas POST' });

  const { name, style, fmt, phrase } = req.body;
  const API_KEY = process.env.NANO_BANANA_KEY;

  if (!API_KEY) return res.status(500).json({ error: "Chave não configurada." });

  // CORREÇÃO: O endpoint correto para IMAGEM no Google é o :predict
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${API_KEY}`;

  const styleText = style === 'luxury' ? "elegant gold and black" : style === 'cute' ? "3d cartoon clay" : "traditional christmas";
  
  const prompt = `A professional Christmas card background. Style: ${styleText}. In the center, there is a clean, empty square picture frame. Below the frame, the text "Feliz Natal ${name}" and "${phrase}" are written. 8k resolution.`;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [
          { prompt: prompt }
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: fmt === 'st' ? "9:16" : "1:1",
          outputMimeType: "image/png"
        }
      })
    });

    const data = await response.json();

    // Log para você ver o que está acontecendo se der erro
    console.log("Retorno do Google:", JSON.stringify(data));

    // No endpoint :predict, a imagem vem dentro de predictions
    const base64Image = data.predictions?.[0]?.bytesBase64Encoded || 
                        data.predictions?.[0]?.inlineData?.data;

    if (base64Image) {
      return res.status(200).json({ url: `data:image/png;base64,${base64Image}` });
    } else {
      // Se o Google não retornar a imagem, pode ser restrição da conta ou erro no JSON
      const errorMsg = data.error?.message || "O modelo Imagen 3 ainda não está ativo na sua conta do Google Cloud/AI Studio.";
      return res.status(500).json({ error: errorMsg });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erro de conexão com o Google." });
  }
}
