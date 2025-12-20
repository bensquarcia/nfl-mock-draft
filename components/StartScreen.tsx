// src/components/StartScreen.tsx
interface StartScreenProps {
  onStart: (rounds: number) => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <main className="h-screen bg-[#0f172a] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-8 bg-slate-900/50 p-10 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl text-white">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
          Mock Draft <span className="text-white/20">2026</span>
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Select Draft Length</p>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 7].map(r => (
            <button key={r} onClick={() => onStart(r)} className="bg-slate-800 hover:bg-blue-600 border border-slate-700 hover:border-blue-400 py-4 rounded-xl font-black text-xl transition-all active:scale-95">
              {r === 7 ? "Full" : r}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 italic uppercase font-bold tracking-widest">Select number of rounds</p>
      </div>
    </main>
  );
}