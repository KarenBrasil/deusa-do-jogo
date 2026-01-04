
import React from 'react';

type Tab = 'home' | 'conversa' | 'tradutor' | 'modo' | 'perfil' | 'radar' | 'vire';

interface NavbarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: '👑' },
    { id: 'conversa', label: 'Conversa', icon: '💬' },
    { id: 'tradutor', label: 'Atitudes', icon: '🔍' },
    { id: 'modo', label: 'Modo', icon: '✨' },
    { id: 'perfil', label: 'Perfis', icon: '👤' },
    { id: 'radar', label: 'Radar', icon: '🚩' },
    { id: 'vire', label: 'Vire', icon: '⚡' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-yellow-900/30 flex justify-around py-3 px-1 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as Tab)}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === tab.id ? 'text-yellow-500 scale-110' : 'text-gray-500'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-[10px] uppercase font-bold tracking-tighter">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navbar;
