// src/components/PlayerRow.tsx
import { Player } from '@/types/draft';

interface PlayerRowProps {
  player: Player;
  rank: number;
  onDraft: (player: Player) => void;
  onViewInfo: (player: Player) => void;
  isTeamNeed: boolean;
  draftButtonText?: string; // New optional prop for custom button text
}

export default function PlayerRow({ 
  player, 
  rank, 
  onDraft, 
  onViewInfo, 
  isTeamNeed = false,
  draftButtonText = "DRAFT PLAYER" // Default value for the simulator
}: PlayerRowProps) {
  return (
    <div className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
      isTeamNeed 
        ? "bg-blue-50 border-blue-200 shadow-sm" 
        : "bg-white border-slate-200 shadow-sm"
    } hover:border-blue-400 hover:shadow-md`}>
      
      <div className="flex items-center gap-6">
        <span className={`text-xl font-black w-8 ${isTeamNeed ? "text-blue-600" : "text-slate-300 group-hover:text-blue-400"}`}>
          {rank}
        </span>
        
        {player.college_logo_url && (
          <div className="w-12 h-12 flex items-center justify-center shrink-0">
            <img src={player.college_logo_url} alt="" className="w-full h-full object-contain" />
          </div>
        )}
        
        <div>
          <div className="flex items-center gap-3">
            <div 
              onClick={() => onViewInfo(player)}
              className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer hover:underline decoration-blue-500/30"
            >
              {player.name}
            </div>
            
            {isTeamNeed && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-[10px] font-black uppercase tracking-tighter text-white animate-pulse">
                Team Need
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {player.position} <span className="mx-1 text-slate-300">|</span> {player.college}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              <span>{player.ht || '--'}</span>
              <span className="text-slate-200">•</span>
              <span>{player.wt ? `${player.wt} lbs` : '--'}</span>
              <span className="text-slate-200">•</span>
              <span className="text-blue-600">{player.cls || '--'}</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDraft(player);
        }}
        className="opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-2.5 px-7 rounded-lg uppercase tracking-widest transition-all shadow-md active:scale-95"
      >
        {draftButtonText}
      </button>
    </div>
  );
}