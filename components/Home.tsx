
import React from 'react';
import { Tab, Theme } from '../App';

interface HomeProps {
  onNavigate: (tab: Tab) => void;
  theme: Theme;
}

const Home: React.FC<HomeProps> = ({ onNavigate, theme }) => {
  return (
    <div className="p-6 space-y-12 animate-deusa">
      {/* Hero */}
      <section className="text-center pt-8 space-y-4">
        <h2 className="text-5xl font-serif italic mb-2 leading-[1.1]">
          Sua soberania <br/> começa no <span className="text-[#9d66ff]">agora.</span>
        </h2>
        <p className={`text-sm max-w-[300px] mx-auto opacity-60`}>
          A mentoria estratégica que transforma instinto em poder. Mude o jogo através da sabedoria.
        </p>
      </section>

      {/* Triplex em Destaque */}
      <section className={`p-10 rounded-[40px] border-l-8 border-l-red-600 shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-zinc-900 to-black' : 'bg-white border-black/5'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5">
            <i className="fa-solid fa-quote-right text-6xl"></i>
        </div>
        <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-red-600 mb-6 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-red-600"></span>
            Lógica Suprema
        </h3>
        <p className={`text-2xl font-serif italic leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          "O amor não é apenas um sentimento, é uma estratégia de evolução mútua. Quando você decifra o código emocional dele, você não apenas vence o jogo, você cura a relação."
        </p>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">— Protocolo Deusa do Jogo</p>
      </section>

      {/* Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { id: 'sincera', title: 'Perguntas Sinceras', icon: 'fa-comments', desc: 'Respostas reais e chat consultivo.' },
          { id: 'linguagens', title: 'Linguagens do Amor', icon: 'fa-heart-pulse', desc: 'Diagnóstico de compatibilidade.' },
          { id: 'perfil', title: 'Mapeamento de Alvos', icon: 'fa-user-group', desc: 'Decifre quem está à mesa.' },
          { id: 'vire', title: 'Arsenal de Scripts', icon: 'fa-bolt', desc: 'Respostas prontas para tudo.' }
        ].map((card) => (
          <button 
            key={card.id}
            onClick={() => onNavigate(card.id as Tab)}
            className={`p-7 rounded-[32px] flex flex-col gap-4 text-left border transition-all hover:scale-[1.02] active:scale-95 ${theme === 'dark' ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${theme === 'dark' ? 'bg-violet-600/20 text-violet-400' : 'bg-black text-white'}`}>
                <i className={`fa-solid ${card.icon}`}></i>
            </div>
            <div>
              <h4 className="font-bold text-lg leading-none mb-1">{card.title}</h4>
              <p className="text-xs opacity-50">{card.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
