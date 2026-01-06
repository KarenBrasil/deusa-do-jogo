import React from 'react';
import { Tab, Theme } from '../App';

interface HomeProps {
  onNavigate: (tab: Tab) => void;
  theme: Theme;
}

const Home: React.FC<HomeProps> = ({ onNavigate, theme }) => {
  return (
    <div className="p-6 space-y-10 animate-deusa max-w-4xl mx-auto">
      {/* Hero - More balanced proportions */}
      <section className="text-center pt-10 space-y-6">
        <h2 className="text-4xl md:text-6xl font-serif font-bold uppercase leading-tight tracking-tight">
          ATIVE SUA <br/> 
          <span className="bg-gradient-to-r from-[#9d66ff] via-[#f472b6] to-[#e11d48] bg-clip-text text-transparent">
            DEUSA
          </span> <br/>
          INTERIOR.
        </h2>
        <div className="space-y-2">
          <p className="text-[11px] md:text-xs font-black tracking-[0.2em] opacity-70 uppercase">
            ASSUMA O CONTROLE. <span className="text-red-500">MANIPULE O DESEJO.</span>
          </p>
          <p className="text-[11px] md:text-xs font-black tracking-[0.2em] opacity-70 uppercase">
            VENÇA O JOGO DO AMOR COM QUEM QUISER.
          </p>
        </div>
      </section>

      {/* Lógica Suprema - Adjusted with rounded font style and shorter quote */}
      <section className={`p-8 md:p-12 rounded-[40px] border shadow-xl relative overflow-hidden text-center ${theme === 'dark' ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-black/5'}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 opacity-10">
            <i className="fa-solid fa-quote-left text-6xl"></i>
        </div>
        
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-red-500 mb-6 font-sans">
            LÓGICA SUPREMA
        </h3>
        
        <p className={`text-xl md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          "O amor é uma estratégia. Decifre o código dele para assumir o trono e vencer o jogo emocional."
        </p>
        
        <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.4em] opacity-30">— PROTOCOLO DEUSA</p>
      </section>

      {/* Menu Cards - Smaller and cleaner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 'sincera', title: 'Sincera', icon: 'fa-comments' },
          { id: 'linguagens', title: 'Linguagens', icon: 'fa-heart-pulse' },
          { id: 'perfil', title: 'Alvos', icon: 'fa-user-group' },
          { id: 'vire', title: 'Arsenal', icon: 'fa-bolt' }
        ].map((card) => (
          <button 
            key={card.id}
            onClick={() => onNavigate(card.id as Tab)}
            className={`p-5 rounded-3xl flex flex-col items-center gap-3 text-center border transition-all hover:scale-[1.02] active:scale-95 ${theme === 'dark' ? 'bg-zinc-900/30 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm ${theme === 'dark' ? 'bg-violet-600/10 text-violet-400' : 'bg-black text-white'}`}>
                <i className={`fa-solid ${card.icon}`}></i>
            </div>
            <h4 className="font-bold text-[10px] uppercase tracking-widest">{card.title}</h4>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;