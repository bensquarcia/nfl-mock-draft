"use client";

interface FairnessMeterProps {
  userValue: number;
  cpuValue: number;
  isFair: boolean;
  fairnessRatio: number;
  onConfirm: (force: boolean) => void;
  canAccept: boolean;
  canForce: boolean;
}

export default function FairnessMeter({ userValue, cpuValue, isFair, fairnessRatio, onConfirm, canAccept, canForce }: FairnessMeterProps) {
  return (
    <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-6 shrink-0">
      <div className="w-full space-y-2">
        <div className="flex justify-between items-end">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trade Fairness Meter</p>
          <p className={`text-[10px] font-black uppercase tracking-tighter ${isFair ? 'text-green-600' : 'text-slate-400'}`}>
            {userValue === 0 && cpuValue === 0 ? "Pending Selection" : isFair ? "Fair Exchange" : fairnessRatio < 0.85 ? "Insufficient Value" : "Overpayment"}
          </p>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden relative">
          <div className={`h-full transition-all duration-500 rounded-full ${isFair ? 'bg-green-500' : 'bg-amber-400'}`} style={{ width: `${Math.min(fairnessRatio * 50, 100)}%` }} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col"><p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Value Analysis</p><div className="text-xs font-black uppercase flex items-center gap-2"><span className="text-blue-600">{userValue} Pts Out</span><span className="text-slate-200">|</span><span className="text-blue-600">{cpuValue} Pts In</span></div></div>
        <div className="flex gap-3 w-full md:w-auto">
          <button disabled={!canForce} onClick={() => onConfirm(true)} className="flex-1 md:w-48 bg-blue-600 hover:bg-blue-700 disabled:opacity-20 text-white font-black px-6 py-4 rounded-2xl uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95">Force Trade</button>
          <button disabled={!canAccept} onClick={() => onConfirm(false)} className="flex-1 md:w-48 bg-slate-900 hover:bg-slate-800 disabled:opacity-10 text-white font-black px-6 py-4 rounded-2xl uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95 border-b-4 border-slate-700">Accept Trade</button>
        </div>
      </div>
    </div>
  );
}