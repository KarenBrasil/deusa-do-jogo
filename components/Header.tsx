import React from 'react';
import { Tab, Theme } from '../App';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, theme, toggleTheme }) => {
  const menuItems: { id: Tab; label: string; icon: string }[] = [
    { id: 'sincera', label: 'Sincera', icon: 'fa-comments' },
    { id: 'modo', label: 'Deusa', icon: 'fa-crown' },
    { id: 'perfil', label: 'Alvos', icon: 'fa-user-group' },
    { id: 'linguagens', label: 'Linguagens', icon: 'fa-heart-pulse' },
    { id: 'vire', label: 'Arsenal', icon: 'fa-bolt' },
    { id: 'autoconhecimento', label: 'Dossiê', icon: 'fa-fingerprint' },
  ];

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-2xl transition-all ${theme === 'dark' ? 'bg-black/80 border-white/5 shadow-xl' : 'bg-white/80 border-black/5 shadow-sm'}`}>
      <div className="px-6 py-6 flex flex-col items-center gap-6">
        <div className="flex items-center justify-between w-full max-w-5xl">
          <div className="w-10"></div> {/* Left spacer */}
          
          <button 
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center gap-1 group transition-all active:scale-95"
          >
            <div className={`text-xl mb-1 ${theme === 'dark' ? 'text-violet-500' : 'text-black'}`}>
              <i className="fa-solid fa-crown"></i>
            </div>
            <h1 className={`text-xl font-black uppercase tracking-[0.2em] transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              DEUSA DO JOGO
            </h1>
          </button>

          <button 
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-zinc-900 text-yellow-500' : 'bg-gray-100 text-violet-600'}`}
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </div>

        <nav className="flex gap-1 overflow-x-auto no-scrollbar pb-1 justify-center w-full">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap text-[9px] font-bold uppercase tracking-widest ${
                activeTab === item.id 
                ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white') 
                : (theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black')
              }`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;