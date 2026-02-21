import React from 'react';
import { TestRecord } from '../types.ts';
import { Check, X, Database, Info } from 'lucide-react';

interface SaveConfirmationModalProps {
  test: TestRecord;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SaveConfirmationModal: React.FC<SaveConfirmationModalProps> = ({ test, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center border bg-white text-slate-950 border-white">
            <Database size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-1">Archive</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Extraction Verified
            </p>
          </div>
        </div>

        <div className="bg-slate-950/50 rounded-3xl p-6 border border-slate-800 mb-10">
          <div className="flex items-start gap-4 mb-6">
            <Info size={16} className="text-indigo-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Instrument</p>
              <p className="font-black text-lg leading-tight uppercase text-white">{test.testName}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Purpose</p>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">{test.testPurpose}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Age</p>
              <p className="text-slate-300 font-bold text-xs">{test.ageTarget}</p>
            </div>
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

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all"
          >
            Discard
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-4 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl bg-white text-slate-950 hover:bg-slate-100 shadow-white/5"
          >
            Commit to Archive
          </button>
        </div>
      </div>
    </div>
  );
};
