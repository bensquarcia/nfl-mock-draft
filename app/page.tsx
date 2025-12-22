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
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-8 overflow-hidden relative">
      {/* Soft Blue Gradient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-100/50 blur-[120px] pointer-events-none" />

      <header className="text-center mb-16 relative z-10">
        <h1 className="text-7xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-800">
          Draft Central <span className="text-slate-200">2026</span>
        </h1>
        <p className="text-slate-500 mt-4 font-black uppercase tracking-[0.4em] text-sm">The Ultimate Scouting Toolkit</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full relative z-10">
        {tools.map((tool) => (
          <Link 
            key={tool.title} 
            href={tool.link}
            className={`group relative p-8 rounded-3xl border transition-all duration-300
              ${tool.status === "Active" 
                ? "bg-white border-slate-200 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer" 
                : "bg-slate-100/50 border-slate-200 opacity-60 cursor-not-allowed"
              }`}
            onClick={(e) => {
              if (tool.status === "Coming Soon") e.preventDefault();
            }}
          >
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{tool.icon}</div>
            <h2 className="text-2xl font-black uppercase italic mb-3 group-hover:text-blue-600 transition-colors">
              {tool.title}
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
              {tool.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tool.status === "Active" ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-slate-200 text-slate-500"}`}>
                {tool.status}
              </span>
              {tool.status === "Active" && (
                <span className="text-blue-600 font-black text-xs group-hover:translate-x-1 transition-transform">
                  LAUNCH →
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <footer className="mt-20 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
        Powered by Draft Engine v2.0
      </footer>
    </main>
  );
}