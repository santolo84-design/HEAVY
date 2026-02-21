import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onHome }) => {
  const [hasKey, setHasKey] = useState(false);

  // MODIFICA: Controlliamo se la chiave è presente nelle variabili d'ambiente di Netlify
  useEffect(() => {
    // Il simbolo !! trasforma il testo della chiave in un valore Vero/Falso
    const keyExists = !!import.meta.env.VITE_GEMINI_KEY;
    setHasKey(keyExists);
  }, []);

  // MODIFICA: Se l'utente clicca, lo mandiamo alla pagina per creare la chiave gratis
  const handleConnect = () => {
    window.open('https://aistudio.google.com/app/apikey', '_blank');
  };

  return (
    <nav className="bg-slate-950/50 backdrop-blur-xl border-b border-slate-900 sticky top-0 z-30">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={onHome}>
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
            <svg className="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tight text-white uppercase leading-none">Heavy Machine</span>
            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-1">Clinical OS</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-[10px] font-bold text-white uppercase">Operational</p>
            </div>
          </div>

          <button 
            onClick={handleConnect}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              hasKey 
              ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' 
              : 'bg-white text-slate-950 border-white hover:bg-slate-100'
            }`}
          >
            {hasKey ? 'Engine Linked' : 'Link Engine'}
          </button>
        </div>
      </div>
    </nav>
  );
};
