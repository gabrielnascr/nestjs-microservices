export interface RankingResponse {
  player?: string;
  position?: number;
  score?: number;
  matchHistory?: History;
}

export interface History {
  victories?: number; // wins sla
  defeats?: number;
}
