const NANO_BANANA_KEY = process.env.NANO_BANANA_KEY; // Ele pega do Railway
const PORT = process.env.PORT || 3000; // Ele pega a porta do Railway
const express = require('express');
const app = express();
const PORT = 3000;

// --- CONFIGURAÇÃO - COLOQUE SUA CHAVE AQUI ---
const NANO_BANANA_KEY = "SUA_CHAVE_AQUI"; 
const NANO_API_URL = "https://api.nanobanana.com/v1/images/generations"; 

app.use(express.json());

// 1. Rota que entrega o Visual (HTML)
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NatalMagic AI - Nano Banana</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .christmas-bg { background: linear-gradient(135deg, #0f2e1f 0%, #8b0000 100%); }
        .glass { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); }
    </style>
</head>
<body class="bg-gray-100 min-h-screen">
    <nav class="bg-white p-4 shadow-md text-center">
        <h1 class="text-2xl font-bold text-red-600"><i class="fas fa-sleigh mr-2"></i>NatalMagic AI</h1>
    </nav>

    <div class="container mx-auto px-4 py-10 max-w-5xl">
        <div class="grid md:grid-cols-2 gap-8">
            <div class="glass p-8 rounded-3xl shadow-xl border border-white">
                <h2 class="text-xl font-bold mb-6 italic">Crie sua arte de Natal em segundos</h2>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold mb-1">Nome da Empresa ou Família</label>
                        <input type="text" id="brandName" placeholder="Ex: Padaria do João" class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500">
                    </div>

                    <div>
                        <label class="block text-sm font-bold mb-1">Estilo da Arte</label>
                        <select id="style" class="w-full p-3 border rounded-xl outline-none">
                            <option value="classic">Clássico (Vermelho e Verde)</option>
                            <option value="luxury">Luxo (Dourado e Prata)</option>
                            <option value="cute">Fofinho (Desenho Animado)</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-bold mb-1">Formato</label>
                        <div class="flex gap-2">
                            <button onclick="setF('sq')" id="bsq" class="flex-1 p-2 bg-red-600 text-white rounded-lg font-bold">Quadrado (Feed)</button>
                            <button onclick="setF('st')" id="bst" class="flex-1 p-2 bg-gray-200 rounded-lg font-bold">Vertical (Story)</button>
                        </div>
                    </div>

                    <button onclick="generate()" id="genBtn" class="w-full bg-green-600 text-white py-4 rounded-xl font-extrabold text-lg shadow-lg hover:bg-green-700 transition">
                        GERAR COM NANO BANANA <i class="fas fa-magic ml-2"></i>
                    </button>
                </div>
            </div>

            <div class="flex flex-col items-center justify-center">
                <div id="artBox" class="relative bg-white p-2 shadow-2xl rounded-lg overflow-hidden transition-all" style="width: 350px; height: 350px;">
                    <div id="wait" class="hidden h-full flex flex-col items-center justify-center text-center p-4">
                        <i class="fas fa-snowflake fa-spin text-4xl text-blue-400 mb-4"></i>
                        <p class="font-bold">A Nano Banana está processando seu pedido natalino...</p>
                    </div>
                    <div id="placeholder" class="h-full flex flex-col items-center justify-center text-gray-300 border-4 border-dashed rounded-lg">
                        <i class="fas fa-image text-5xl mb-2"></i>
                        <p>Sua arte aparecerá aqui</p>
                    </div>
                    <img id="resImg" class="hidden w-full h-full object-cover rounded shadow-inner">
                </div>
                <button id="dlBtn" class="hidden mt-4 bg-blue-600 text-white px-6 py-2 rounded-full font-bold">
                    <i class="fas fa-download mr-2"></i> Baixar Imagem
                </button>
            </div>
        </div>
    </div>

    <script>
        let fmt = '1024x1024';

        function setF(t) {
            const bsq = document.getElementById('bsq');
            const bst = document.getElementById('bst');
            const box = document.getElementById('artBox');
            if(t === 'sq') {
                fmt = '1024x1024';
                box.style.width = '350px'; box.style.height = '350px';
                bsq.className = 'flex-1 p-2 bg-red-600 text-white rounded-lg font-bold';
                bst.className = 'flex-1 p-2 bg-gray-200 rounded-lg font-bold';
            } else {
                fmt = '1024x1792';
                box.style.width = '280px'; box.style.height = '490px';
                bst.className = 'flex-1 p-2 bg-red-600 text-white rounded-lg font-bold';
                bsq.className = 'flex-1 p-2 bg-gray-200 rounded-lg font-bold';
            }
        }

        async function generate() {
            const name = document.getElementById('brandName').value;
            const style = document.getElementById('style').value;
            const btn = document.getElementById('genBtn');
            if(!name) return alert("Digite o nome!");

            document.getElementById('placeholder').classList.add('hidden');
            document.getElementById('resImg').classList.add('hidden');
            document.getElementById('dlBtn').classList.add('hidden');
            document.getElementById('wait').classList.remove('hidden');
            btn.disabled = true;

            try {
                const res = await fetch('/generate-api', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ name, style, fmt })
                });
                const data = await res.json();
                
                if(data.url) {
                    const img = document.getElementById('resImg');
                    img.src = data.url;
                    img.classList.remove('hidden');
                    document.getElementById('dlBtn').classList.remove('hidden');
                    document.getElementById('dlBtn').onclick = () => window.open(data.url);
                } else {
                    alert("Erro ao gerar: " + data.error);
                }
            } catch (e) {
                alert("Erro na conexão.");
            } finally {
                document.getElementById('wait').classList.add('hidden');
                btn.disabled = false;
            }
        }
    </script>
</body>
</html>
    `);
});

// 2. Rota que fala com a Nano Banana (Backend Protegido)
app.post('/generate-api', async (req, res) => {
    const { name, style, fmt } = req.body;

    // Prompt otimizado para artes de Natal
    const prompt = `A professional Christmas greeting card image that says "Feliz Natal ${name}". Style: ${style}, high quality, 8k, festive decorations, cinematic lighting.`;

    try {
        const response = await fetch(NANO_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${NANO_BANANA_KEY}\`
            },
            body: JSON.stringify({
                prompt: prompt,
                size: fmt,
                n: 1
            })
        });

        const data = await response.json();
        
        // A Nano Banana costuma retornar data.data[0].url ou similar
        // Ajuste conforme a resposta exata da API deles
        const imageUrl = data.data?.[0]?.url || data.output?.[0] || null;

        if (imageUrl) {
            res.json({ url: imageUrl });
        } else {
            res.status(500).json({ error: "API não retornou imagem.", detail: data });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(\`🎄 SaaS de Natal Rodando!\`);
    console.log(\`Acesse: http://localhost:\${PORT}\`);
});
