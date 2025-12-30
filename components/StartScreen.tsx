// src/components/StartScreen.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface StartScreenProps {
  onStart: (rounds: number) => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  // --- REUSABLE HEADER ---
  const UnifiedHeader = () => (
    <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 shadow-sm">
      <div className="flex items-center gap-4">
        <Link 
          href="/" 
          className="bg-slate-50 border border-slate-200 text-slate-600 p-2 rounded-xl hover:bg-white hover:shadow-md transition-all active:scale-95 flex items-center justify-center"
          title="Back to Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </Link>
        <div className="h-8 w-[1px] bg-slate-200 mx-1" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-black italic uppercase tracking-tighter leading-none text-slate-900">
              Mock Draft <span className="text-blue-600">Simulator</span>
            </h2>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Professional Scouting</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px]" />

      <UnifiedHeader />

      <div className="max-w-md w-full text-center space-y-10 bg-white p-12 rounded-[40px] border border-slate-200 shadow-2xl shadow-blue-900/5 relative z-10">
        <div className="space-y-3">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
            2026 Draft Class
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-tight">
            Ready to <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-[-2px]">Start</span> Your Draft?
          </h1>
          <p className="text-slate-500 font-medium text-sm">Configure your experience and take control of the war room.</p>
        </div>

        <div className="space-y-6">
          <p className="text-slate-900 font-black uppercase tracking-[0.2em] text-[10px]">Select Draft Length</p>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 7].map(r => (
              <button 
                key={r} 
                onClick={() => onStart(r)} 
                className="group relative bg-white hover:bg-slate-900 border-2 border-slate-100 hover:border-slate-900 p-6 rounded-2xl transition-all active:scale-95 flex flex-col items-center justify-center gap-1 shadow-sm hover:shadow-xl"
              >
                {/* Darker Number: text-slate-900 */}
                <span className="text-4xl font-black italic text-slate-900 group-hover:text-white transition-colors uppercase">
                    {r}
                </span>
                {/* Darker Label: text-slate-600 */}
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 group-hover:text-blue-400 transition-colors">
                  {r === 1 ? "Round" : "Rounds"}
                </span>
                {r === 7 && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-lg">FULL</div>
                )}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[9px] text-slate-400 italic uppercase font-bold tracking-[0.3em] pt-4">
          Professional Grade Simulation Engine
        </p>
      </div>
    </main>
  );
}