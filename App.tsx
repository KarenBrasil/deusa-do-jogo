
import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import SinceraUnificada from './components/SinceraUnificada';
import ModoDeusa from './components/ModoDeusa';
import PerfilHomens from './components/PerfilHomens';
import LinguagensAmor from './components/LinguagensAmor';
import VireOJogo from './components/VireOJogo';
import Autoconhecimento from './components/Autoconhecimento';
import Header from './components/Header';

export type Tab = 'home' | 'sincera' | 'modo' | 'perfil' | 'linguagens' | 'vire' | 'autoconhecimento';
export type Theme = 'dark' | 'clean';

export interface UserDossier {
  polarity: 'Equilibrada' | 'Hiperativa' | 'Bloqueada';
  attachment: 'Seguro' | 'Ansioso' | 'Evitativo';
  archetypeDominant: 'Afrodite' | 'Atena' | 'Hera' | 'Ártemis';
  archetypeToDevelop: string;
}

export interface LoveLanguages {
  user: { primary: string; secondary: string; neglected: string };
  partner: { primary: string; secondary: string; neglected: string };
  compatibility: number;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [theme, setTheme] = useState<Theme>('dark');
  const [dossier, setDossier] = useState<UserDossier | null>(null);
  const [languages, setLanguages] = useState<LoveLanguages | null>(null);

  useEffect(() => {
    const savedDossier = localStorage.getItem('deusa_dossier');
    if (savedDossier) setDossier(JSON.parse(savedDossier));
    
    const savedLanguages = localStorage.getItem('deusa_languages');
    if (savedLanguages) setLanguages(JSON.parse(savedLanguages));

    const savedTheme = localStorage.getItem('deusa_theme') as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'clean' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('deusa_theme', newTheme);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home onNavigate={setActiveTab} theme={theme} />;
      case 'sincera': return <SinceraUnificada userDossier={dossier} theme={theme} languages={languages} />;
      case 'modo': return <ModoDeusa theme={theme} />;
      case 'perfil': return <PerfilHomens theme={theme} />;
      case 'linguagens': return <LinguagensAmor theme={theme} onComplete={setLanguages} />;
      case 'vire': return <VireOJogo theme={theme} />;
      case 'autoconhecimento': return <Autoconhecimento onComplete={(d) => { setDossier(d); setActiveTab('home'); }} theme={theme} />;
      default: return <Home onNavigate={setActiveTab} theme={theme} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-[#060608] text-white' : 'bg-[#f8f9fa] text-[#1a1a1a]'}`}>
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      <main className="flex-1 max-w-5xl mx-auto w-full pb-24 px-4 sm:px-6">
        {dossier && activeTab !== 'autoconhecimento' && activeTab !== 'home' && (
          <div className="pt-6 animate-deusa">
            <div className={`p-5 rounded-3xl border flex items-center justify-between shadow-sm backdrop-blur-md ${theme === 'dark' ? 'bg-violet-600/10 border-white/5' : 'bg-white border-black/5'}`}>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`}>Soberania Ativa</p>
                <p className="text-sm font-medium">Modo <strong>{dossier.archetypeDominant}</strong> {languages ? `• Compatibilidade: ${languages.compatibility}%` : ''}</p>
              </div>
              <button 
                onClick={() => setActiveTab('autoconhecimento')} 
                className={`text-[10px] px-4 py-2 rounded-full font-bold uppercase tracking-tighter ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}
              >
                Perfil
              </button>
            </div>
          </div>
        )}
        {renderContent()}
      </main>

      <footer className={`p-8 text-center text-[10px] uppercase tracking-[0.3em] font-medium opacity-40`}>
        deusa do jogo @ todos os direitos reservados 2026
      </footer>
    </div>
  );
};

export default App;
