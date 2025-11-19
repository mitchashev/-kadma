import React, { useState, useMemo } from 'react';
import { Parasha } from '../types';
import { CheckCircle2, Circle, ArrowLeft, BookOpenCheck } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (selectedParashot: string[]) => void;
  allParashot: Parasha[];
  currentParasha: Parasha;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  allParashot,
  currentParasha
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  
  // Identify past parashot only once
  const pastParashot = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const past = allParashot.filter(p => {
      if (!p.date) return false;
      const pDate = new Date(p.date);
      // If parasha date is strictly less than current parasha date
      return pDate < new Date(currentParasha.date!);
    });
    
    // Default select all past parashot
    const initialSet = new Set<string>();
    past.forEach(p => initialSet.add(p.name));
    setSelected(initialSet);
    
    return past;
  }, [allParashot, currentParasha]);

  if (!isOpen || pastParashot.length === 0) return null;

  const toggleParasha = (name: string) => {
    const newSet = new Set(selected);
    if (newSet.has(name)) {
      newSet.delete(name);
    } else {
      newSet.add(name);
    }
    setSelected(newSet);
  };

  const handleComplete = () => {
    onComplete(Array.from(selected));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300 transition-colors">
        
        <div className="p-6 text-center space-y-2 bg-slate-50 dark:bg-slate-800 rounded-t-2xl border-b border-slate-100 dark:border-slate-700">
            <div className="bg-blue-100 dark:bg-blue-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 mb-4">
                <BookOpenCheck size={32} />
            </div>
          <h2 className="text-2xl font-bold font-torah text-slate-900 dark:text-white">ברוכים הבאים ל-קַדְמָ֨א</h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            כדי להתחיל ברגל ימין, בוא נסמן את מה שכבר למדת השנה.<br/>
            <span className="text-xs text-slate-400 dark:text-slate-500">סימנו עבורך את כל הפרשות שעברו. ניתן להסיר מה שלא הושלם.</span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white dark:bg-slate-900">
          <div className="space-y-2">
            {pastParashot.map(p => {
              const isSelected = selected.has(p.name);
              return (
                <button
                  key={p.name}
                  onClick={() => toggleParasha(p.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                    isSelected 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-sm' 
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <span className={`font-bold font-torah text-lg ${isSelected ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                    {p.name}
                  </span>
                  <div className={isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600'}>
                    {isSelected ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-b-2xl">
          <button
            onClick={handleComplete}
            className="w-full bg-slate-900 dark:bg-slate-950 hover:bg-slate-800 dark:hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            התחל ללמוד
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};