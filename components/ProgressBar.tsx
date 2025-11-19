import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-sm font-medium text-slate-700">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
        <div
          className={`bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out ${
            progress === 100 ? 'bg-green-500' : 'bg-blue-600'
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};