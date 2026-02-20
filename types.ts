export enum GamePhase {
  MENU = 'MENU',
  FREEFALL = 'FREEFALL',
  PARACHUTE = 'PARACHUTE',
  GROUND_COMBAT = 'GROUND_COMBAT',
  LANDED = 'LANDED',
  CRASHED = 'CRASHED'
}

export interface GameState {
  phase: GamePhase;
  altitude: number;
  speed: number;
  distanceToTarget: number;
  score: number;
  setPhase: (phase: GamePhase) => void;
  setAltitude: (alt: number) => void;
  setSpeed: (speed: number) => void;
  setDistance: (dist: number) => void;
  setScore: (score: number) => void;
  reset: () => void;
}
