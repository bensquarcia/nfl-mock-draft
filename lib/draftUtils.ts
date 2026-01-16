// src/lib/draftUtils.ts
import { Player, DraftSlot } from '@/types/draft';

export const getBestAutodraftPick = (availablePlayers: Player[], currentPick: DraftSlot): Player => {
  // --- 1. THE "CONSENSUS #1" GUARD CLAUSE ---
  // If it's the 1st pick of the 1st round in 2026, force Mendoza
  if (currentPick.pick_number === 1 && currentPick.round === 1 && (!currentPick.year || currentPick.year === 2026)) {
    const mendoza = availablePlayers.find(p => p.name.includes("Fernando Mendoza"));
    if (mendoza) return mendoza;
  }

  // --- 2. EXISTING WEIGHTED LOGIC FOR ALL OTHER PICKS ---
  const teamNeeds = currentPick.needs || [];
  const candidates = availablePlayers.slice(0, 10);
  
  const weightedCandidates = candidates.map((player, index) => {
    let weight = 100 - (index * 10);

    // NEED BOOST: Ensure QBs beat out non-QBs for teams needing them
    if (teamNeeds.includes(player.position)) {
      weight *= 3; 
    }

    if (index < 3) weight += 20;

    return { player, weight };
  });

  const totalWeight = weightedCandidates.reduce((sum, c) => sum + c.weight, 0);
  let randomValue = Math.random() * totalWeight;

  for (const candidate of weightedCandidates) {
    randomValue -= candidate.weight;
    if (randomValue <= 0) {
      return candidate.player;
    }
  }

  return availablePlayers[0]; 
};