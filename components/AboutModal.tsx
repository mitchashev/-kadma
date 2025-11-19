import React from 'react';
import { X, Info, Mail, Globe } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 transition-colors">
        
        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 flex justify-between items-center border-b border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2 font-torah">
            <Info size={24} className="text-blue-400" />
            אודות
          </h2>
          <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-center">
          
          {/* Logo Area */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white font-torah tracking-wide">קַדְמָ֨א</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              מערכת חכמה למעקב אחר לימוד שניים מקרא ואחד תרגום
            </p>
             <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
              פותח על ידי מתחשב
            </p>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider">יצירת קשר ותמיכה</h4>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2">
              <p className="text-slate-600 dark:text-slate-400 text-sm">לתמיכה, הערות וכלים נוספים שלנו:</p>
              <a 
                href="mailto:mitchashev@gmail.com" 
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline dir-ltr"
              >
                <Mail size={16} />
                mitchashev@gmail.com
              </a>
            </div>
          </div>

          {/* Credits */}
          <div className="space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <Globe size={12} />
              נתוני לוח השנה והקריאות מוצגים באדיבות אתר
              <a 
                href="https://www.hebcal.com/shabbat?geonameid=281184&geoip=geoname&b=40&M=on&lg=s&i=on&utm_source=shabbat1c&utm_medium=js-i2&utm_campaign=s1c-jerusalem" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Hebcal
              </a>
            </p>
             <p className="text-[10px] text-slate-400 dark:text-slate-600">
                גרסה 0.0.1
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};