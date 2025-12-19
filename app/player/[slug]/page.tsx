import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlayerProfile({ params }: PageProps) {
  // 1. Await params for Next.js 15 compatibility
  const { slug } = await params;

  // 2. Fetch the player data using your specific column names: 'bio' and 'pro_comp'
  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!player || error) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      {/* Navigation - Preserves draft state via Home page localStorage */}
      <nav className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-blue-400 font-black uppercase text-xs tracking-widest hover:text-white transition-colors">
            ← Back to Draft Board
          </Link>
          <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
            2026 Prospect Profile
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8 lg:p-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
          <div className="w-48 h-48 bg-white rounded-3xl p-6 shadow-2xl shadow-blue-500/10 shrink-0 flex items-center justify-center">
            {player.college_logo_url ? (
              <img 
                src={player.college_logo_url} 
                alt={player.college} 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center">
                <span className="text-slate-400 font-black text-4xl">{player.college?.substring(0,2)}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {/* Draft Projection Badge */}
              <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                {player.projection || "HS Ranking"}
              </div>
              
              {/* HS Stars - Renders gold stars based on hs_stars column */}
              {player.hs_stars && (
                <div className="flex items-center gap-0.5 text-yellow-500 text-sm">
                  {Array.from({ length: Number(player.hs_stars) }).map((_, i) => (
                    <span key={i} className="drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">★</span>
                  ))}
                </div>
              )}
            </div>

            <h1 className="text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-none">
              {player.name}
            </h1>
            <p className="text-2xl font-bold text-slate-400 uppercase tracking-tight">
              {player.position} <span className="text-slate-700 mx-2">|</span> {player.college}
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            {/* SCOUTING REPORT - Dynamic from 'bio' */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-black uppercase italic text-blue-500 whitespace-nowrap">
                  Scouting Report
                </h2>
                <div className="h-px bg-slate-800 w-full"></div>
              </div>
              <p className="text-xl text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                {player.bio || "Full scouting report is currently being drafted by our expert team."}
              </p>
            </section>

            {/* NFL COMPARISON - Dynamic from 'pro_comp' */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-black uppercase italic text-blue-500 whitespace-nowrap">
                  NFL Comparison
                </h2>
                <div className="h-px bg-slate-800 w-full"></div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl inline-block min-w-[300px] shadow-inner">
                <p className="text-4xl font-black italic uppercase tracking-tight text-white">
                  {player.pro_comp || "TBD"}
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2 italic">
                  Archetype Comparison
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar - Prospect Specs */}
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl space-y-8 shadow-xl relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
              
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] relative z-10">Prospect Physicals</h3>
              
              <div className="grid grid-cols-2 gap-8 relative z-10">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Height</p>
                  <p className="text-xl font-bold">{player.ht || "--"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Weight</p>
                  <p className="text-xl font-bold">{player.wt ? `${player.wt} lbs` : "--"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Class</p>
                  <p className="text-xl font-bold">{player.cls || "--"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Board Rank</p>
                  <p className="text-xl font-bold text-blue-400">#{player.rank || "--"}</p>
                </div>
              </div>

              {/* Draft Outlook Box */}
              <div className="pt-6 border-t border-slate-800 relative z-10">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">Draft Outlook</p>
                <p className="text-lg font-bold text-white uppercase italic leading-tight">
                  {player.projection || "1st Round Talent"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}