"use client";

import React from 'react';

// This interface must match what is expected in the main page.tsx
interface BoardStartProps {
  onSelect: (size: number) => void;
}

export default function BoardStart({ onSelect }: BoardStartProps) {
  const boardOptions: number[] = [10, 25, 50, 75, 100, 300];

  return (
    <main className="h-screen bg-[#0f172a] flex items-center justify-center p-8 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-8 bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl backdrop-blur-xl text-white relative z-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
            Big Board <span className="text-white/20">Creator</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
            Rank the 2026 Class
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Select Number of Prospects
          </p>
          <div className="grid grid-cols-3 gap-3">
            {boardOptions.map((size: number) => (
              <button 
                key={size} 
                onClick={() => onSelect(size)} 
                className="bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-400 py-4 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-lg group relative overflow-hidden"
              >
                <span className="relative z-10">{size}</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-slate-600 italic uppercase font-bold tracking-widest">
          Choose your board depth
        </p>
      </div>
    </main>
  );
}