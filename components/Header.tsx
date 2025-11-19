import React from 'react';
import { Settings, BookOpen, BarChart2, Info } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenYearly: () => void;
  onOpenAbout: () => void;
  hasDebts?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenYearly, onOpenAbout, hasDebts = false }) => {
  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-30 transition-colors duration-300 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm">
            <BookOpen size={24} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-none font-torah tracking-wide">קַדְמָ֨א</h1>
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium tracking-normal">מעקב קריאת שמו"ת</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenYearly}
            className="relative flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium group"
            title="מעקב שנתי"
          >
            <div className="relative">
                <BarChart2 size={20} />
                {hasDebts && (
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                )}
            </div>
            <span className="hidden sm:inline">מעקב שנתי</span>
          </button>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

          <button 
            onClick={onOpenSettings}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            aria-label="הגדרות"
            title="הגדרות"
          >
            <Settings size={24} />
          </button>

          <button 
            onClick={onOpenAbout}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            aria-label="אודות"
            title="אודות"
          >
            <Info size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};