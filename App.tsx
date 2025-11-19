
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { SettingsModal } from './components/SettingsModal';
import { YearlyTracker } from './components/YearlyTracker';
import { OnboardingModal } from './components/OnboardingModal';
import { AboutModal } from './components/AboutModal';
import { CelebrationModal } from './components/CelebrationModal';
import { AppSettings, LocationType, TrackingMode, UserProgress, Parasha, Theme } from './types';
import { getParashaSchedule, ALIYOT, getTodayAliyahIndex, checkCompletion } from './services/calendarService';
import { formatBibleRef, formatAliyahRef, formatHebrewDate } from './services/hebrewUtils';
import { BookOpen, CheckCircle2, Circle, Calendar as CalendarIcon, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DEFAULT_SETTINGS: AppSettings = {
  location: LocationType.ISRAEL,
  mode: TrackingMode.DAILY,
  notificationsEnabled: false,
  notificationTime: "18:00",
  theme: Theme.LIGHT
};

// Initial state helpers
const getInitialProgress = (): UserProgress => {
  const saved = localStorage.getItem('sm-progress');
  return saved ? JSON.parse(saved) : {};
};

const getInitialSettings = (): AppSettings => {
  const saved = localStorage.getItem('sm-settings');
  return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
};

const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(getInitialProgress);
  const [settings, setSettings] = useState<AppSettings>(getInitialSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isYearlyOpen, setIsYearlyOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  // Celebration State
  const [celebration, setCelebration] = useState<{isOpen: boolean, book: string | null, isTorah: boolean}>({
    isOpen: false,
    book: null,
    isTorah: false
  });
  
  // State for manual navigation (viewing a past/future parasha)
  const [viewingParasha, setViewingParasha] = useState<Parasha | null>(null);
  
  // Calculate Calendar Data based on settings
  const calendarData = useMemo(() => {
    return getParashaSchedule(settings.location);
  }, [settings.location]);

  const realCurrentParasha = calendarData.current;
  
  // Theme effect
  useEffect(() => {
    if (settings.theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Check for first run
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('sm-onboarded');
    if (!hasOnboarded) {
      setIsOnboardingOpen(true);
    }
  }, []);

  // The parasha currently displayed on screen (either the real current one, or one selected manually)
  const displayParasha = viewingParasha || realCurrentParasha;
  const isViewingCurrent = displayParasha.name === realCurrentParasha.name;

  // Derived state for display Parasha
  const parashaProgress = progress[displayParasha.name] || { 
    daily: new Array(7).fill(false), 
    weekly: false 
  };

  // Calculate Global Debts
  const hasDebts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return calendarData.all.some(p => {
        if (!p.date) return false;
        const pDate = new Date(p.date);
        pDate.setHours(23, 59, 59, 999);
        
        const isPast = pDate < new Date();
        const isCurrent = p.name === realCurrentParasha.name;
        
        if (!isPast || isCurrent) return false;

        const userP = progress[p.name];
        const isDone = userP?.weekly || (userP?.daily?.every(Boolean) ?? false);
        
        return !isDone;
    });
  }, [calendarData.all, progress, realCurrentParasha]);


  // Persist State
  useEffect(() => {
    localStorage.setItem('sm-progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('sm-settings', JSON.stringify(settings));
  }, [settings]);

  // Notification Logic
  useEffect(() => {
    if (!settings.notificationsEnabled) return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      if (currentTime === settings.notificationTime && now.getSeconds() < 5) {
        new Notification("תזכורת קדמא", {
          body: `זה הזמן לקרוא את פרשת ${realCurrentParasha.name}!`,
          icon: '/favicon.ico'
        });
      }
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [settings, realCurrentParasha]);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("הדפדפן שלך לא תומך בהתראות.");
      return;
    }
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
  };

  // Handlers
  const toggleDaily = (index: number) => {
    const newDaily = [...parashaProgress.daily];
    newDaily[index] = !newDaily[index];
    
    const allDone = newDaily.every(Boolean);
    
    const newProgress = {
      ...progress,
      [displayParasha.name]: {
        ...parashaProgress,
        daily: newDaily,
        weekly: allDone
      }
    };

    // Check for celebration only if we just completed something
    if (allDone && !parashaProgress.weekly) {
        const completion = checkCompletion(calendarData.all, newProgress, displayParasha.name);
        if (completion.bookCompleted || completion.torahCompleted) {
            setCelebration({ isOpen: true, book: completion.bookCompleted, isTorah: completion.torahCompleted });
        }
    }

    setProgress(newProgress);
  };

  const toggleWeekly = () => {
    const newState = !parashaProgress.weekly;
    
    const newProgress = {
      ...progress,
      [displayParasha.name]: {
        daily: new Array(7).fill(newState), 
        weekly: newState
      }
    };

    // Check for celebration only if we set it to true
    if (newState) {
        const completion = checkCompletion(calendarData.all, newProgress, displayParasha.name);
        if (completion.bookCompleted || completion.torahCompleted) {
            setCelebration({ isOpen: true, book: completion.bookCompleted, isTorah: completion.torahCompleted });
        }
    }

    setProgress(newProgress);
  };

  const handleNavigate = (parasha: Parasha) => {
    setViewingParasha(parasha);
    setIsYearlyOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCurrent = () => {
    setViewingParasha(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOnboardingComplete = (selectedParashot: string[]) => {
    const newProgress = { ...progress };
    
    selectedParashot.forEach(name => {
      newProgress[name] = {
        daily: new Array(7).fill(true),
        weekly: true
      };
    });

    setProgress(newProgress);
    localStorage.setItem('sm-onboarded', 'true');
    setIsOnboardingOpen(false);
  };

  const calculatePercentage = () => {
    if (settings.mode === TrackingMode.WEEKLY) {
      return parashaProgress.weekly ? 100 : 0;
    }
    
    // Simple heuristic as we don't have exact chapter verse counts in DB
    const completedCount = parashaProgress.daily.filter(Boolean).length;
    return (completedCount / 7) * 100;
  };

  const todayAliyahIndex = getTodayAliyahIndex();
  const percentage = calculatePercentage();

  // Safely access hdate property using any cast or updated interface in future
  const displayHebrewDate = (displayParasha as any).hdate 
    ? formatHebrewDate((displayParasha as any).hdate) 
    : displayParasha.date ? formatHebrewDate(displayParasha.date.toLocaleDateString()) : '';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 pb-20 transition-colors duration-300">
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        onOpenYearly={() => setIsYearlyOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        hasDebts={hasDebts}
      />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Navigation Banner (if not viewing current) */}
        {!isViewingCurrent && (
          <div className="bg-slate-900 dark:bg-slate-700 text-white rounded-xl p-4 flex items-center justify-between shadow-lg animate-in slide-in-from-top-2 border border-slate-800 dark:border-slate-600">
            <div className="flex items-center gap-3">
              <RotateCcw size={20} className="text-blue-400" />
              <div>
                <p className="font-bold text-sm">צפייה בהיסטוריה / עתיד</p>
                <p className="text-xs text-slate-400 dark:text-slate-300">אתה צופה בפרשת {displayParasha.name}</p>
              </div>
            </div>
            <button 
              onClick={handleBackToCurrent}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              חזור להיום <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Hero Card - Parasha Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden relative transition-colors">
          <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${isViewingCurrent ? 'from-blue-500 via-indigo-500 to-purple-500' : 'from-slate-400 to-slate-600'}`}></div>
          
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Right Side - Info */}
            <div className="flex-1 w-full text-center md:text-right order-2 md:order-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isViewingCurrent 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  <CalendarIcon size={12} />
                  <span>{isViewingCurrent ? 'השבוע' : 'ארכיון'}</span>
                </div>
                {displayHebrewDate && (
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                        {displayHebrewDate}
                    </span>
                )}
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 font-torah tracking-wide leading-tight">
                {displayParasha.name}
              </h2>
              
              {displayParasha.fullRef && (
                 <div className="inline-block mb-4">
                    <p className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 font-torah bg-slate-50 dark:bg-slate-700/50 px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                      {formatBibleRef(displayParasha.fullRef)}
                    </p>
                 </div>
              )}

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base max-w-xl mx-auto md:mx-0">
                {displayParasha.description}
              </p>
            </div>

            {/* Left Side - Stats & Actions */}
            <div className="w-full md:w-72 shrink-0 flex flex-col items-center gap-4 order-1 md:order-2">
               
               {/* Circular Progress */}
               <div className="relative w-48 h-48">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={[{ value: percentage }, { value: 100 - percentage }]}
                       innerRadius={60}
                       outerRadius={80}
                       startAngle={90}
                       endAngle={-270}
                       dataKey="value"
                       stroke="none"
                     >
                       <Cell fill={percentage === 100 ? '#22c55e' : '#2563eb'} />
                       <Cell fill={settings.theme === Theme.DARK ? '#334155' : '#f1f5f9'} />
                     </Pie>
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex items-center justify-center flex-col animate-in fade-in zoom-in duration-300">
                   <span className="text-3xl font-bold text-slate-800 dark:text-white font-mono">{Math.round(percentage)}%</span>
                   <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">הושלם</span>
                 </div>
               </div>

               {/* Action Button for Weekly Mode */}
               {settings.mode === TrackingMode.WEEKLY && (
                  <button
                    onClick={toggleWeekly}
                    className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                      parashaProgress.weekly 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {parashaProgress.weekly ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    {parashaProgress.weekly ? 'הושלם' : 'סמן כבוצע'}
                  </button>
               )}
            </div>

          </div>
        </div>

        {/* Daily Tracking List */}
        {settings.mode === TrackingMode.DAILY && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALIYOT.map((aliyah, idx) => {
              const isCompleted = parashaProgress.daily[idx];
              const isToday = isViewingCurrent && todayAliyahIndex === aliyah.dayOfWeek;
              // Rishon is 1, Sheni is 2, etc. in the JSON map
              const aliyahKey = String(idx + 1);
              const aliyahRef = displayParasha.aliyot ? displayParasha.aliyot[aliyahKey] : null;
              
              return (
                <button
                  key={aliyah.id}
                  onClick={() => toggleDaily(idx)}
                  className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-200 text-right flex items-center justify-between group ${
                    isCompleted 
                      ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm' 
                      : isToday 
                        ? 'bg-white dark:bg-slate-700 border-blue-400 dark:border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/40 shadow-md transform scale-[1.01]' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm'
                  }`}
                >
                   {isToday && !isCompleted && (
                    <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-br-lg font-bold shadow-sm z-10">
                      היום
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 w-full relative z-0">
                    <div className={`p-2.5 rounded-full transition-all duration-300 shrink-0 ${
                      isCompleted 
                        ? 'bg-blue-500 text-white shadow-blue-200 dark:shadow-none shadow-md scale-110' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={22} /> : <BookOpen size={22} />}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between">
                        <span className={`block font-bold text-lg font-torah ${isCompleted ? 'text-blue-900 dark:text-blue-100' : 'text-slate-800 dark:text-slate-200'}`}>
                          {aliyah.name}
                        </span>
                      </div>
                      
                      {aliyahRef ? (
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 block font-serif tracking-wide">
                          {formatAliyahRef(aliyahRef)}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-600 mt-1 block">פרטי עליה חסרים</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Encouragement / Summary */}
        {percentage === 100 && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-xl p-8 text-center animate-in fade-in slide-in-from-bottom-4 shadow-sm">
            <div className="inline-flex p-4 bg-white dark:bg-slate-700 rounded-full text-yellow-500 mb-4 shadow-sm ring-4 ring-yellow-100 dark:ring-yellow-900/30">
              <Trophy size={40} fill="currentColor" className="fill-yellow-500" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 font-torah">חזק חזק ונתחזק!</h3>
            <p className="text-slate-600 dark:text-slate-300">השלמת בהצלחה את לימוד פרשת {displayParasha.name}.</p>
          </div>
        )}

      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        requestNotificationPermission={requestNotificationPermission}
      />

      <YearlyTracker 
        isOpen={isYearlyOpen}
        onClose={() => setIsYearlyOpen(false)}
        onNavigate={handleNavigate}
        allParashot={calendarData.all}
        currentParasha={realCurrentParasha}
        progress={progress}
      />

      <OnboardingModal 
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        allParashot={calendarData.all}
        currentParasha={realCurrentParasha}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <CelebrationModal
        isOpen={celebration.isOpen}
        onClose={() => setCelebration({ isOpen: false, book: null, isTorah: false })}
        bookName={celebration.book}
        isTorahCompletion={celebration.isTorah}
      />
    </div>
  );
};

export default App;
