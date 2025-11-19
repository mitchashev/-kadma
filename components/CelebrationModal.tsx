
import React from 'react';
import { X, Star, Crown } from 'lucide-react';
import { BOOK_NAMES } from '../services/hebrewUtils';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookName?: string | null;
  isTorahCompletion: boolean;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  bookName,
  isTorahCompletion
}) => {
  if (!isOpen) return null;

  const hebrewBookName = bookName ? BOOK_NAMES[bookName] || bookName : '';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center overflow-hidden animate-in zoom-in duration-300 border-2 border-yellow-500/30">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
           <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-500 rounded-full blur-3xl"></div>
           <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 rounded-full"></div>
             {isTorahCompletion ? (
                <Crown size={64} className="text-yellow-400 relative z-10" strokeWidth={1.5} />
             ) : (
                <Star size={64} className="text-yellow-400 relative z-10" strokeWidth={1.5} fill="currentColor" fillOpacity={0.2} />
             )}
          </div>

          <h2 className="text-3xl font-bold text-white font-torah mb-2 tracking-wide">
            חֲזַק חֲזַק וְנִתְחַזֵּק!
          </h2>
          
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent my-4"></div>

          {isTorahCompletion ? (
             <div className="space-y-2">
                <p className="text-xl text-slate-200 font-medium">
                  מזל טוב!
                </p>
                <p className="text-slate-300">
                  זכית לסיים את כל חמשה חומשי תורה.
                </p>
             </div>
          ) : (
            <div className="space-y-2">
               <p className="text-xl text-slate-200 font-medium">
                 סיימת את חומש {hebrewBookName}
               </p>
               <p className="text-slate-300 text-sm">
                 אשריך שזכית להשלים את לימוד החומש כולו.
               </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-8 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-900 font-bold py-2.5 px-8 rounded-full shadow-lg shadow-yellow-500/20 transition-all transform hover:scale-105 active:scale-95"
          >
            המשך ללמוד
          </button>
        </div>
      </div>
    </div>
  );
};
