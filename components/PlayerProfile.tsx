import { Player } from '@/types/draft';

interface PlayerProfileProps {
  player: Player;
  onClose: () => void;
}

export default function PlayerProfile({ player, onClose }: PlayerProfileProps) {
  // Casting hometown for when you add it to Supabase later
  const hometown = (player as any).hometown || "City, State";
  const starCount = player.hs_stars || 0;

  const renderFormattedBio = (bio: string | undefined) => {
    if (!bio) return "Scouting report processing... We are currently evaluating game tape.";

    const sections = bio.split(/(OVERVIEW:|STRENGTHS:|WEAKNESSES:)/i);
    
    return sections.map((section, idx) => {
      const cleanSection = section.trim();
      if (!cleanSection) return null;

      const upper = cleanSection.toUpperCase();

      if (upper === 'OVERVIEW:' || upper === 'STRENGTHS:' || upper === 'WEAKNESSES:') {
        return (
          <div key={idx} className="mt-10 mb-3 first:mt-0">
            <span className="font-black text-slate-900 uppercase tracking-[0.2em] text-sm border-b-2 border-blue-600 pb-1">
              {cleanSection}
            </span>
          </div>
        );
      }

      const isOverviewContent = idx < 3;

      return (
        <div 
          key={idx} 
          className={`leading-relaxed text-lg whitespace-pre-line text-slate-700 font-medium ${
            isOverviewContent ? "italic mb-12" : "mb-6"
          }`}
        >
          {cleanSection}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white text-slate-900 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-12 border-b border-slate-100 pb-8">
          <button 
            onClick={onClose} 
            className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase text-[10px] tracking-widest"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Board
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 text-slate-500">
              {player.rank ? `Rank #${player.rank}` : 'Unranked'}
            </div>
            <div className="bg-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-md">
              Scouting Report
            </div>
          </div>
        </div>

        {/* Player Identity Section */}
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-12 border-b border-slate-50 pb-12">
          <div className="w-32 h-32 flex items-center justify-center shrink-0">
            {player.college_logo_url && (
              <img src={player.college_logo_url} alt="" className="w-full h-full object-contain" />
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-tight mb-2 text-slate-900">
              {player.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 font-bold uppercase text-xs tracking-[0.2em] items-center">
              <span className="text-blue-600">{player.position}</span>
              <span className="text-slate-200">/</span>
              <span>{player.college}</span>
              <span className="text-slate-200">/</span>
              <span className="text-slate-900">{player.cls}</span>
              <span className="text-slate-200">/</span>
              {/* HOMETOWN SECTION */}
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="text-[10px]">📍</span> {hometown}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-blue-600 font-black uppercase text-[10px] tracking-[0.3em] mb-10 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-blue-600"></span>
                Official Scouting Report
              </h3>
              
              <div className="space-y-2">
                {renderFormattedBio(player.bio)}
              </div>
            </section>
          </div>

          {/* SIDEBAR: Physical, Pro Comp, and HS Rating */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 h-fit shadow-sm sticky top-8 space-y-10">
              
              {/* Physical Section */}
              <section>
                <h3 className="text-slate-900 font-black uppercase text-[10px] tracking-widest mb-6 border-b border-slate-200 pb-3">
                  Physical Profile
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-black uppercase text-[10px] tracking-tighter">Height</span>
                    <span className="font-bold text-slate-900">{player.ht || "--"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-black uppercase text-[10px] tracking-tighter">Weight</span>
                    <span className="font-bold text-slate-900">{player.wt ? `${player.wt} lbs` : "--"}</span>
                  </div>
                </div>
              </section>

              {/* Pro Comp Section */}
              <section>
                <h3 className="text-blue-600 font-black uppercase text-[10px] tracking-widest mb-4">
                  Pro Comparison
                </h3>
                <p className="text-xl font-black text-slate-900 uppercase italic leading-none">
                  {player.pro_comp || "TBD"}
                </p>
              </section>

              {/* HS Rating Section */}
              <section>
                <h3 className="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-4">
                  HS Star Rating
                </h3>
                <div className="flex items-center gap-3">
                  {starCount > 0 ? (
                    <>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star} 
                            className={`text-lg ${star <= starCount ? "text-yellow-500" : "text-slate-200"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xl font-black text-slate-900 italic">{starCount}</span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-slate-300 italic">Unranked</span>
                  )}
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}