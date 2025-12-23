export default async function handler(req, res) {
  // Log para o painel da Vercel
  console.log("Chamada recebida na API: ", req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { name, style, fmt, phrase } = req.body;
  const API_KEY = process.env.NANO_BANANA_KEY;

  // 1. Verificação de Chave
  if (!API_KEY) {
    return res.status(500).json({ 
      error: "ERRO DE CONFIGURAÇÃO: A variável NANO_BANANA_KEY não foi encontrada na Vercel." 
    });
  }

  const styleText = style === 'luxury' ? "gold elegant" : style === 'cute' ? "3d cartoon" : "classic christmas";
  const prompt = `Christmas card background, ${styleText}, central empty square frame, text "FELIZ NATAL ${name.toUpperCase()}" and "${phrase}". 8k.`;

  try {
    // 2. Chamada para a API (Usando a URL mais estável)
    const response = await fetch("https://api.nanobanana.pro/v1/images/generations", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY.trim()}`,
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify({
        model: "flux", 
        prompt: prompt,
        size: fmt === 'st' ? "1024x1792" : "1024x1024",
        n: 1
      })
    });

    // 3. Captura de erro de resposta (Antes de tentar ler JSON)
    const responseText = await response.text();
    console.log("Resposta bruta da API:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return res.status(500).json({ error: "A API retornou um formato inválido (não é JSON).", raw: responseText });
    }

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `A API retornou erro ${response.status}`, 
        detail: data.error?.message || data.message || "Erro desconhecido na Nano Banana." 
      });
    }

    // 4. Extração da Imagem
    const imageUrl = data.data?.[0]?.url || data.output?.[0] || data.url || data.image;

    if (imageUrl) {
      return res.status(200).json({ url: imageUrl });
    } else {
      return res.status(500).json({ error: "Imagem não encontrada no JSON da API.", detail: data });
    }

  } catch (error) {
    console.error("ERRO CATASTRÓFICO:", error);
    return res.status(500).json({ 
      error: "Erro interno no servidor (Catch)", 
      detail: error.message 
    });
  }
}
