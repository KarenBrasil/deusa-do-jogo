
import React, { useState } from 'react';
import { Theme, LoveLanguages } from '../App';

interface LinguagensAmorProps {
  theme: Theme;
  onComplete: (langs: LoveLanguages) => void;
}

const LinguagensAmor: React.FC<LinguagensAmorProps> = ({ theme, onComplete }) => {
  const [step, setStep] = useState<'intro' | 'quiz-user' | 'quiz-partner' | 'result'>('intro');
  const [userScores, setUserScores] = useState<Record<string, number>>({ A: 0, B: 0, C: 0, D: 0, E: 0 });
  const [partnerScores, setPartnerScores] = useState<Record<string, number>>({ A: 0, B: 0, C: 0, D: 0, E: 0 });
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const langNames: Record<string, string> = {
    A: "Palavras de Afirmação",
    B: "Tempo de Qualidade",
    C: "Presentes",
    D: "Atos de Serviço",
    E: "Toque Físico"
  };

  const questions = [
    { q: "Um elogio inesperado me faz sentir a Deusa mais poderosa do Egito.", type: 'A' },
    { q: "Celular na mesa é meu kryptonita; prefiro attention total ou nada.", type: 'B' },
    { q: "Lembrancinhas aleatórias provam que ele pensa em mim, não só no próprio ego.", type: 'C' },
    { q: "Ele resolver um perrengue chato pra mim é mais sexy que flores.", type: 'D' },
    { q: "Abraço de urso e cafuné resolvem 90% dos meus problemas diários.", type: 'E' },
    { q: "Ouvir 'tenho orgulho de você' me faz flutuar mais que taça de champanhe.", type: 'A' },
    { q: "Amo planejar rituais só nossos; presença é o investimento real.", type: 'B' },
    { q: "Se a data é especial e não tem presente, o magnetismo cai na hora.", type: 'C' },
    { q: "Ele me trazer um café na cama ou facilitar minha vida é puro amor.", type: 'D' },
    { q: "Mãos dadas e contato físico são o meu Wi-Fi emocional.", type: 'E' }
  ];

  const handleAnswer = (val: number) => {
    const scores = step === 'quiz-user' ? userScores : partnerScores;
    const type = questions[currentQuestion].type;
    const newScores = { ...scores, [type]: scores[type] + val };

    if (step === 'quiz-user') setUserScores(newScores);
    else setPartnerScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      if (step === 'quiz-user') {
        setStep('quiz-partner');
        setCurrentQuestion(0);
      } else {
        processResults(userScores, newScores);
      }
    }
  };

  const processResults = (u: Record<string, number>, p: Record<string, number>) => {
    const getTop = (scores: Record<string, number>) => {
      const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      return {
        primary: langNames[sorted[0][0]],
        secondary: langNames[sorted[1][0]],
        neglected: langNames[sorted[4][0]]
      };
    };

    const userRes = getTop(u);
    const partnerRes = getTop(p);
    const comp = userRes.primary === partnerRes.primary ? 95 : (userRes.primary === partnerRes.secondary ? 75 : 55);

    const final: LoveLanguages = { user: userRes, partner: partnerRes, compatibility: comp };
    localStorage.setItem('deusa_languages', JSON.stringify(final));
    onComplete(final);
    setStep('result');
  };

  const results = step === 'result' ? JSON.parse(localStorage.getItem('deusa_languages')!) as LoveLanguages : null;

  const getActionTip = (lang: string) => {
    switch(lang) {
      case "Palavras de Afirmação": return "Valide o esforço dele com elogios específicos sobre sua masculinidade e provisão. Ative a voz de Rainha.";
      case "Tempo de Qualidade": return "Crie rituais sem telas. Esteja 100% lá. O magnetismo está na sua presença soberana.";
      case "Presentes": return "Mime-o com detalhes que mostram que você o observa. O valor está na exclusividade, não no preço.";
      case "Atos de Serviço": return "Facilite a vida dele onde ele mais falha. Seja a aliada estratégica que resolve o que ele não consegue.";
      case "Toque Físico": return "Mantenha o contato constante. Um toque sutil no braço ou um abraço longo desarma qualquer defesa masculina.";
      default: return "";
    }
  };

  return (
    <div className="p-6 space-y-10 animate-deusa pb-24">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif italic">Linguagens <span className="text-[#9d66ff]">do Amor</span></h2>
        <p className="text-sm opacity-50 max-w-sm mx-auto">Decifre o código emocional dele sem perder a sua classe.</p>
      </div>

      {step === 'intro' && (
        <section className={`p-10 rounded-[48px] border text-center space-y-8 ${theme === 'dark' ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-fuchsia-600/10 border border-fuchsia-500/20 text-fuchsia-500">
              <i className="fa-solid fa-venus text-2xl mb-2"></i>
              <p className="text-[10px] font-black uppercase tracking-widest">Seu Perfil</p>
            </div>
            <div className="p-6 rounded-3xl bg-zinc-600/10 border border-zinc-500/20 text-zinc-500">
              <i className="fa-solid fa-mars text-2xl mb-2"></i>
              <p className="text-[10px] font-black uppercase tracking-widest">O Perfil Dele</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed opacity-80">
            Apenas 10 perguntas rápidas para entender como você funciona e como ele entende o amor. Seja sincera, Deusa.
          </p>
          <button 
            onClick={() => setStep('quiz-user')}
            className="w-full py-6 rounded-3xl bg-violet-600 text-white font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
          >
            descobrir a linguagem do amor
          </button>
        </section>
      )}

      {(step === 'quiz-user' || step === 'quiz-partner') && (
        <section className={`p-10 rounded-[48px] border shadow-2xl space-y-10 ${step === 'quiz-user' ? (theme === 'dark' ? 'bg-fuchsia-900/10 border-fuchsia-500/20' : 'bg-fuchsia-50 border-fuchsia-200') : (theme === 'dark' ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-black/5')}`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
              {step === 'quiz-user' ? 'Você' : 'Ele'}
            </span>
            <span className="text-[10px] font-black opacity-40">{currentQuestion + 1} / {questions.length}</span>
          </div>

          <h3 className="text-2xl font-serif italic text-center leading-tight">
            {step === 'quiz-user' ? questions[currentQuestion].q : questions[currentQuestion].q.replace('me faz sentir', 'faz ele se sentir').replace('Amo', 'Ele parece amar').replace('me traz', 'traz pra ele')}
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {[3, 2, 1, 0].map((val) => (
              <button
                key={val}
                onClick={() => handleAnswer(val)}
                className={`py-5 rounded-2xl border text-sm font-bold transition-all active:scale-95 ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}
              >
                {val === 3 ? 'Com certeza' : val === 2 ? 'Às vezes' : val === 1 ? 'Quase nunca' : 'Jamais'}
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 'result' && results && (
        <div className="space-y-8 animate-deusa">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-8 rounded-[40px] border ${theme === 'dark' ? 'bg-fuchsia-900/10 border-fuchsia-500/20' : 'bg-fuchsia-50 border-fuchsia-100'}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-fuchsia-500 mb-4">Seu Ranking</p>
              <div className="space-y-2">
                <p className="text-sm font-bold">1. {results.user.primary}</p>
                <p className="text-xs opacity-60">Negligenciada: {results.user.neglected}</p>
              </div>
            </div>
            <div className={`p-8 rounded-[40px] border ${theme === 'dark' ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Ranking Dele</p>
              <div className="space-y-2">
                <p className="text-sm font-bold">1. {results.partner.primary}</p>
                <p className="text-xs opacity-60">Negligenciada: {results.partner.neglected}</p>
              </div>
            </div>
          </div>

          <section className={`p-10 rounded-[48px] border space-y-8 ${theme === 'dark' ? 'bg-zinc-900/40 border-violet-500/20' : 'bg-violet-50 border-violet-100'}`}>
            <h4 className="text-xl font-serif italic text-center">Protocolo de Reconexão</h4>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-violet-500 tracking-widest">Para dominar a dele:</p>
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-black/60 border-white/5' : 'bg-white border-black/5'}`}>
                  <p className="text-sm font-bold mb-2">Ação Soberana:</p>
                  <p className="text-sm opacity-80 leading-relaxed">{getActionTip(results.partner.primary)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-fuchsia-500 tracking-widest">Para dominar a sua:</p>
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-black/60 border-white/5' : 'bg-white border-black/5'}`}>
                  <p className="text-sm font-bold mb-2">Sua Postura:</p>
                  <p className="text-sm opacity-80 leading-relaxed">Comunique suas necessidades sem drama. Em vez de cobrar, diga: 'Eu me sinto tão conectada a você quando {results.user.primary === 'Palavras de Afirmação' ? 'ouço seus elogios' : results.user.primary === 'Tempo de Qualidade' ? 'temos nosso momento a sós' : results.user.primary === 'Presentes' ? 'vejo que você pensou em mim com um mimo' : results.user.primary === 'Atos de Serviço' ? 'você resolve essas coisas por mim' : 'temos esse contato físico'}.'</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-red-500 tracking-widest">O que evitar:</p>
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-red-900/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
                  <p className="text-sm opacity-80 leading-relaxed">Não use a negligência dele como punição. A Deusa estratega supre a necessidade do parceiro para que ele sinta o desejo natural de suprir a dela. É um jogo de espelhos, não de guerra.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep('intro')}
              className="w-full py-4 rounded-full text-[10px] font-black uppercase tracking-widest opacity-40"
            >
              Refazer
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default LinguagensAmor;
