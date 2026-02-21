import React, { useState, useMemo } from 'react';
import { Share, Download, FileDown, Trash2, Search, ChevronDown, FileText, ExternalLink, Plus } from 'lucide-react';
import { TestRecord } from '../types.ts';
import { translateTest, generateGoogleFormScript } from '../services/geminiService.ts';
import { FormExportModal } from './FormExportModal.tsx';

interface TestTableProps {
  tests: TestRecord[];
  onDelete: (id: string) => void;
  onSelect: (test: TestRecord) => void;
  onLoadingState: (isLoading: boolean, message?: string) => void;
  selectedId?: string;
}

const LANGUAGES = [
  { code: 'original', name: 'Original' },
  { code: 'English', name: 'English' },
  { code: 'Spanish', name: 'Spanish' },
  { code: 'French', name: 'French' },
  { code: 'German', name: 'German' },
  { code: 'Italian', name: 'Italian' },
  { code: 'Portuguese', name: 'Portuguese' },
  { code: 'Japanese', name: 'Japanese' },
  { code: 'Chinese', name: 'Chinese' }
];

export const TestTable: React.FC<TestTableProps> = ({ tests, onDelete, onSelect, onLoadingState }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLangs, setSelectedLangs] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState<string | null>(null);
  const [exportModal, setExportModal] = useState<{ testName: string, script: string } | null>(null);
  const [languageSelector, setLanguageSelector] = useState<TestRecord | null>(null);

  const handleDownloadOriginal = (test: TestRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = `data:${test.mimeType};base64,${test.fileData}`;
    link.download = test.fileName;
    link.click();
  };

  const startExportWorkflow = (test: TestRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setLanguageSelector(test);
  };

  const handleExportToForms = async (test: TestRecord, lang: string) => {
    setLanguageSelector(null);
    onLoadingState(true, `ARCHITECTING GOOGLE FORM IN ${lang.toUpperCase()}...`);
    try {
      const script = await generateGoogleFormScript(test, lang);
      setExportModal({ testName: test.testName, script });
    } catch (err: any) {
      if (err.message === "QUOTA_EXHAUSTED") {
        alert("Quota Exceeded: Please check your Gemini API plan.");
      } else if (err.message === "KEY_REQUIRED") {
        alert("Authentication Error: Connect a valid API key first.");
      } else {
        alert("Failed to generate form. Please try again.");
      }
    } finally {
      onLoadingState(false);
    }
  };

  const handleDownloadMarkdown = async (test: TestRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetLang = selectedLangs[test.id] || 'original';
    setIsTranslating(test.id);

    try {
      let content = test.extractedContent;
      let summary = `
# ${test.testName} - Clinical Specifications

## Specifications Summary
- **Test Type:** ${test.testType}
- **Item Count:** ${test.itemCount}
- **Target Age:** ${test.ageTarget}
- **Administration Mode:** ${test.description}
- **Purpose:** ${test.testPurpose}

## Administration Methods
${test.administrationMethod}

---

## Test Content & Instructions
`;
      
      if (targetLang !== 'original') {
        onLoadingState(true, `TRANSLATING EXTRACTION TO ${targetLang.toUpperCase()}...`);
        const fullContentToTranslate = `${summary}\n${test.extractedContent}`;
        content = await translateTest(fullContentToTranslate, targetLang);
      } else {
        content = summary + test.extractedContent;
      }

      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${test.testName.replace(/\s+/g, '_')}_${targetLang.toUpperCase()}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      alert("Translation failed. " + (error.message === "QUOTA_EXHAUSTED" ? "Quota exceeded." : "Connection error."));
    } finally {
      setIsTranslating(null);
      onLoadingState(false);
    }
  };

  const filteredTests = useMemo(() => {
    return tests.filter(t => 
      t.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.testPurpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tests, searchTerm]);

  return (
    <div className="flex flex-col">
      <div className="px-10 py-6 border-b border-slate-800 bg-slate-900/20">
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-600" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-5 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] font-black text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all uppercase tracking-widest"
            placeholder="Search Repository..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-950/40">
              <th className="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Instrument</th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Purpose</th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Metadata</th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {filteredTests.map((test) => (
              <tr 
                key={test.id} 
                className="hover:bg-white/[0.02] cursor-pointer transition-all group"
                onClick={() => onSelect(test)}
              >
                <td className="px-10 py-8 max-w-xs">
                  <div className="flex flex-col">
                    <span className="font-black text-sm tracking-tight text-slate-200 group-hover:text-white transition-colors uppercase">
                      {test.testName}
                    </span>
                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1 opacity-40">ID: {test.id.toUpperCase()}</span>
                  </div>
                </td>
                <td className="px-10 py-8 max-w-md">
                   <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">{test.testPurpose}</p>
                </td>
                <td className="px-10 py-8 whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border w-fit ${test.isSelfReport ? 'bg-indigo-500/5 text-indigo-400 border-indigo-500/10' : 'bg-cyan-500/5 text-cyan-400 border-cyan-500/10'}`}>
                      {test.isSelfReport ? 'Self-Report' : 'Clinician-Led'}
                    </span>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                      {test.testType}
                    </span>
                  </div>
                </td>
                <td className="px-10 py-8 text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-3">
                    <div className="relative">
                      <select 
                        value={selectedLangs[test.id] || 'original'}
                        onChange={(e) => setSelectedLangs({...selectedLangs, [test.id]: e.target.value})}
                        className="appearance-none bg-slate-950 border border-slate-800 text-slate-500 text-[9px] font-black uppercase py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:border-indigo-500/50 cursor-pointer hover:border-slate-700 transition-colors"
                      >
                        {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                      </select>
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700">
                        <ChevronDown className="w-3 h-3" strokeWidth={3} />
                      </div>
                    </div>

                    <button 
                      title="Export to Google Forms"
                      onClick={e => startExportWorkflow(test, e)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500/5 text-purple-400 border border-purple-500/10 rounded-xl hover:bg-purple-500/10 transition-all group/btn"
                    >
                      <ExternalLink size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest hidden xl:inline">Export</span>
                    </button>

                    <button 
                      title="Download Markdown Extraction"
                      disabled={isTranslating === test.id}
                      onClick={e => handleDownloadMarkdown(test, e)} 
                      className={`relative flex items-center justify-center gap-2 px-4 py-2 bg-white text-slate-950 rounded-xl text-[9px] font-black uppercase hover:bg-slate-100 transition-all ${isTranslating === test.id ? 'opacity-50' : ''}`}
                    >
                      {isTranslating === test.id ? (
                        <div className="w-3 h-3 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <FileText size={14} />
                          <span>Extraction</span>
                        </>
                      )}
                    </button>
                    
                    <button 
                      title="Download Original Source File"
                      onClick={e => handleDownloadOriginal(test, e)} 
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-400 rounded-xl text-[9px] font-black uppercase hover:text-white border border-slate-800 transition-colors"
                    >
                       <Download size={14} />
                       <span className="hidden xl:inline">Source</span>
                    </button>

                    <button 
                      title="Delete Record"
                      onClick={() => onDelete(test.id)} 
                      className="p-2 text-slate-700 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredTests.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-24 text-center">
                   <div className="flex flex-col items-center gap-3 opacity-20">
                     <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                     <p className="text-xs font-black uppercase tracking-[0.3em]">System Database Empty</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {languageSelector && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setLanguageSelector(null)}></div>
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
                </div>
                <div>
                   <h3 className="text-lg font-black text-white uppercase tracking-tight">Export Target Language</h3>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select language for Google Form content</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-2 mb-8">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleExportToForms(languageSelector, lang.name)}
                    className="flex items-center justify-between px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-left hover:border-purple-500/50 hover:bg-purple-500/5 group transition-all"
                  >
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest">{lang.name}</span>
                    <svg className="w-3 h-3 text-slate-700 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                ))}
             </div>

             <button 
                onClick={() => setLanguageSelector(null)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black uppercase text-[10px] tracking-widest rounded-xl transition-colors"
             >
                Cancel Interface
             </button>
          </div>
        </div>
      )}

      {exportModal && (
        <FormExportModal 
          testName={exportModal.testName} 
          script={exportModal.script} 
          onClose={() => setExportModal(null)} 
        />
      )}
    </div>
  );
};