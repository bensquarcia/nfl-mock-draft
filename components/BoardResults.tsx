"use client";
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
  
  /**
   * Logic to determine grid columns and layout based on size:
   * - 50 or less: 5 columns (standard) or 10 columns (very compact) to fit one screen.
   * - Over 50: Use a 10-column grid and make the container scrollable.
   */
  const isLargeBoard = boardSize > 50;
  
  // Use a 5-column grid for small boards (10, 25) 
  // and a 10-column grid for larger ones (50+) to keep it on one screen.
  const gridCols = boardSize <= 25 ? "grid-cols-5" : "grid-cols-5 md:grid-cols-10";

  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack();
    }
  };

  return (
    <main className="h-screen bg-slate-50 p-8 flex flex-col items-center overflow-hidden">
      {/* Header Area */}
      <div className="max-w-7xl w-full flex justify-between items-end mb-8 shrink-0">
        <div className="text-left">
          <h1 className="text-4xl font-black italic uppercase text-blue-600 leading-none">
            {boardName}
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
            Final Rankings Board | Top {boardSize}
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={handleBack} 
            className="px-6 py-3 text-slate-400 hover:text-slate-600 font-black uppercase text-[10px] transition-colors cursor-pointer"
          >
            Back to Editor
          </button>
        </div>
      </div>

      {/* Results Container */}
      <div 
        className={`w-full max-w-7xl bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden ${isLargeBoard ? 'h-full' : 'h-auto'}`}
      >
        {/* Scrollable Grid Area */}
        <div className={`grid ${gridCols} gap-3 overflow-y-auto pr-2 custom-scrollbar ${isLargeBoard ? 'flex-grow' : ''}`}>
          {Array.from({ length: boardSize }).map((_, i) => {
            const player = rankedPlayers[i];
            return (
              <div 
                key={i} 
                className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex flex-col items-center text-center space-y-1 group transition-all hover:border-blue-200 hover:bg-blue-50/30"
              >
                {/* Updated rank number color for better visibility */}
                <span className="text-lg font-black italic text-slate-400 group-hover:text-blue-600 transition-colors">
                  {i + 1}
                </span>
                
                <div className="w-8 h-8 flex items-center justify-center">
                  {player?.college_logo_url ? (
                    <img src={player.college_logo_url} className="w-full h-full object-contain" alt="" />
                  ) : (
                    <div className="w-5 h-5 bg-slate-200 rounded-full" />
                  )}
                </div>

                <div className="space-y-0">
                  <p className="font-black uppercase text-[9px] italic leading-tight text-slate-900 truncate w-full max-w-[80px]">
                    {player?.name || "---"}
                  </p>
                  {player && (
                     <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">
                      {player.position} | {player.college}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}