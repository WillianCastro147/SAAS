import { useState } from 'react';
import { Copy, Check, Download, Sparkles } from 'lucide-react';

export default function NatalSaaS() {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('classic');
  const [fmt, setFmt] = useState('sq');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Função para gerar a legenda automática
  const getGreeting = (brandName, artStyle) => {
    const greetings = {
      classic: `🎄 Que a magia do Natal ilumine todos os seus sonhos! A ${brandName} deseja a você e sua família um Natal repleto de paz, amor e união. Boas festas! 🎅✨`,
      luxury: `🥂 Excelência e gratidão definem nosso ano. A ${brandName} deseja a você um Natal sofisticado e um brinde à vida e às novas conquistas. Feliz Natal! ✨⭐`,
      cute: `🎁 Ho-ho-ho! Passando para deixar um abraço quentinho e desejar um Natal super especial. Que a alegria transborde! Com carinho, ${brandName} 🦌❤️`
    };
    return greetings[artStyle] || greetings.classic;
  };

  const generate = async () => {
    if (!name) return alert("Por favor, digite o nome!");
    setLoading(true);
    setImage(null);
    setMessage('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, style, fmt })
      });
      const data = await res.json();
      
      if (data.url) {
        setImage(data.url);
        setMessage(getGreeting(name, style)); // Gera a mensagem aqui
      } else {
        alert("Erro ao gerar imagem. Verifique seus créditos na Nano Banana.");
      }
    } catch (e) {
      alert("Erro na conexão.");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Header Festivo */}
      <nav className="bg-white border-b border-red-100 p-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-2 rounded-lg text-white">
              <Sparkles size={20} />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">NATAL<span className="text-red-600">MAGIC</span></h1>
          </div>
          <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">POWERED BY NANO BANANA</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 p-6 md:py-12">
        {/* Coluna Esquerda: Form */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Criador de Magia 🪄</h2>
            <p className="text-slate-500 mb-8 text-sm">Crie posts profissionais para sua empresa em segundos.</p>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nome da Marca</label>
                <input 
                  type="text" placeholder="Ex: Padaria Central" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Estilo Visual</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none cursor-pointer" onChange={(e) => setStyle(e.target.value)}>
                  <option value="classic">🎄 Clássico Natalino</option>
                  <option value="luxury">✨ Luxo e Ouro</option>
                  <option value="cute">🦌 Fofinho / Kids</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setFmt('sq')} className={`flex-1 p-4 rounded-2xl font-bold transition-all ${fmt === 'sq' ? 'bg-slate-800 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600'}`}>Post (1:1)</button>
                <button onClick={() => setFmt('st')} className={`flex-1 p-4 rounded-2xl font-bold transition-all ${fmt === 'st' ? 'bg-slate-800 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600'}`}>Story (9:16)</button>
              </div>

              <button 
                onClick={generate} disabled={loading}
                className="w-full bg-red-600 text-white py-5 rounded-[24px] font-black text-xl hover:bg-red-700 transition-all shadow-xl shadow-red-200 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
              >
                {loading ? "PREPARANDO PRESENTES..." : "GERAR MINHA ARTE 🎁"}
              </button>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Preview */}
        <div className="flex flex-col items-center">
          <div className={`bg-slate-200 rounded-[2rem] overflow-hidden flex items-center justify-center relative border-[8px] border-white shadow-2xl transition-all duration-500 ${fmt === 'st' ? 'w-[300px] h-[533px]' : 'w-[400px] h-[400px]'}`}>
            {loading ? (
              <div className="text-center bg-white/80 backdrop-blur-md absolute inset-0 z-10 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold text-red-600 animate-pulse">A IA está criando sua arte...</p>
              </div>
            ) : null}

            {image ? (
              <img src={image} className="w-full h-full object-cover animate-in fade-in zoom-in duration-700" />
            ) : (
              <div className="text-slate-400 text-center p-8">
                <p className="font-medium">Sua arte aparecerá aqui após o clique.</p>
              </div>
            )}
          </div>

          {/* Seção da Mensagem Automática */}
          {message && !loading && (
            <div className="mt-8 w-full animate-in slide-in-from-bottom duration-500">
              <div className="bg-green-50 border border-green-100 p-6 rounded-3xl relative group">
                <h4 className="text-xs font-black text-green-700 uppercase mb-3 flex items-center gap-2">
                  <Sparkles size={14} /> Legenda Sugerida
                </h4>
                <p className="text-slate-700 leading-relaxed italic">"{message}"</p>
                <button 
                  onClick={copyToClipboard}
                  className="mt-4 flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  {copied ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar Texto</>}
                </button>
              </div>
              
              <a href={image} target="_blank" download className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all">
                <Download size={20} /> Baixar Imagem HD
              </a>
            </div>
          )}
        </div>
      </main>

      {/* Tailwind via CDN para facilitar */}
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
}
