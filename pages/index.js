import { useState, useRef } from 'react';
import Head from 'next/head';

export default function NatalMagic() {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('classic');
  const [fmt, setFmt] = useState('sq');
  const [loading, setLoading] = useState(false);
  const [bgImage, setBgImage] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [phrase, setPhrase] = useState('');
  const fileInputRef = useRef(null);

  const phrases = ["Que a magia brilhe!", "Paz e muito amor!", "Momentos mágicos!", "Feliz 2026!"];

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setUserPhoto(URL.createObjectURL(file));
  };

  const generate = async () => {
    if (!name || !userPhoto) return alert("Preencha o nome e a foto!");
    setLoading(true);
    setBgImage(null);
    const selPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setPhrase(selPhrase);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, style, fmt, phrase: selPhrase })
      });
      const data = await res.json();
      if (res.ok && data.url) setBgImage(data.url);
      else alert(data.error || "Erro ao gerar.");
    } catch (e) {
      alert("Erro de conexão.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Head>
        <title>NatalMagic AI - Gemini</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <nav className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-red-600">NATAL MAGIC <span className="text-slate-400 font-light">| Gemini</span></h1>
      </nav>

      <main className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-10 mt-10">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border space-y-6 h-fit">
          <input 
            type="text" placeholder="Nome ou Marca" 
            className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-bold"
            onChange={(e) => setName(e.target.value)}
          />

          <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-red-200 p-8 text-center rounded-2xl cursor-pointer hover:bg-red-50">
            {userPhoto ? <span className="text-green-600 font-bold">✅ Foto Pronta</span> : <span className="text-red-400 font-bold">📸 Clique e envie sua foto</span>}
            <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
          </div>

          <select className="w-full p-4 border rounded-2xl font-bold" onChange={(e) => setStyle(e.target.value)}>
            <option value="classic">Estilo Clássico</option>
            <option value="luxury">Luxo & Ouro</option>
            <option value="cute">Fofinho (3D)</option>
          </select>

          <button onClick={generate} disabled={loading} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-red-700 disabled:opacity-50">
            {loading ? "GERANDO..." : "CRIAR MINHA ARTE 🎁"}
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className={`relative bg-white rounded-[2rem] shadow-2xl overflow-hidden border-8 border-white ${fmt === 'st' ? 'w-[300px] h-[533px]' : 'w-[400px] h-[400px]'}`}>
            {loading && (
              <div className="absolute inset-0 z-10 bg-white/90 flex flex-col items-center justify-center text-red-600 font-bold">IA Gerando Cenário...</div>
            )}

            {bgImage ? (
              <div className="relative w-full h-full">
                <img src={bgImage} className="w-full h-full object-cover" />
                <div className={`absolute left-1/2 -translate-x-1/2 overflow-hidden border-2 border-white/50 ${fmt === 'st' ? 'top-[22%] w-[48%] h-[26%]' : 'top-[25%] w-[44%] h-[38%]'}`}>
                  <img src={userPhoto} className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-200 font-bold uppercase tracking-widest text-xs">Aguardando...</div>
            )}
          </div>
          {bgImage && <p className="mt-4 text-red-600 font-bold animate-pulse tracking-widest">✨ TIRE UM PRINT PARA SALVAR! ✨</p>}
        </div>
      </main>
    </div>
  );
}
