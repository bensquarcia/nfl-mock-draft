// src/components/PlayerProfile.tsx
import { Player } from '@/types/draft';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface PlayerProfileProps {
  player: Player;
  staticRank: number;
  onClose: () => void;
}

export default function PlayerProfile({ player, staticRank, onClose }: PlayerProfileProps) {
  const [stats, setStats] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const hometown = (player as any).hometown || "City, State";
  const starCount = player.hs_stars || 0;

  useEffect(() => {
    async function fetchPlayerStats() {
      console.log("Looking for stats with ID:", player.id);

      const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .eq('player_id', player.id) 
        .order('season', { ascending: false });

      if (error) {
        console.error("Supabase Error:", error.message);
      }
      
      if (data) {
        console.log("Stats found in DB:", data);
        setStats(data);
      }
      setLoadingStats(false);
    }
    
    if (player?.id) {
      fetchPlayerStats();
    }
  }, [player.id]);

  const renderStatsTable = () => {
    if (loadingStats) return <div className="text-slate-400 italic text-sm">Loading stats...</div>;
    if (stats.length === 0) return <div className="text-slate-400 italic text-sm">No collegiate stats found.</div>;

    const pos = player.position?.toUpperCase();

    return (
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="py-3 font-black uppercase text-[10px] tracking-widest text-slate-400">Year</th>
              <th className="py-3 font-black uppercase text-[10px] tracking-widest text-slate-400">Team</th>
              
              {/* QB STATS */}
              {pos === 'QB' && (
                <>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Att</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Cmp</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Pass Yds</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Pass TD</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Int</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">CMP%</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Rush Yds</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Rush TD</th>
                </>
              )}
              {/* SKILL POSITIONS */}
              {(pos === 'RB' || pos === 'WR' || pos === 'TE') && (
                <>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Rush Att</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Rush Yds</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Rush TD</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Rec</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Rec Yds</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Rec TD</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Fum</th>
                </>
              )}
              {/* DEFENSE */}
              {['LB', 'EDGE', 'CB', 'S', 'DL'].includes(pos || '') && (
                <>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Tkl</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Solo</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Ast</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">TFL</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Sack</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">INT</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">PD</th>
                </>
              )}
              {/* SPECIAL TEAMS */}
              {['K', 'P'].includes(pos || '') && (
                <>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">FGM</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">FGA</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">XPM</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Punts</th>
                  <th className="py-3 font-black uppercase text-[10px] tracking-widest text-blue-600 text-right">Punt Yds</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {stats.map((s, idx) => {
              const cmpPct = s.passing_att > 0 ? ((s.passing_cmp / s.passing_att) * 100).toFixed(1) : "0";

              return (
                <tr key={idx} className="border-b border-slate-100 group hover:bg-slate-50 transition-colors">
                  <td className="py-4 font-bold text-slate-900 italic">{s.season}</td>
                  <td className="py-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">{s.team}</td>
                  
                  {pos === 'QB' && (
                    <>
                      <td className="py-4 text-right font-black italic">{s.passing_att || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.passing_cmp || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.passing_yds || 0}</td>
                      <td className="py-4 text-right font-black italic text-blue-600">{s.passing_td || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.passing_int || 0}</td>
                      <td className="py-4 text-right font-black italic">{cmpPct}%</td>
                      <td className="py-4 text-right font-black italic">{s.rushing_yds || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.rushing_td || 0}</td>
                    </>
                  )}
                  {(pos === 'RB' || pos === 'WR' || pos === 'TE') && (
                    <>
                      <td className="py-4 text-right font-black italic">{s.rushing_att || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.rushing_yds || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.rushing_td || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.receiving_rec || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.receiving_yds || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.receiving_td || 0}</td>
                      <td className="py-4 text-right font-black italic text-red-600">{s.fumbles_fum || 0}</td>
                    </>
                  )}
                  {['LB', 'EDGE', 'CB', 'S', 'DL'].includes(pos || '') && (
                    <>
                      <td className="py-4 text-right font-black italic">{s.defensive_tkl || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.defensive_solo || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.defensive_ast || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.defensive_tfl || 0}</td>
                      <td className="py-4 text-right font-black italic text-blue-600">{s.defensive_sack || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.defensive_int || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.defensive_pd || 0}</td>
                    </>
                  )}
                  {['K', 'P'].includes(pos || '') && (
                    <>
                      <td className="py-4 text-right font-black italic">{s.kicking_fgm || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.kicking_fga || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.kicking_xpm || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.punting_no || 0}</td>
                      <td className="py-4 text-right font-black italic">{s.punting_yds || 0}</td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

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
        <div key={idx} className={`leading-relaxed text-lg whitespace-pre-line text-slate-700 font-medium italic ${isOverviewContent ? "mb-12" : "mb-6"}`}>
          {cleanSection}
        </div>
      );
    });
  };

  // Helper to check if we should show the stats section
  const showStats = ['QB', 'RB', 'WR', 'TE', 'LB', 'EDGE', 'DL', 'CB', 'S'].includes(player.position?.toUpperCase() || '');

  return (
    <div className="fixed inset-0 z-[100] bg-white text-slate-900 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex justify-between items-center mb-12 border-b border-slate-100 pb-8">
          <button onClick={onClose} className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase text-[10px] tracking-widest">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Board
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 text-slate-500">
              {staticRank ? `Rank #${staticRank}` : 'Unranked'}
            </div>
            <div className="bg-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-md">
              Scouting Report
            </div>
          </div>
        </div>

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
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="text-[10px]">📍</span> {hometown}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20 border-b border-slate-100">
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

          <div className="space-y-6">
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 h-fit shadow-sm sticky top-8 space-y-10">
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

              <section>
                <h3 className="text-blue-600 font-black uppercase text-[10px] tracking-widest mb-4">
                  Pro Comparison
                </h3>
                <p className="text-xl font-black text-slate-900 uppercase italic leading-none">
                  {player.pro_comp || "TBD"}
                </p>
              </section>

              <section>
                <h3 className="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-4">
                  HS Star Rating
                </h3>
                <div className="flex items-center gap-3">
                  {starCount > 0 ? (
                    <>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-lg ${star <= starCount ? "text-yellow-500" : "text-slate-200"}`}>★</span>
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

        {/* Updated Stats Section - Only shows for specific positions */}
        {showStats && (
          <div className="mt-16 pb-20">
            <h3 className="text-slate-900 font-black uppercase text-xl tracking-tighter italic mb-4">
              Collegiate Production <span className="text-blue-600 ml-2">History</span>
            </h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">
              Verified stats via CFB Data API
            </p>
            {renderStatsTable()}
          </div>
        )}
      </div>
    </div>
  );
}