
import React, { useState } from 'react';
import { Theme } from '../App';

interface Script {
  type: 'responder' | 'esperar' | 'afastar' | 'conectar';
  title: string;
  script: string;
  logic: string;
}

const VireOJogo: React.FC<{ theme: Theme }> = ({ theme }) => {
  const [filter, setFilter] = useState<'all' | 'responder' | 'esperar' | 'afastar' | 'conectar'>('all');

  const scripts: Script[] = [
    { 
      type: 'conectar', 
      title: "Ele está distante e você quer reconectar", 
      script: "Senti falta daquela sua energia de ontem. Estava lembrando de como você resolve as coisas com tanta calma. Fiquei curiosa pra saber do seu dia.", 
      logic: "Ativa o arquétipo do herói e o instinto de provisão dele através da admiração. É a isca perfeita para trazê-lo de volta sem cobranças." 
    },
    { 
      type: 'responder', 
      title: "Ele sumiu e voltou com um 'Oi'", 
      script: "Oi! Que surpresa boa. Eu estava justamente aqui imersa em uns projetos maravilhosos. O que manda de bom?", 
      logic: "Demonstra que sua vida é rica e independente. Você é receptiva, mas não estava esperando sentada." 
    },
    { 
      type: 'afastar', 
      title: "Ele propôs um encontro de baixo esforço", 
      script: "Adoro convites, mas hoje estou numa vibe de algo mais especial. Quando você planejar um jantar ou algo diferente, me avise!", 
      logic: "Coloca o sarrafo no alto. Você não rejeita ele, rejeita o baixo esforço dele. Isso estimula o instinto de caça." 
    },
    { 
      type: 'conectar', 
      title: "Clima pesado após discussão boba", 
      script: "Ei, não gosto de ficar nesse muro entre nós. Prefiro quando somos o porto seguro um do outro. Vamos deixar o orgulho de lado e focar no que importa?", 
      logic: "Apego seguro puro. Você abre a porta da vulnerabilidade e convida ele a ser o protetor do relacionamento de novo." 
    },
    { 
      type: 'esperar', 
      title: "Ele visualizou e não respondeu", 
      script: "[Mantenha o silêncio total. Não envie emojis ou '?' e poste algo seu muito feliz no Stories.]", 
      logic: "O vácuo é um espaço de reflexão. Deixe-o preencher com a própria saudade. Se você cobra, você mata o desejo." 
    }
  ];

  const filtered = filter === 'all' ? scripts : scripts.filter(s => s.type === filter);

  const copyScript = (s: string) => {
    navigator.clipboard.writeText(s);
  };

  return (
    <div className="p-6 space-y-12 animate-deusa pb-24">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif italic">Arsenal de <span className="text-[#9d66ff]">Scripts</span></h2>
        <p className="text-lg opacity-60">Respostas estratégicas baseadas na Lógica Suprema de Reconexão.</p>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {['all', 'conectar', 'responder', 'esperar', 'afastar'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-8 py-4 rounded-[28px] text-xs font-black uppercase tracking-widest border transition-all ${
              filter === f ? (theme === 'dark' ? 'bg-white text-black border-white' : 'bg-black text-white border-black') : (theme === 'dark' ? 'bg-zinc-900 text-gray-500 border-white/5' : 'bg-gray-100 text-gray-500 border-black/5')
            }`}
          >
            {f === 'conectar' ? 'RECONECTAR' : f.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.map((s, idx) => (
          <div key={idx} className={`p-10 rounded-[48px] border shadow-2xl transition-all hover:scale-[1.01] ${theme === 'dark' ? 'bg-zinc-900/60 border-white/5' : 'bg-white border-black/5'}`}>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-500 mb-6">{s.title}</h3>
            <p className="text-2xl font-serif italic mb-10 leading-relaxed">"{s.script}"</p>
            <div className="pt-8 border-t border-white/5">
              <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-3">Lógica Suprema:</p>
              <p className="text-base text-gray-400 leading-relaxed mb-8">{s.logic}</p>
              <button 
                onClick={() => copyScript(s.script)}
                className={`w-full py-6 rounded-[32px] text-xs font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-white text-black hover:bg-violet-600 hover:text-white' : 'bg-black text-white hover:bg-violet-600 shadow-xl'}`}
              >
                Copiar para o Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VireOJogo;
