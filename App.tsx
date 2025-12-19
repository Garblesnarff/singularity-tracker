import React, { useState } from 'react';
import { Claim, ParsingStatus } from './types';
import { parseTechPost } from './services/geminiService';
import InputSection from './components/InputSection';
import Dashboard from './components/Dashboard';
import { Cpu, Github, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<ParsingStatus>('idle');
  const [claims, setClaims] = useState<Claim[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setStatus('loading');
    setError(null);
    setClaims([]);

    try {
      const result = await parseTechPost(text);
      // Sort by significance desc
      const sortedResult = result.sort((a, b) => b.significance - a.significance);
      setClaims(sortedResult);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Synthetix
              </h1>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-xs font-mono text-slate-500 hidden sm:block">Powered by Gemini 3</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Intro Text (only show if no results yet) */}
            {status === 'idle' && (
              <div className="text-center py-12 mb-8">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                  Turn Chaos into <span className="text-indigo-400">Intelligence</span>
                </h2>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Paste your daily tech feed, newsletter, or synthesis post. 
                  We'll extract the signal from the noise using advanced reasoning.
                </p>
              </div>
            )}

            <InputSection onAnalyze={handleAnalyze} isLoading={status === 'loading'} />

            {status === 'error' && (
              <div className="max-w-4xl mx-auto mb-12 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-400">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {status === 'success' && (
               <Dashboard claims={claims} />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-900/50 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p className="mb-2">&copy; {new Date().getFullYear()} Synthetix. All rights reserved.</p>
            <p>Generated content may display inaccurate info, including about people, so double-check its responses.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
