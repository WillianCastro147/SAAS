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

  // Função para gerar a legenda baseada no estilo
  const getGreeting = (brandName, artStyle) => {
    const texts = {
      classic: `🎄 Que a magia do Natal ilumine sua casa! A ${brandName} deseja um Feliz Natal repleto de união. 🎅`,
      luxury: `✨ Um brinde à prosperidade e aos novos ciclos. A ${brandName} deseja a você um Natal sofisticado e brilhante. 🥂`,
      cute: `🎁 Ho-ho-ho! Um abraço carinhoso da equipe ${brandName}. Que seu Natal seja doce e muito divertido! 🦌`
    };
    return texts[artStyle] || texts.classic;
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
        alert("Erro ao gerar. Verifique se sua chave da Nano Banana foi adicionada na Vercel.");
      }
    } catch (e) {
      alert("Erro na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-slate-900">
      <Head>
        <title>NatalMagic AI - Artes de Natal</title>
        {/* Tailwind carregado via CDN de forma segura no Next.js */}
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 p-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎄</span>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter">NATAL<span className="text-red-600">MAGIC</span></h1>
          </div>
          <div className="text-[10px] font-bold bg-green-50 text-green-600 border border-green-200 px-3 py-1 rounded-full uppercase tracking-widest">
            Nano Banana API
          </div>
        </div>
      </nav>

      {/* Main
