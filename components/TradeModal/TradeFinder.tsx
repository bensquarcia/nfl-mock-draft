"use client";

export default function TradeFinder() {
  return (
    <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="font-black uppercase italic text-lg text-slate-900 tracking-tight">Trade Finder</h3>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Initialize league-wide scanning module...</p>
      <div className="mt-6 flex justify-center">
        <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-blue-600 animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
  );
}