
import React from 'react';
import { X, MapPin, Calendar, Bell, Moon, Sun } from 'lucide-react';
import { AppSettings, LocationType, TrackingMode, Theme } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  requestNotificationPermission: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  requestNotificationPermission
}) => {
  if (!isOpen) return null;

  const handleToggleLocation = () => {
    onUpdateSettings({
      ...settings,
      location: settings.location === LocationType.ISRAEL ? LocationType.DIASPORA : LocationType.ISRAEL
    });
  };

  const handleToggleMode = () => {
    onUpdateSettings({
      ...settings,
      mode: settings.mode === TrackingMode.DAILY ? TrackingMode.WEEKLY : TrackingMode.DAILY
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({
      ...settings,
      notificationTime: e.target.value
    });
  };

  const handleToggleNotifications = () => {
    if (!settings.notificationsEnabled) {
      requestNotificationPermission();
    }
    onUpdateSettings({
      ...settings,
      notificationsEnabled: !settings.notificationsEnabled
    });
  };

  const handleToggleTheme = () => {
    onUpdateSettings({
      ...settings,
      theme: settings.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    });
  };

  const sendTestNotification = () => {
    if (Notification.permission === 'granted') {
        new Notification("בדיקת התראה - קַדְמָ֨א", {
            body: "ההתראות עובדות תקין!",
            icon: '/favicon.ico'
        });
    } else {
        alert("אין אישור התראות. אנא אפשר התראות בדפדפן.");
        requestNotificationPermission();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200 transition-colors border border-slate-200 dark:border-slate-800">
        
        {/* Header - Fixed */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 flex justify-between items-center border-b border-slate-800 shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">⚙️</span> הגדרות מערכת
          </h2>
          <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Theme */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full text-indigo-600 dark:text-indigo-400">
                {settings.theme === Theme.LIGHT ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">מצב תצוגה</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">בהיר / כהה</p>
              </div>
            </div>
            <button
              onClick={handleToggleTheme}
              className="px-4 py-1.5 rounded-full text-sm font-bold transition-all bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
            >
              {settings.theme === Theme.LIGHT ? 'מצב בהיר ☀️' : 'מצב כהה 🌙'}
            </button>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full text-blue-600 dark:text-blue-400">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">מיקום</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">משפיע על חלוקת הקריאות</p>
              </div>
            </div>
            <button
              onClick={handleToggleLocation}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                settings.location === LocationType.ISRAEL 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {settings.location === LocationType.ISRAEL ? 'ישראל 🇮🇱' : 'חו"ל 🌎'}
            </button>
          </div>

          {/* Mode */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
             <div className="flex items-center gap-3">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full text-purple-600 dark:text-purple-400">
                <Calendar size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">שיטת מעקב</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">רמת פירוט המעקב</p>
              </div>
            </div>
            <button
              onClick={handleToggleMode}
              className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
            >
              {settings.mode === TrackingMode.DAILY ? 'יומי (עליות)' : 'שבועי (כללי)'}
            </button>
          </div>

          {/* Notifications */}
          <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full text-amber-600 dark:text-amber-400">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">התראות</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">תזכורת יומית ללימוד</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.notificationsEnabled}
                  onChange={handleToggleNotifications}
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {settings.notificationsEnabled && (
              <div className="flex items-center justify-between gap-2 pr-12">
                 <button onClick={sendTestNotification} className="text-xs text-blue-600 dark:text-blue-400 underline">
                    בדוק התראה
                 </button>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">שעת תזכורת:</span>
                    <input 
                    type="time" 
                    value={settings.notificationTime}
                    onChange={handleTimeChange}
                    className="border border-slate-300 dark:border-slate-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-slate-700 dark:text-white"
                    />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer - Fixed */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="bg-slate-900 dark:bg-slate-950 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors"
          >
            שמור וסגור
          </button>
        </div>
      </div>
    </div>
  );
};
