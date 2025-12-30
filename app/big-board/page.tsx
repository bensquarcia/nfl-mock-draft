"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 
import Image from 'next/image'; 
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
  // Fixed name - no longer editable in the UI
  const boardName = "2026 PROSPECT RANKINGS";

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

  // --- NEW UNIFIED HEADER (Logo + Title in Top Left) ---
  const UnifiedHeader = () => (
    <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 shadow-sm">
      <div className="flex items-center gap-4">
        <Link 
          href="/" 
          className="bg-slate-50 border border-slate-200 text-slate-600 p-2 rounded-xl hover:bg-white hover:shadow-md transition-all active:scale-95 flex items-center justify-center"
          title="Back to Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </Link>

        <div className="h-8 w-[1px] bg-slate-200 mx-1" /> {/* Divider */}

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <Image 
              src="/logo.png" 
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-black italic uppercase tracking-tighter leading-none text-slate-900">
              Big Board <span className="text-blue-600">Creator</span>
            </h2>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Professional Scouting</p>
          </div>
        </div>
      </div>
      
      {/* Right side status indicator */}
      <div className="hidden md:flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
          {mode === 'creator' ? `Ranking Top ${boardSize}` : 'Reviewing Board'}
        </span>
      </div>
    </div>
  );

  // --- 1. START SCREEN ---
  if (mode === 'start') {
    return (
      <div className="min-h-screen bg-slate-50">
        <UnifiedHeader />
        <div className="pt-20">
          <BoardStart 
            onSelect={(size: number) => { 
              setBoardSize(size); 
              setMode('creator'); 
            }} 
          />
        </div>
      </div>
    );
  }

  // --- 2. RESULTS SCREEN ---
  if (mode === 'results') {
    return (
      <div className="min-h-screen bg-slate-50">
        <UnifiedHeader />
        <div className="pt-20">
          <BoardResults 
            rankedPlayers={rankedPlayers} 
            boardSize={boardSize} 
            boardName={boardName} 
            onBack={() => setMode('creator')} 
          />
        </div>
      </div>
    );
  }

  // --- 3. CREATOR SCREEN ---
  return (
    <div className="min-h-screen bg-white">
      <UnifiedHeader />
      <div className="pt-20">
        <BoardCreator 
          players={players}
          rankedPlayers={rankedPlayers}
          setRankedPlayers={(val: Player[]) => setRankedPlayers(val)}
          boardSize={boardSize}
          // We pass boardName but NO setBoardName function to keep it non-editable
          boardName={boardName} 
          onComplete={() => setMode('results')}
          onReset={() => setMode('start')}
        />
      </div>
    </div>
  );
}