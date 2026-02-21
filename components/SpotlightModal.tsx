import React from 'react';
import { X, Info, FileText, Users, Calendar, Hash } from 'lucide-react';
import { TestRecord } from '../types.ts';

interface SpotlightModalProps {
  test: TestRecord;
  onClose: () => void;
}

export const SpotlightModal: React.FC<SpotlightModalProps> = ({ test, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl shadow-indigo-500/10 animate-in zoom-in-95 duration-300 flex flex-col">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-1">{test.testName}</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Clinical Spotlight</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-6">
              <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 mb-3 text-indigo-400">
                  <Info size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Purpose</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed font-medium">
                  {test.testPurpose}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 mb-2 text-cyan-400">
                    <Users size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Target</span>
                  </div>
                  <p className="text-white font-bold text-sm">{test.ageTarget}</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 mb-2 text-purple-400">
                    <Hash size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Items</span>
                  </div>
                  <p className="text-white font-bold text-sm">{test.itemCount}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 h-full">
                <div className="flex items-center gap-2 mb-3 text-emerald-400">
                  <Calendar size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Administration</span>
                </div>
                <div className="space-y-4">
                   <div>
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Mode</p>
                     <p className="text-slate-300 text-xs font-bold">{test.description}</p>
                   </div>
                   <div>
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Methodology</p>
                     <p className="text-slate-400 text-xs leading-relaxed">{test.administrationMethod}</p>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Extracted Content Preview</span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-500 rounded text-[8px] font-bold uppercase">Markdown</span>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
              <pre className="text-[11px] text-slate-400 font-mono whitespace-pre-wrap leading-relaxed">
                {test.extractedContent}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Diagnostic Record Verified</span>
           </div>
           <button 
            onClick={onClose}
            className="px-8 py-3 bg-white text-slate-950 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-100 transition-all"
           >
             Close Spotlight
           </button>
        </div>
      </div>
    </div>
  );
};
