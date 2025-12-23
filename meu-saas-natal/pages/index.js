import { useState } from 'react';
import Head from 'next/head';

export default function NatalSaaS() {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('classic');
  const [fmt, setFmt] = useState('sq');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const getGreeting = (brandName, artStyle) => {
    const greetings = {
      classic: `🎄 Que a magia do Natal ilumine todos os seus sonhos! A ${brandName} deseja a você e sua família um Natal repleto de paz, amor e união. Boas festas! 🎅✨`,
      luxury: `🥂 Excelência e gratidão definem nosso ano. A ${brandName} deseja a você um Natal sofisticado e um brinde à vida. Feliz Natal! ✨⭐`,
      cute: `🎁 Ho-ho-ho! Passando para deixar um abraço quentinho. Que a alegria transborde! Com carinho, ${brandName} 🦌❤️`
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
        setMessage(getGreeting(name, style));
      } else {
        alert("Erro na Nano Banana. Verifique sua chave API nas configurações da Vercel.");
      }
    } catch (e) {
      alert("Erro de conexão. Tente novamente.");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${message} \n\nVeja minha arte: ${image}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      <Head>
        <title>NatalMagic AI - Gerador de Artes</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <nav className="bg-white border-b p-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black text-red-600 tracking-tighter">NATAL<span className="text-slate-800">MAGIC</span></h1>
          <div className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded border border-green-200">API NANO BANANA ATIVA</div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 p-6 py-10">
        {/* Painel de Controle */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 h-fit">
          <h2 className="text-2xl font-bold mb-2">Criar Arte 🎁</h2>
          <p className="text-gray-500 text-sm mb-8">Insira os dados abaixo para gerar sua arte com IA.</p>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Sua Marca ou Nome</label>
              <input 
                type="text" placeholder="Ex: Café Estrela" 
                className="w-full mt-1 p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Estilo da IA</label>
              <select className="w-full mt-1 p-4 bg-gray-50 border rounded-2xl outline-none" onChange={(e) => setStyle(e.target.value)}>
                <option value="classic">Clássico (Vermelho/Verde)</option>
                <option value="luxury">Luxo (Dourado/Preto)</option>
                <option value="cute">Fofo (Ilustração)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setFmt('sq')} className={`flex-1 py-3 rounded-xl font-bold border transition-all ${fmt === 'sq' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-gray-200'}`}>Feed (1:1)</button>
              <button onClick={() => setFmt('st')} className={`flex-1 py-3 rounded-xl font-bold border transition-all ${fmt === 'st' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-gray-200'}`}>Story (9:16)</button>
            </div>

            <button 
              onClick={generate} disabled={loading}
              className="w-full bg-red-600 text-white py-5 rounded-[20px] font-black text-xl hover:bg-red-700 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? "GERANDO ARTE..." : "GERAR AGORA 🚀"}
            </button>
          </div>
        </div>

        {/* Resultado */}
        <div className="flex flex-col items-center">
