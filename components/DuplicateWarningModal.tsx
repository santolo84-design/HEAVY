import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { TestRecord } from '../types.ts';

interface DuplicateWarningModalProps {
  test: TestRecord;
  onClose: () => void;
}

export const DuplicateWarningModal: React.FC<DuplicateWarningModalProps> = ({ test, onClose }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <AlertTriangle size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-1">Duplicate</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">
              Record already exists
            </p>
          </div>
        </div>

        <div className="bg-slate-950/50 rounded-3xl p-6 border border-slate-800 mb-10">
          <div className="mb-4">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Instrument</p>
            <p className="font-black text-lg leading-tight uppercase text-white">{test.testName}</p>
          </div>
          
          <div className="flex gap-6">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Items</p>
              <p className="text-slate-300 font-bold text-xs">{test.itemCount}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Type</p>
              <p className="text-slate-300 font-bold text-xs">{test.testType}</p>
            </div>
          </div>
        </div>

        <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
          This clinical instrument has already been archived in the system. To maintain database integrity, duplicate entries are restricted.
        </p>

        <button
          onClick={onClose}
          className="w-full px-6 py-4 bg-white text-slate-950 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-100 transition-all shadow-xl shadow-white/5"
        >
          Acknowledge & Close
        </button>
      </div>
    </div>
  );
};
