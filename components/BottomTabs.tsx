import React from 'react';
import { LayoutGrid, Archive, Search } from 'lucide-react';

export type TabType = 'scanner' | 'archive';

interface BottomTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'scanner', label: 'Upload', icon: LayoutGrid },
    { id: 'archive', label: 'Archive', icon: Archive },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-t border-slate-900 px-6 py-4 pb-10 md:pb-4">
      <div className="max-w-xs mx-auto flex items-center justify-around bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                isActive 
                ? 'bg-white text-slate-950 shadow-xl' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
