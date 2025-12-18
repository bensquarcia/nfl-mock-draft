export type Player = {
  id: number;
  name: string;
  college: string;
  position: string;
  college_logo_url?: string;
  headshot_url?: string;
  ht?: string;
  wt?: string;
  cls?: string;
};

export type DraftSlot = {
  id: number;
  pick_number: number;
  slot_number: number;
  team_name: string;
  team_abbr: string;
  team_logo_url?: string;
  original_team_name: string;
  current_team_name: string;
  round: number;
  needs: string[];
  selection?: Player; // Add this to store the result
};