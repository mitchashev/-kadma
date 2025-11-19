
import React, { useMemo, useState, useEffect } from 'react';
import { Parasha, UserProgress } from '../types';
import { X, CheckCircle2, AlertCircle, Calendar, Star, Clock, ArrowLeft, Circle } from 'lucide-react';
import { getChumashFromParasha } from '../services/calendarService';
import { formatHebrewDate } from '../services/hebrewUtils';

interface YearlyTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (parasha: Parasha) => void;
  allParashot: Parasha[];
  currentParasha: Parasha;
  progress: UserProgress;
}

const CHUMASH_NAMES_HEBREW: Record<string, string> = {
    'Genesis': 'בראשית',
    'Exodus': 'שמות',
    'Leviticus': 'ויקרא',
    'Numbers': 'במדבר',
    'Deuteronomy': 'דברים'
};

const CHUMASH_ORDER = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'];

export const YearlyTracker: React.FC<YearlyTrackerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  allParashot,
  currentParasha,
  progress
}) => {
  const [activeChumash, setActiveChumash] = useState<string>('Genesis');

  // Set initial active Chumash to the current one when opening
  useEffect(() => {
      if (isOpen && currentParasha) {
          const currentBook = getChumashFromParasha(currentParasha);
          setActiveChumash(currentBook);
      }
  }, [isOpen, currentParasha]);

  // Calculate status and group by Chumash
  const { groupedParashot, chumashDebts, totalMissing } = useMemo(() => {
    const grouped: Record<string, Parasha[]> = {
        'Genesis': [], 'Exodus': [], 'Leviticus': [], 'Numbers': [], 'Deuteronomy': []
    };
    
    const debts: Record<string, boolean> = {};
    let missingCount = 0;

    allParashot.forEach(p => {
      const book = getChumashFromParasha(p);
      if (grouped[book]) {
          grouped[book].push(p);
      }

      // Check debt
      if (!p.date) return;
      const pDate = new Date(p.date);
      pDate.setHours(23, 59, 59, 999);
      const isPast = pDate < new Date(); // Compare with "now" to be safe
      const isCurrent = p.name === currentParasha.name;
      const userP = progress[p.name];
      const isDone = userP?.weekly || (userP?.daily?.every(Boolean) ?? false);

      if (isPast && !isDone && !isCurrent) {
          debts[book] = true;
          missingCount++;
      }
    });

    return { groupedParashot: grouped, chumashDebts: debts, totalMissing: missingCount };
  }, [allParashot, progress, currentParasha]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200 transition-colors border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Header - Fixed */}
        <div className="bg-slate-900 dark:bg-slate-900 text-white p-5 flex justify-between items-center shrink-0 border-b border-slate-800 z-20 relative shadow-md">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar size={24} className="text-blue-400" />
              מעקב שנתי
            </h2>
            <p className="text-slate-400 text-sm mt-1">בחר חומש לצפייה בפרשות</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        {/* Tabs - Fixed */}
        <div className="flex overflow-x-auto bg-slate-50 dark:bg-slate-700/50 p-3 gap-2 border-b border-slate-100 dark:border-slate-700 custom-scrollbar shrink-0 z-10">
            {CHUMASH_ORDER.map(book => {
                const isActive = activeChumash === book;
                const hasDebt = chumashDebts[book];
                return (
                    <button
                        key={book}
                        onClick={() => setActiveChumash(book)}
                        className={`relative px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                            isActive 
                            ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow-sm ring-1 ring-slate-200 dark:ring-slate-500' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                    >
                        {CHUMASH_NAMES_HEBREW[book]}
                        {hasDebt && (
                            <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-700"></span>
                        )}
                    </button>
                )
            })}
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white dark:bg-slate-800 relative">
          
          <div className="space-y-2 pb-10">
            {groupedParashot[activeChumash]?.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400">אין פרשות להצגה בחומש זה לשנה זו.</p>
                </div>
            )}

            {groupedParashot[activeChumash]?.map((p: any) => {
              const isCurrent = p.name === currentParasha.name;
              const userP = progress[p.name];
              const isDone = userP?.weekly || (userP?.daily?.every(Boolean) ?? false);
              const pDate = p.date ? new Date(p.date) : new Date();
              pDate.setHours(23, 59, 59, 999);
              const isPast = pDate < new Date();
              const isMissing = isPast && !isDone && !isCurrent;
              
              const hebrewDateStr = p.hdate ? formatHebrewDate(p.hdate) : formatHebrewDate(p.date?.toLocaleDateString());

              return (
                <button
                  key={p.name + p.date}
                  onClick={() => onNavigate(p)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group ${
                    isCurrent 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 ring-1 ring-blue-300 dark:ring-blue-700' 
                      : 'bg-white dark:bg-slate-700/40 border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isDone 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                        : isMissing 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                          : isCurrent
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-600 text-slate-400 dark:text-slate-400'
                    }`}>
                      {isDone ? <CheckCircle2 size={16} /> : 
                       isMissing ? <span className="font-bold">!</span> :
                       isCurrent ? <Clock size={16} /> :
                       <Circle size={16} />}
                    </div>
                    <div className="text-right">
                      <span className={`block font-bold ${isCurrent ? 'text-blue-900 dark:text-blue-100' : 'text-slate-700 dark:text-slate-200'}`}>
                        {p.name}
                        {isCurrent && <span className="mr-2 text-[10px] bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-1.5 py-0.5 rounded-full">השבוע</span>}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {hebrewDateStr}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-slate-300 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    <ArrowLeft size={18} />
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Legend - Fixed at bottom? No, scroll with content */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-4">
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> הושלם</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> חוב</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-600 rounded-full"></div> נוכחי</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full"></div> עתיד</div>
          </div>

        </div>
      </div>
    </div>
  );
};
