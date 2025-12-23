export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { name, style, fmt, dynamicPhrase } = req.body;
  const API_KEY = process.env.NANO_BANANA_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "Chave API (NANO_BANANA_KEY) não configurada na Vercel." });
  }

  let styleDetails = style === 'luxury' ? "gold theme" : style === 'cute' ? "3d cartoon" : "classic christmas";

  const prompt = `Christmas card background, central empty photo frame, text "FELIZ NATAL ${name.toUpperCase()}" and "${dynamicPhrase}", ${styleDetails}, 8k.`;

  try {
    const response = await fetch("https://api.nanobanana.com/v1/images/generations", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}` // Certifique-se que o site deles usa Bearer
      },
      body: JSON.stringify({
        prompt: prompt,
        size: fmt === 'st' ? "1024x1792" : "1024x1024",
        n: 1
      })
    });

    const data = await response.json();
    
    // Log para você ver o erro real no painel da Vercel (Logs)
    console.log("Resposta da Nano Banana:", JSON.stringify(data));

    // Tenta encontrar a URL em diferentes lugares (algumas APIs mudam o nome do campo)
    const imageUrl = data.data?.[0]?.url || data.output?.[0] || data.url || (data.images && data.images[0]);

    if (imageUrl) {
      res.status(200).json({ url: imageUrl });
    } else {
      // Se deu erro, manda a mensagem da Nano Banana para o seu site avisar
      const errorMsg = data.error?.message || data.message || "A API não retornou imagem.";
      res.status(500).json({ error: errorMsg });
    }
  } catch (error) {
    res.status(500).json({ error: "Falha na conexão com a Nano Banana: " + error.message });
  }
}
