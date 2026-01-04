
import React, { useState } from 'react';
// Fix: Added Theme import
import { UserDossier, Theme } from '../App';

interface AutoconhecimentoProps {
  onComplete: (dossier: UserDossier) => void;
  // Fix: Added theme prop to interface
  theme: Theme;
}

// Fix: Updated component to accept theme prop
const Autoconhecimento: React.FC<AutoconhecimentoProps> = ({ onComplete, theme }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = [
    { q: "Quem costuma decidir o local e horário do encontro?", options: ["Eu sempre tomo a frente", "Eu deixo ele sugerir e avalio", "Eu espero ele decidir tudo", "Ninguém decide, acontece"], type: 'polarity' },
    { q: "Receber um presente caro sem motivo te faz sentir:", options: ["Confortável e merecedora", "Culpada ou na obrigação de retribuir", "Desconfiada das intenções", "Nem ligo muito"], type: 'polarity' },
    { q: "Se ele demora 4 horas para responder, você:", options: ["Fico ansiosa e cobro atenção", "Continuo minha vida, ele responderá", "Penso em dar o troco sumindo também", "Sinto que ele não me quer mais"], type: 'attachment' },
    { q: "Como você lida com a vulnerabilidade emocional?", options: ["Busco o apoio dele imediatamente", "Me acolho primeiro e depois compartilho", "Me escondo para não parecer fraca", "Fico brava para esconder a tristeza"], type: 'attachment' },
    { q: "Qual dessas deusas mais ressoa com você hoje?", options: ["Afrodite (Sedução e Prazer)", "Atena (Lógica e Carreira)", "Hera (Compromisso e Status)", "Ártemis (Independência e Foco)"], type: 'archetype' },
    { q: "Sua imagem para o mundo foca em:", options: ["Magnetismo e Atração", "Competência e Inteligência", "Elegância e Soberania", "Praticidade e Liberdade"], type: 'archetype' }
  ];

  const handleAnswer = (index: number) => {
    const newAnswers = [...answers, index];
    if (step < questions.length - 1) {
      setAnswers(newAnswers);
      setStep(step + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: number[]) => {
    const polAns = finalAnswers.slice(0, 2);
    const attAns = finalAnswers.slice(2, 4);
    const archAns = finalAnswers.slice(4, 6);
    
    let polarity: UserDossier['polarity'] = (polAns[0] === 0) ? 'Hiperativa' : 'Equilibrada';
    let attachment: UserDossier['attachment'] = (attAns[0] === 1) ? 'Seguro' : 'Ansioso';
    
    const archMap: Record<number, UserDossier['archetypeDominant']> = { 0: 'Afrodite', 1: 'Atena', 2: 'Hera', 3: 'Ártemis' };
    const dominant = archMap[archAns[0]] || 'Afrodite';

    const result: UserDossier = {
      polarity,
      attachment,
      archetypeDominant: dominant,
      archetypeToDevelop: dominant === 'Afrodite' ? 'Atena' : 'Afrodite'
    };

    localStorage.setItem('deusa_dossier', JSON.stringify(result));
    onComplete(result);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-12 animate-deusa pt-16 pb-24">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif italic text-white">Seu <span className="text-violet-500">Dossiê Core</span></h2>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-500" style={{ width: `${(step / questions.length) * 100}%` }}></div>
        </div>
        <p className="text-[12px] uppercase tracking-[0.4em] text-gray-500 font-black">Progresso: {step + 1} / {questions.length}</p>
      </div>

      <div className="card-deusa p-10 space-y-10 min-h-[450px] flex flex-col justify-center bg-black/60 shadow-2xl border-violet-500/20">
        <h3 className="text-3xl font-bold text-white text-center leading-tight">{questions[step].q}</h3>
        <div className="grid grid-cols-1 gap-4">
          {questions[step].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full py-6 px-8 text-lg font-semibold text-left rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-violet-500 hover:bg-violet-900/20 transition-all active:scale-95"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Autoconhecimento;
