// src/app/page.tsx
"use client";
import Link from 'next/link';

export default function HomePage() {
  const tools = [
    {
      title: "Draft Simulator",
      description: "Run a full 7-round mock draft with real-time trades and team needs.",
      link: "/simulator",
      icon: "🏈",
      status: "Active"
    },
    {
      title: "Big Board Creator",
      description: "Rank your top prospects and build your own custom scouting board.",
      link: "#",
      icon: "📊",
      status: "Coming Soon"
    },
    {
      title: "Prospect Database",
      description: "Deep dive into player stats, college tape, and scouting reports.",
      link: "#",
      icon: "📜",
      status: "Coming Soon"
    }
  ];

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-8">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-600/20 blur-[120px] pointer-events-none" />

      <header className="text-center mb-16 relative z-10">
        <h1 className="text-7xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600">
          Draft Central <span className="text-white/10">2026</span>
        </h1>
        <p className="text-slate-400 mt-4 font-bold uppercase tracking-[0.4em] text-sm">The Ultimate Scouting Toolkit</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full relative z-10">
        {tools.map((tool) => (
          <Link 
            key={tool.title} 
            href={tool.link}
            className={`group relative p-8 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl transition-all hover:border-blue-500/50 hover:bg-slate-800/50 ${tool.status === "Coming Soon" ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"}`}
          >
            <div className="text-4xl mb-6">{tool.icon}</div>
            <h2 className="text-2xl font-black uppercase italic mb-3 group-hover:text-blue-400 transition-colors">
              {tool.title}
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
              {tool.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tool.status === "Active" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-slate-800 text-slate-500"}`}>
                {tool.status}
              </span>
              {tool.status === "Active" && (
                <span className="text-blue-500 font-black text-xs group-hover:translate-x-1 transition-transform">
                  LAUNCH →
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <footer className="mt-20 text-slate-600 font-bold uppercase text-[10px] tracking-widest">
        Powered by Draft Engine v2.0
      </footer>
    </main>
  );
}