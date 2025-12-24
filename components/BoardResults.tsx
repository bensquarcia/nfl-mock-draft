"use client";
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Player } from '@/types/draft';

interface BoardResultsProps {
  rankedPlayers: Player[];
  boardSize: number;
  boardName: string;
  onBack: () => void;
}

export default function BoardResults({ 
  rankedPlayers, 
  boardSize, 
  boardName, 
  onBack 
}: BoardResultsProps) {
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!resultsRef.current) return;
    
    // useCORS is vital if your logos are hosted on a different domain (like Supabase)
    const canvas = await html2canvas(resultsRef.current, { 
      backgroundColor: '#f8fafc', 
      scale: 2,
      useCORS: true 
    });
    
    const link = document.createElement('a');
    link.download = `${boardName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Logic to determine grid columns based on size
  const gridCols = boardSize <= 50 ? "grid-cols-5" : "grid-cols-2 md:grid-cols-6";

  return (
    <main className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      <div className="max-w-7xl w-full flex justify-between items-end mb-8 shrink-0">
        <div className="text-left">
          <h1 className="text-4xl font-black italic uppercase text-blue-600 leading-none">
            {boardName}
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
            Final Rankings Board
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onBack} 
            className="px-6 py-3 text-slate-400 hover:text-slate-600 font-black uppercase text-[10px] transition-colors"
          >
            Back to Editor
          </button>
          <button 
            onClick={handleDownload} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-black uppercase text-xs shadow-lg transition-all active:scale-95"
          >
            Download PNG
          </button>
        </div>
      </div>

      {/* This is the area captured by the screenshot */}
      <div 
        ref={resultsRef} 
        className={`w-full max-w-7xl bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm grid ${gridCols} gap-4`}
      >
        {Array.from({ length: boardSize }).map((_, i) => {
          const player = rankedPlayers[i];
          return (
            <div 
              key={i} 
              className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center text-center space-y-2 group"
            >
              <span className="text-xl font-black italic text-blue-600/30 group-hover:text-blue-600 transition-colors">
                {i + 1}
              </span>
              <div className="w-10 h-10 flex items-center justify-center">
                {player?.college_logo_url ? (
                  <img src={player.college_logo_url} className="w-full h-full object-contain" alt="" />
                ) : (
                  <div className="w-6 h-6 bg-slate-200 rounded-full" />
                )}
              </div>
              <div className="space-y-0.5">
                <p className="font-black uppercase text-[11px] italic leading-tight text-slate-900">
                  {player?.name || "---"}
                </p>
                {player && (
                   <p className="text-[9px] font-bold text-slate-400 uppercase">
                    {player.position} | {player.college}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}