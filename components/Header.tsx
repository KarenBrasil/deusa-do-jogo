
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
    <header className={`sticky top-0 z-50 border-b backdrop-blur-2xl transition-all ${theme === 'dark' ? 'bg-black/80 border-white/10 shadow-xl' : 'bg-white/80 border-black/5 shadow-sm'}`}>
      <div className="px-6 py-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-3 group transition-all active:scale-95`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-lg ${theme === 'dark' ? 'bg-violet-600 text-white' : 'bg-black text-white'}`}>
              <i className="fa-solid fa-house text-sm"></i>
            </div>
            <h1 className={`text-2xl font-bold uppercase tracking-tighter italic ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Deusa <span className="text-[#9d66ff]">do</span> Jogo
            </h1>
          </button>

          <button 
            onClick={toggleTheme}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${theme === 'dark' ? 'bg-zinc-900 text-yellow-500' : 'bg-gray-100 text-violet-600'}`}
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
          </button>
        </div>

        <nav className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all whitespace-nowrap text-xs font-black uppercase tracking-widest border shadow-sm ${
                activeTab === item.id 
                ? (theme === 'dark' ? 'bg-white text-black border-white' : 'bg-black text-white border-black') 
                : (theme === 'dark' ? 'bg-zinc-900/50 text-gray-400 border-white/5' : 'bg-gray-50 text-gray-500 border-black/5')
              }`}
            >
              <i className={`fa-solid ${item.icon} text-xs`}></i>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
