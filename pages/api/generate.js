export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  // Recebe a frase dinâmica escolhida no frontend
  const { name, style, fmt, dynamicPhrase } = req.body;
  const API_KEY = process.env.NANO_BANANA_KEY;

  // Detalhes do estilo para o prompt
  let styleDetails = "";
  if (style === 'classic') styleDetails = "traditional cozy Christmas aesthetic, fireplace, red and green decorations, pine cones";
  if (style === 'luxury') styleDetails = "luxurious, elegant gold and silver ornaments, sparkling bokeh lights, silk ribbons";
  if (style === 'cute') styleDetails = "charming animated style, cute gingerbread house, soft pastel colors, snow";

  // O Prompt Mágico: Pede uma moldura VAZIA no centro
  const prompt = `A festive Christmas card background in ${styleDetails} style. In the center, there is an ornate Empty Picture Frame waiting for a photo. Below this frame, the text "FELIZ NATAL" and "${dynamicPhrase}" is written in elegant, high-quality typography. The name "${name}" is signed at the bottom. High resolution, 8k.`;

  try {
    const response = await fetch("https://api.nanobanana.com/v1/images/generations", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        model: "flux", // Tentamos usar o melhor modelo para texto
        size: fmt === 'st' ? "1024x1792" : "1024x1024",
        n: 1
      })
    });

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url || data.output?.[0] || data.url;

    if (imageUrl) {
      res.status(200).json({ url: imageUrl });
    } else {
      // Log para debug na Vercel se der erro
      console.error("Erro Nano Banana:", data);
      res.status(500).json({ error: "Falha ao gerar fundo.", detail: data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}
