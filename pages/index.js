import { useState, useRef } from 'react';
import Head from 'next/head';

export default function NatalMagic() {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('classic');
  const [fmt, setFmt] = useState('sq');
  const [loading, setLoading] = useState(false);
  const [bgImage, setBgImage] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [currentPhrase, setCurrentPhrase] = useState('');
  const fileInputRef = useRef(null);

  const phrases = [
    "Que a magia ilumine sua vida!",
    "Tempo de paz, amor e união.",
    "Celebrando momentos únicos!",
    "Gratidão por este ano!"
  ];

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setUserPhoto(URL.createObjectURL(file));
  };

  const generate = async () => {
    if (!name || !userPhoto) return alert("Digite o nome e adicione sua foto!");
    setLoading(true);
    setBgImage(null);
    const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setCurrentPhrase(selectedPhrase);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, style, fmt, phrase: selectedPhrase })
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
    <div className="min-h-screen bg-[#fffafa] text-slate-900 pb-20">
      <Head>
        <title>NatalMagic AI - Premium</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap" rel="stylesheet" />
      </Head>

      <nav className="p-6 bg-white border-b flex justify-between items-center shadow-sm sticky top-0 z-50">
        <h1 className="text-2xl font-black text-red-600 tracking-tighter" style={{fontFamily: 'Cinzel'}}>NATAL MAGIC</h1>
        <div className="bg-red-600 text-white text-[10px] px-3 py-1 rounded-full font-bold">PREMIUM AI</div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 grid lg:grid-cols-2 gap-12 mt-10">
        {/* Formulário */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-red-50 h-fit">
          <h2 className="text-2xl font-bold text-red-900 mb-6 italic">Crie sua Magia 🎁</h2>
          <div className="space-y-6">
            <input 
              type="text" placeholder="Nome ou Marca" 
              className="w-full p-4 bg-red-50/30 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-bold"
              onChange={(e) => setName(e.target.value)}
            />

            <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-red-200 p-8 text-center rounded-3xl cursor-pointer hover:bg-red-50">
              {userPhoto ? (
                <div className="flex flex-col items-center">
                  <img src={userPhoto} className="w-16 h-16 object-cover rounded-full mb-2" />
                  <span className="text-green-600 font-bold text-sm">✅ Foto Carregada</span>
                </div>
              ) : (
                <span className="text-red-400 font-bold">📸 Clique para subir sua foto</span>
              )}
              <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
            </div>

            <select className="w-full p-4 bg-red-50/30 border rounded-2xl font-bold text-red-800" onChange={(e) => setStyle(e.target.value)}>
              <option value="classic">Clássico (Vermelho/Verde)</option>
              <option value="luxury">Luxo (Ouro/Preto)</option>
              <option value="cute">Fofo (Infantil 3D)</option>
            </select>

            <div className="flex gap-2">
              <button onClick={() => setFmt('sq')} className={`flex-1 py-3 rounded-xl font-bold ${fmt === 'sq' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>Post</button>
              <button onClick={() => setFmt('st')} className={`flex-1 py-3 rounded-xl font-bold ${fmt === 'st' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>Story</button>
            </div>

            <button 
              onClick={generate} disabled={loading}
              className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-red-700 disabled:opacity-50 transition-all"
            >
              {loading ? "CRIANDO..." : "GERAR ARTE AGORA 🚀"}
            </button>
          </div>
        </div>

        {/* Resultado com Sobreposição */}
        <div className="flex flex-col items-center">
          <div className={`relative bg-white rounded-[2rem] shadow-2xl overflow-hidden border-8 border-white transition-all duration-700 ${fmt === 'st' ? 'w-[300px] h-[533px]' : 'w-[400px] h-[400px]'}`}>
            {loading && (
              <div className="absolute inset-0 z-50 bg-white/90 flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold text-red-600">IA Gerando Cenário...</p>
              </div>
            )}

            {bgImage ? (
              <div className="relative w-full h-full">
                <img src={bgImage} className="w-full h-full object-cover" />
                {/* O TRUQUE: Foto do usuário centralizada na moldura da IA */}
                <div className={`absolute left-1/2 -translate-x-1/2 overflow-hidden shadow-inner border-2 border-white/20 ${fmt === 'st' ? 'top-[22%] w-[48%] h-[26%]' : 'top-[25%] w-[45%] h-[40%]'}`}>
                  <img src={userPhoto} className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-200 bg-slate-50">
                <span className="text-6xl mb-4">🖼️</span>
                <p className="font-bold text-xs uppercase tracking-widest">Preview</p>
              </div>
            )}
          </div>
          {bgImage && !loading && (
            <div className="mt-8 text-center">
              <p className="text-red-600 font-bold italic mb-4">"{currentPhrase}"</p>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">✨ Ficou lindo! Tire um print para salvar ✨</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
