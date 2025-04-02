// Define the structure for a single game history record based on the API response
export interface GameHistoryRecord {
  game_name: string;
  game_type: string; // 'bet' or 'win' (or others?)
  game_provider: string;
  amount: number; // Bet amount for 'bet' type, Win amount for 'win' type
  win_loss_status: "win" | "loss" | string; // Original status from API (might be less useful now)
  bet_id: string;
  bet_time: string; // Keep as string for now, format later if needed
  currency: string;
  bet_type: string; // Could be 'bet', 'win', 'freespin', etc. - Seems redundant with game_type?
  freespin_id: string | null;
  quantity: number | null;
}

// Define the structure for the 'data' part of the API response
export interface GameHistoryInfo {
  total_lossAmount: number;
  total_winAmount: number;
  total_netAmount: number;
  data: GameHistoryRecord[];
  current_page: number;
  from: number;
  to: number;
  last_page: number;
  next_page_url: string;
  per_page: number;
  prev_page_url: null | string;
  total: number;
}

// Define the structure for a processed/combined game history entry
export interface ProcessedGameHistoryRecord {
  game_name: string;
  game_provider: string;
  bet_id: string;
  bet_time: string;
  currency: string;
  bet_amount: number;
  win_amount: number;
  net_amount: number;
  final_status: "win" | "loss" | "push"; // Calculated status
  bet_type: string; // Keep original bet_type if needed
  freespin_id: string | null; // Keep original freespin_id if needed
}
