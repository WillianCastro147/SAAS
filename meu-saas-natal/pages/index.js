import { useState } from 'react';

export default function NatalSaaS() {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('classic');
  const [fmt, setFmt] = useState('sq');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const generate = async () => {
    if (!name) return alert("Digite um nome!");
    setLoading(true);
    setImage(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, style, fmt })
      });
      const data = await res.json();
      if (data.url) setImage(data.url);
      else alert("Erro ao gerar imagem.");
    } catch (e) {
      alert("Erro na conexão.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4">
      <nav className="max-w-4xl mx-auto py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-600">🎄 NatalMagic AI</h1>
      </nav>

      <main className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mt-10">
        <div className="bg-white p-8 rounded-3xl shadow-xl border">
          <h2 className="text-xl font-bold mb-6 text-slate-800">Sua Arte de Natal Profissional</h2>
          
          <div className="space-y-4">
            <input 
              type="text" placeholder="Nome da Marca/Família" 
              className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
              onChange={(e) => setName(e.target.value)}
            />

            <select className="w-full p-4 border rounded-2xl outline-none" onChange={(e) => setStyle(e.target.value)}>
              <option value="classic">Estilo Clássico</option>
              <option value="luxury">Luxo e Ouro</option>
              <option value="cute">Fofinho / Desenho</option>
            </select>

            <div className="flex gap-2">
              <button onClick={() => setFmt('sq')} className={`flex-1 p-3 rounded-xl font-bold ${fmt === 'sq' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>Post</button>
              <button onClick={() => setFmt('st')} className={`flex-1 p-3 rounded-xl font-bold ${fmt === 'st' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>Story</button>
            </div>

            <button 
              onClick={generate} disabled={loading}
              className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "GERANDO..." : "CRIAR MINHA ARTE 🎁"}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className={`bg-white shadow-2xl rounded-2xl overflow-hidden flex items-center justify-center border-4 border-white ${fmt === 'st' ? 'w-[280px] h-[490px]' : 'w-[350px] h-[350px]'}`}>
            {loading ? (
              <div className="text-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="font-bold text-slate-600 italic text-sm">A IA da Nano Banana está trabalhando...</p>
              </div>
            ) : image ? (
              <img src={image} className="w-full h-full object-cover animate-fade-in" />
            ) : (
              <p className="text-gray-400 font-medium">Sua arte aparecerá aqui</p>
            )}
          </div>
          {image && (
            <a href={image} target="_blank" className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg">
              Baixar em HD
            </a>
          )}
        </div>
      </main>
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
}
