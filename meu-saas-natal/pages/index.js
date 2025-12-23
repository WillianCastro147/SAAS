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
                <button onClick={() => setFmt('sq')} className={`flex-1 p-4 rounded-2xl font-bold transition-all ${fmt === 'sq' ? 'bg-slate-800 text-white shadow-lg' : 'bg
