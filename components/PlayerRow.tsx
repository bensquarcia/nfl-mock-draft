import { Player } from '@/types/draft';
import Link from 'next/link';

interface PlayerRowProps {
  player: Player;
  rank: number;
  onDraft: (player: Player) => void;
  isTeamNeed: boolean;
}

export default function PlayerRow({ player, rank, onDraft, isTeamNeed = false }: PlayerRowProps) {
  return (
    <div className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
      isTeamNeed 
        ? "bg-blue-600/10 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
        : "bg-slate-800/40 border-slate-700/50"
    } hover:border-blue-500/50 hover:bg-slate-800/80`}>
      
      <div className="flex items-center gap-6">
        <span className={`text-xl font-black w-8 ${isTeamNeed ? "text-blue-400" : "text-slate-700 group-hover:text-blue-500/50"}`}>
          {rank}
        </span>
        
        {player.college_logo_url && (
          <div className="w-12 h-12 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0 shadow-md">
            <img src={player.college_logo_url} alt="" className="w-full h-full object-contain" />
          </div>
        )}
        
        <div>
          <div className="flex items-center gap-3">
            {/* CLICKABLE PLAYER NAME */}
            <Link href={`/player/${player.slug || ""}`}>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors cursor-pointer decoration-blue-500/30 hover:underline">
                {player.name}
              </h3>
            </Link>
            
            {isTeamNeed && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500 text-[10px] font-black uppercase tracking-tighter text-white animate-pulse">
                Team Need
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              {player.position} <span className="mx-1 text-slate-600">|</span> {player.college}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase bg-slate-950/50 px-2 py-0.5 rounded border border-white/5">
              <span>{player.ht || '--'}</span>
              <span className="text-slate-800">•</span>
              <span>{player.wt ? `${player.wt} lbs` : '--'}</span>
              <span className="text-slate-800">•</span>
              <span className="text-blue-400/80">{player.cls || '--'}</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => onDraft(player)}
        className="opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black py-2.5 px-7 rounded-lg uppercase tracking-widest transition-all transform translate-x-4 group-hover:translate-x-0 active:scale-95 shadow-lg shadow-blue-500/20"
      >
        Draft Player
      </button>
    </div>
  );
}