// src/components/PlayerProfile.tsx
import { Player } from '@/types/draft';

interface PlayerProfileProps {
  player: Player;
  onClose: () => void;
}

export default function PlayerProfile({ player, onClose }: PlayerProfileProps) {
  // We use a fallback of 0 so the star loop doesn't break
  const starCount = player.hs_stars || 0;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0f172a] text-white overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={onClose} 
            className="group flex items-center gap-2 text-slate-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Board
          </button>
          <div className="flex items-center gap-4">
             <div className="bg-slate-800 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-700 text-slate-400">
              {player.rank ? `Rank #${player.rank}` : 'Unranked'}
            </div>
            <div className="bg-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Scouting Report
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-12 border-b border-slate-800 pb-12">
          {player.college_logo_url && (
            <div className="w-32 h-32 bg-white rounded-3xl p-5 flex items-center justify-center shadow-2xl shrink-0">
              <img src={player.college_logo_url} alt="" className="w-full h-full object-contain" />
            </div>
          )}
          <div className="text-center md:text-left">
            <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-tight mb-2">
              {player.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">
              <span className="text-blue-400">{player.position}</span>
              <span className="text-slate-800">/</span>
              <span>{player.college}</span>
              <span className="text-slate-800">/</span>
              <span className="text-white">{player.cls}</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-blue-500 font-black uppercase text-[10px] tracking-[0.3em] mb-4">Prospect Overview</h3>
              <p className="text-slate-300 leading-relaxed text-xl font-medium">
                {player.bio || "Scouting report processing... We are currently evaluating game tape and athletic testing for this prospect."}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-blue-600/5 border border-blue-500/20 p-6 rounded-2xl">
                  <h4 className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-2">Pro Comparison</h4>
                  <p className="text-xl font-bold text-white uppercase italic">
                    {player.pro_comp || "TBD"}
                  </p>
               </div>
               
               <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                  <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">HS Rating</h4>
                  <div className="flex items-center gap-3">
                    {/* Check if player has stars, otherwise show N/A */}
                    {starCount > 0 ? (
                      <>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                              key={star} 
                              className={`text-xl ${star <= starCount ? "text-yellow-500" : "text-slate-700"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-2xl font-black text-white italic">
                          {starCount}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-black text-slate-700">N/A</span>
                    )}
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 h-fit">
              <h3 className="text-white font-black uppercase text-[10px] tracking-widest mb-8 border-b border-slate-800 pb-4">Physical Profile</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-black uppercase tracking-tighter">Height</span>
                  <span className="font-bold text-white">{player.ht || "--"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-black uppercase tracking-tighter">Weight</span>
                  <span className="font-bold text-white">{player.wt ? `${player.wt} lbs` : "--"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}