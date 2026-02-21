import React, { useState } from 'react';

interface FormExportModalProps {
  testName: string;
  script: string;
  onClose: () => void;
}

export const FormExportModal: React.FC<FormExportModalProps> = ({ testName, script, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/5 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/10">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2zM14 8V3.5L18.5 8H14zM7 8h5v2H7V8zm10 8H7v-2h10v2zm0-4H7v-2h10v2z"/></svg>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-1">Form Architecture</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{testName}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="bg-slate-950/50 rounded-3xl border border-slate-800 p-8 mb-8">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
              Deployment Protocol
            </h3>
            <ol className="text-xs text-slate-400 space-y-4 list-decimal list-inside font-medium">
              <li>Access <a href="https://script.google.com" target="_blank" className="text-white hover:underline">script.google.com</a>.</li>
              <li>Initialize a <span className="text-white font-bold">"New Project"</span>.</li>
              <li>Replace default code with the <span className="text-white font-bold">Script Source</span> below.</li>
              <li>Execute <span className="text-white font-bold">"Run"</span> to generate the clinical interface.</li>
            </ol>
          </div>

          <div className="relative flex-grow min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between px-6 py-3 bg-slate-950 border-x border-t border-slate-800 rounded-t-2xl">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Google Apps Script Source</span>
              <button 
                onClick={handleCopy}
                className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg transition-all border ${copied ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-white text-slate-950 border-white hover:bg-slate-100'}`}
              >
                {copied ? 'Copied' : 'Copy Source'}
              </button>
            </div>
            <div className="flex-grow bg-slate-950 border border-slate-800 rounded-b-2xl overflow-hidden">
               <pre className="p-6 text-[11px] font-mono text-indigo-300/80 overflow-auto h-full max-h-[300px] leading-relaxed custom-scrollbar">
                 {script}
               </pre>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
             <button 
              onClick={onClose}
              className="px-10 py-4 bg-white text-slate-950 font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-slate-100 transition-all shadow-xl shadow-white/5"
             >
               Close Interface
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
