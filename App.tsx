import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { TestUpload } from './components/TestUpload.tsx';
import { TestTable } from './components/TestTable.tsx';
import { LoadingOverlay } from './components/LoadingOverlay.tsx';
import { BottomTabs, TabType } from './components/BottomTabs.tsx';
import { SaveConfirmationModal } from './components/SaveConfirmationModal.tsx';
import { TestRecord } from './types.ts';
import { SpotlightModal } from './components/SpotlightModal.tsx';
import { DuplicateWarningModal } from './components/DuplicateWarningModal.tsx';
import { storageService } from './services/storageService.ts';

const App: React.FC = () => {
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [activeTest, setActiveTest] = useState<TestRecord | null>(null);
  const [sessionStartTime] = useState<string>(new Date().toISOString());
  const [activeTab, setActiveTab] = useState<TabType>('scanner');
  const [pendingTest, setPendingTest] = useState<TestRecord | null>(null);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [duplicateTest, setDuplicateTest] = useState<TestRecord | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const savedTests = await storageService.getAllTests();
        setTests(savedTests);
        if (savedTests.length > 0) {
          setActiveTest(savedTests[0]);
        }
      } catch (e) {
        console.error("Failed to load records:", e);
      }
    };
    init();
  }, []);

  const handleAnalysisSuccess = (newTest: TestRecord) => {
    const isDuplicate = tests.some(t => 
      t.canonicalName.toLowerCase() === newTest.canonicalName.toLowerCase() ||
      (t.testName.toLowerCase() === newTest.testName.toLowerCase() && t.itemCount === newTest.itemCount)
    );

    if (isDuplicate) {
      setDuplicateTest(newTest);
      return;
    }

    setPendingTest(newTest);
  };

  const confirmSave = async () => {
    if (!pendingTest) return;
    try {
      await storageService.saveTest(pendingTest);
      setTests(prev => [pendingTest, ...prev]);
      setActiveTest(pendingTest);
      setPendingTest(null);
      setActiveTab('archive');
    } catch (e) {
      console.error("Failed to persist record:", e);
      alert("Storage Error: Test could not be saved locally.");
    }
  };

  const discardPending = () => {
    setPendingTest(null);
  };

  const handleDeleteTest = async (id: string) => {
    try {
      await storageService.deleteTest(id);
      setTests(prev => {
        const updated = prev.filter(t => t.id !== id);
        if (activeTest?.id === id) {
          setActiveTest(updated.length > 0 ? updated[0] : null);
        }
        return updated;
      });
    } catch (e) {
      console.error("Failed to delete record:", e);
    }
  };

  const handleLoadingState = (loading: boolean, message?: string) => {
    setIsLoading(loading);
    setLoadingMessage(message || 'PROCESSING...');
  };

  const stats = useMemo(() => {
    return {
      total: tests.length,
      session: tests.filter(t => t.uploadedAt >= sessionStartTime).length,
      selfReport: tests.filter(t => t.isSelfReport).length,
      clinicianLed: tests.filter(t => !t.isSelfReport).length
    };
  }, [tests, sessionStartTime]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 pb-24">
      <Navbar onHome={() => setActiveTab('scanner')} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          
          {activeTab === 'scanner' && (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-indigo-500 rounded-full"></div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Clinical Intake</h2>
              </div>
              <TestUpload 
                onUploadStart={(msg) => {
                  setIsLoading(true);
                  setLoadingMessage(msg);
                }}
                onUploadEnd={() => {
                  setIsLoading(false);
                  setLoadingMessage('');
                }}
                onSuccess={handleAnalysisSuccess}
              />
            </div>
          )}

          {activeTab === 'archive' && (
            <section className="bg-slate-900/50 rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden mb-12 backdrop-blur-sm">
              <div className="px-10 py-10 border-b border-slate-800 bg-gradient-to-br from-slate-900/50 to-transparent">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tight uppercase mb-2">Test Repository</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Unified Clinical Database</p>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-slate-950/50 px-5 py-3 rounded-2xl border border-slate-800 min-w-[100px]">
                      <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black mb-1">Total</p>
                      <p className="text-2xl font-black text-white leading-none">{stats.total}</p>
                    </div>
                    <div className="bg-slate-950/50 px-5 py-3 rounded-2xl border border-slate-800 min-w-[100px]">
                      <p className="text-[9px] uppercase tracking-widest text-indigo-400 font-black mb-1">Session</p>
                      <p className="text-2xl font-black text-indigo-400 leading-none">{stats.session}</p>
                    </div>
                  </div>
                </div>
              </div>

              <TestTable 
                tests={tests} 
                onDelete={handleDeleteTest} 
                onSelect={(test) => {
                  setActiveTest(test);
                  setIsSpotlightOpen(true);
                }} 
                onLoadingState={handleLoadingState}
              />
            </section>
          )}
        </div>
      </main>

      <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {isSpotlightOpen && activeTest && (
        <SpotlightModal 
          test={activeTest} 
          onClose={() => setIsSpotlightOpen(false)} 
        />
      )}

      {pendingTest && (
        <SaveConfirmationModal 
          test={pendingTest} 
          onConfirm={confirmSave} 
          onCancel={discardPending} 
        />
      )}

      {duplicateTest && (
        <DuplicateWarningModal 
          test={duplicateTest} 
          onClose={() => setDuplicateTest(null)} 
        />
      )}

      {isLoading && <LoadingOverlay message={loadingMessage} />}
    </div>
  );
};

export default App;
