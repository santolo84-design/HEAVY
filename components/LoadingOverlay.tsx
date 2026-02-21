
import React from 'react';

export const LoadingOverlay: React.FC<{ message?: string }> = ({ message = 'PROCESSING...' }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[200] flex items-center justify-center animate-in fade-in duration-500">
      <div className="text-center p-16">
        <div className="relative w-32 h-32 mx-auto mb-10">
          <div className="absolute inset-0 border-2 border-slate-800 rounded-full"></div>
          <div className="absolute inset-0 border-t-2 border-white rounded-full animate-spin"></div>
          <div className="absolute inset-4 border border-slate-800 rounded-full animate-pulse"></div>
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight uppercase mb-3">Heavy Machine</h3>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">{message}</p>
      </div>
    </div>
  );
};
