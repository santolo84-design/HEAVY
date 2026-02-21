import React, { useRef, useState } from 'react';
import { FilePlus, AlertCircle, Plus } from 'lucide-react';
import { analyzeTestDocument } from '../services/geminiService.ts';
import { TestRecord } from '../types.ts';

interface TestUploadProps {
  onUploadStart: (message: string) => void;
  onUploadEnd: () => void;
  onSuccess: (test: TestRecord) => void;
}

export const TestUpload: React.FC<TestUploadProps> = ({ onUploadStart, onUploadEnd, onSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<{ message: string; type: 'auth' | 'general' | 'quota' } | null>(null);

  const handleConnectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setError(null);
    } else {
      window.open('https://ai.google.dev/gemini-api/docs/billing', '_blank');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    const fileList = Array.from(files);
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i] as File;
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
      
      if (!allowedTypes.includes(file.type)) {
        setError({ message: `SKIPPED: "${file.name}" (Unsupported Format)`, type: 'general' });
        continue;
      }

      onUploadStart(`PROCESSING: [${i + 1}/${fileList.length}] - "${file.name}"`);

      try {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.readAsDataURL(file);
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
        });

        const base64 = await base64Promise;
        const analysis = await analyzeTestDocument(base64, file.type);

        if (!analysis.containsTest) {
          setError({ 
            message: `INVALID DOCUMENT: "${file.name}" does not appear to contain a clinical test.`, 
            type: 'general' 
          });
          continue;
        }

        const newRecord: TestRecord = {
          id: Math.random().toString(36).substr(2, 9),
          fileName: file.name,
          fileData: base64,
          mimeType: file.type,
          uploadedAt: new Date().toISOString(),
          ...analysis
        };

        onSuccess(newRecord);
      } catch (err: any) {
        console.error(err);
        if (err.message === "KEY_REQUIRED") {
          setError({ 
            message: `AUTHENTICATION REQUIRED: Please connect a Project Key to analyze files.`, 
            type: 'auth' 
          });
          break; 
        } else if (err.message === "QUOTA_EXHAUSTED") {
          setError({ 
            message: `RATE LIMIT EXCEEDED: You've reached the Gemini API quota. Please check your plan.`, 
            type: 'quota' 
          });
          break;
        } else if (err.message === "SERVICE_UNAVAILABLE") {
          setError({ message: `SERVER ERROR: Gemini service is currently busy. Try again soon.`, type: 'general' });
        } else {
          setError({ message: `EXTRACTION FAILED: "${file.name}"`, type: 'general' });
        }
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
    onUploadEnd();
  };

  return (
    <div className="bg-slate-900/40 p-12 rounded-[2.5rem] border border-slate-800 hover:border-indigo-500/50 transition-all group flex flex-col items-center justify-center text-center backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="w-24 h-24 bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center mb-8 group-hover:border-indigo-500/50 group-hover:scale-105 transition-all duration-500 relative z-10">
        <FilePlus className="w-10 h-10 text-indigo-400 group-hover:text-indigo-300 transition-colors" strokeWidth={1.5} />
        <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">Clinical Ingestion</h3>
        <p className="text-slate-500 max-w-xs mx-auto mb-10 font-medium text-sm leading-relaxed">
          Upload clinical assessments for <span className="text-indigo-400">automated structure extraction</span> and archival.
        </p>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-10 py-4 bg-white text-slate-950 font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl shadow-white/5 active:scale-95 mx-auto"
        >
          <Plus size={16} strokeWidth={3} />
          Select Source Files
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg,.txt"
        multiple
      />

      {error && (
        <div className={`mt-8 px-6 py-4 border rounded-2xl max-w-md animate-in fade-in slide-in-from-top-2 duration-300 relative z-10 ${
          error.type === 'auth' || error.type === 'quota' ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-red-500/5 border-red-500/20'
        }`}>
           <div className="flex flex-col items-center gap-3">
             <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-center ${
               error.type === 'auth' || error.type === 'quota' ? 'text-indigo-400' : 'text-red-400'
             }`}>
               <AlertCircle size={16} />
               {error.message}
             </div>
             {(error.type === 'auth' || error.type === 'quota') && (
               <button 
                onClick={handleConnectKey}
                className="mt-2 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-black uppercase text-[9px] tracking-widest rounded-lg transition-all border border-indigo-500/30"
               >
                 {error.type === 'quota' ? 'Check Billing' : 'Connect Key'}
               </button>
             )}
           </div>
        </div>
      )}
    </div>
  );
};
