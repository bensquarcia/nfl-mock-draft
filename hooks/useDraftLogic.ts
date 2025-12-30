// src/hooks/useDraftLogic.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Player, DraftSlot } from '@/types/draft';

type GameState = "START" | "DRAFT" | "RESULTS";

export function useDraftLogic() {
  const [gameState, setGameState] = useState<GameState>("START");
  const [loading, setLoading] = useState(true);
  const [maxRounds, setMaxRounds] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [originalPlayers, setOriginalPlayers] = useState<Player[]>([]); 
  const [draftOrder, setDraftOrder] = useState<DraftSlot[]>([]);
  const [originalOrder, setOriginalOrder] = useState<DraftSlot[]>([]); 
  const [draftedPlayers, setDraftedPlayers] = useState<Player[]>([]);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [userTeam, setUserTeam] = useState("NY Giants");
  const [selectedPosition, setSelectedPosition] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState(""); // NEW: Search state
  const [history, setHistory] = useState<{drafted: Player[], pool: Player[]}[]>([]);

  // --- Player Info Navigation Logic ---
  const [selectedPlayerForInfo, setSelectedPlayerForInfo] = useState<Player | null>(null);

  const openPlayerInfo = (player: Player) => {
    setSelectedPlayerForInfo(player);
    window.history.pushState({ infoOpen: true }, "");
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (selectedPlayerForInfo) setSelectedPlayerForInfo(null);
      if (isTradeModalOpen) setIsTradeModalOpen(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedPlayerForInfo, isTradeModalOpen]);

  const generateFuturePicks = (order: DraftSlot[]) => {
    const years = [2026, 2027];
    const futurePicks: DraftSlot[] = [];
    const uniqueTeams = Array.from(new Set(order.map(p => p.current_team_name)));
    years.forEach(year => {
      for (let round = 1; round <= 7; round++) {
        uniqueTeams.forEach((team, idx) => {
          futurePicks.push({
            id: Math.random() * 1000000,
            slot_number: 1000 + (year * 100) + (round * 40) + idx,
            pick_number: idx + 1,
            round: round,
            year: year,
            current_team_name: team,
            team_name: team,
            team_abbr: team.substring(0, 3).toUpperCase(),
            team_logo_url: order.find(p => p.current_team_name === team)?.team_logo_url || "",
            original_team_name: team,
            needs: order.find(p => p.current_team_name === team)?.needs || []
          } as DraftSlot);
        });
      }
    });
    return futurePicks;
  };

  useEffect(() => {
    async function fetchData() {
      const { data: pData } = await supabase.from('players').select('*').eq('status', 'active').order('rank', { ascending: true });
      const { data: dData } = await supabase.from('draft_order').select('*').order('slot_number');
      
      const savedDrafted = localStorage.getItem('drafted_players');
      const savedGameState = localStorage.getItem('game_state');
      const savedMaxRounds = localStorage.getItem('max_rounds');
      const savedOrder = localStorage.getItem('draft_order');

      let initialOrder = dData || [];
      const futureAssets = generateFuturePicks(initialOrder);
      const fullOrder = [...initialOrder, ...futureAssets];

      if (pData) {
        setOriginalPlayers(pData);
        if (savedDrafted) {
          const draftedIds = JSON.parse(savedDrafted).map((p: Player) => p.id);
          setPlayers(pData.filter(p => !draftedIds.includes(p.id)));
        } else {
          setPlayers(pData);
        }
      }

      setOriginalOrder(fullOrder);
      if (savedOrder) {
        setDraftOrder(JSON.parse(savedOrder));
      } else {
        setDraftOrder(fullOrder);
      }

      if (savedDrafted) setDraftedPlayers(JSON.parse(savedDrafted));
      if (savedGameState) setGameState(savedGameState as GameState);
      if (savedMaxRounds) setMaxRounds(Number(savedMaxRounds));
      setLoading(false); 
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (gameState !== "START") {
      localStorage.setItem('drafted_players', JSON.stringify(draftedPlayers));
      localStorage.setItem('game_state', gameState);
      localStorage.setItem('max_rounds', String(maxRounds));
      localStorage.setItem('draft_order', JSON.stringify(draftOrder));
    }
  }, [draftedPlayers, gameState, maxRounds, draftOrder]);

  const startDraft = (rounds: number) => { 
    setMaxRounds(rounds); 
    setGameState("DRAFT"); 
  };

  const resetDraft = () => {
    localStorage.removeItem('drafted_players');
    localStorage.removeItem('game_state');
    localStorage.removeItem('max_rounds');
    localStorage.removeItem('draft_order');

    setGameState("START");
    setDraftedPlayers([]);
    setPlayers(originalPlayers);
    setDraftOrder(originalOrder);
    setHistory([]);
    setSelectedPosition("ALL");
    setSearchQuery(""); // Clear search on reset
  };

  // --- NEW: FILTERED PLAYERS LOGIC ---
  const filteredPlayers = players.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPos = selectedPosition === "ALL" || p.position === selectedPosition;
    return matchesSearch && matchesPos;
  });

  const handleDraftPlayer = (player: Player) => {
    const totalPicks = draftOrder.filter(p => p.round <= maxRounds && (!p.year || p.year === 2025)).length;
    if (draftedPlayers.length < totalPicks) {
      const nextDrafted = [...draftedPlayers, player];
      setHistory([...history, { drafted: draftedPlayers, pool: players }]);
      setDraftedPlayers(nextDrafted);
      setPlayers(players.filter(p => p.id !== player.id));
      if (nextDrafted.length === totalPicks) { 
        setTimeout(() => setGameState("RESULTS"), 800); 
      }
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setDraftedPlayers(lastState.drafted);
      setPlayers(lastState.pool);
      setHistory(history.slice(0, -1));
    }
  };

  const handleConfirmTrade = (userPicks: DraftSlot[], cpuPicks: DraftSlot[], cpuTeam: string) => {
    const activeTeamName = draftOrder.filter(p => !p.year || p.year === 2025)[draftedPlayers.length]?.current_team_name;
    const userTeamNeeds = draftOrder.find(p => p.current_team_name === activeTeamName)?.needs || [];
    const cpuTeamNeeds = draftOrder.find(p => p.current_team_name === cpuTeam)?.needs || [];

    const updatedOrder = draftOrder.map(pick => {
      const isUserGivingThisAway = userPicks.some(p => p.slot_number === pick.slot_number);
      const isCpuGivingThisAway = cpuPicks.some(p => p.slot_number === pick.slot_number);
      if (isUserGivingThisAway) return { ...pick, current_team_name: cpuTeam, needs: cpuTeamNeeds };
      if (isCpuGivingThisAway) return { ...pick, current_team_name: activeTeamName, needs: userTeamNeeds };
      return pick;
    });

    setDraftOrder(updatedOrder);
    setIsTradeModalOpen(false);
  };

  return {
    gameState, loading, maxRounds, 
    players: filteredPlayers, // Return filtered list instead of raw pool
    draftOrder, draftedPlayers,
    isTradeModalOpen, setIsTradeModalOpen, userTeam, selectedPosition,
    setSelectedPosition, searchQuery, setSearchQuery, // Export search states
    startDraft, resetDraft, handleDraftPlayer,
    handleUndo, handleConfirmTrade,
    selectedPlayerForInfo, openPlayerInfo 
  };
}