"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 
import Image from 'next/image'; // For your logo
import { supabase } from '@/lib/supabase';
import { Player } from '@/types/draft';

import BoardStart from '@/components/BoardStart';
import BoardCreator from '@/components/BoardCreator';
import BoardResults from '@/components/BoardResults';

export default function BigBoardPage() {
  const [mode, setMode] = useState<'start' | 'creator' | 'results'>('start');
  const [boardSize, setBoardSize] = useState<number>(50);
  const [players, setPlayers] = useState<Player[]>([]);
  const [rankedPlayers, setRankedPlayers] = useState<Player[]>([]);
  const [boardName, setBoardName] = useState<string>("2026 PROSPECT RANKINGS");

  useEffect(() => {
    async function fetchPlayers() {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('rank', { ascending: true });
      
      if (error) {
        console.error("Supabase error:", error.message);
        return;
      }
      
      if (data) setPlayers(data as Player[]);
    }
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (mode === 'creator' && rankedPlayers.length >= boardSize) {
      setMode('results');
    }
  }, [rankedPlayers, boardSize, mode]);

  // --- CLEAN HOME ICON BUTTON ---
  const HomeButton = () => (
    <Link 
      href="/" 
      className="fixed top-6 left-6 z-[100] bg-white border border-slate-200 text-slate-600 p-3 rounded-2xl shadow-sm hover:shadow-md hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95 flex items-center justify-center"
      title="Back to Home"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    </Link>
  );

  // --- BRANDING HEADER (Logo + Title) ---
  const BrandingHeader = () => (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
      <div className="w-10 h-10 relative">
        <Image 
          src="/logo.png" // Ensure your logo is in public/logo.png
          alt="Logo"
          fill
          className="object-contain"
        />
      </div>
      <div className="flex flex-col">
        <h2 className="text-sm font-black italic uppercase tracking-tighter leading-none text-slate-900">
          Big Board <span className="text-blue-600">Creator</span>
        </h2>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Professional Scouting Tool</p>
      </div>
    </div>
  );

  // --- 1. START SCREEN ---
  if (mode === 'start') {
    return (
      <>
        <HomeButton />
        <BoardStart 
          onSelect={(size: number) => { 
            setBoardSize(size); 
            setMode('creator'); 
          }} 
        />
      </>
    );
  }

  // --- 2. RESULTS SCREEN ---
  if (mode === 'results') {
    return (
      <>
        <HomeButton />
        <BoardResults 
          rankedPlayers={rankedPlayers} 
          boardSize={boardSize} 
          boardName={boardName} 
          onBack={() => setMode('creator')} 
        />
      </>
    );
  }

  // --- 3. CREATOR SCREEN ---
  return (
    <>
      <HomeButton />
      <BrandingHeader />
      <div className="pt-16"> {/* Added padding to prevent overlap with BrandingHeader */}
        <BoardCreator 
          players={players}
          rankedPlayers={rankedPlayers}
          setRankedPlayers={(val: Player[]) => setRankedPlayers(val)}
          boardSize={boardSize}
          boardName={boardName}
          setBoardName={(val: string) => setBoardName(val)}
          onComplete={() => setMode('results')}
          onReset={() => setMode('start')}
        />
      </div>
    </>
  );
}