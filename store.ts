import { create } from 'zustand';
import { GamePhase, GameState } from './types';

export enum BiomeType {
  URBAN = 'URBAN',
  ANCIENT = 'ANCIENT',
  DESERT = 'DESERT',
  SNOW = 'SNOW',
  JUNGLE = 'JUNGLE',
  ALIEN = 'ALIEN'
}

// Level Data Configuration
export interface LevelData {
  id: number;
  name: string;
  country: string;
  biome: BiomeType;
  skyColor: string;
  horizonColor: string;
  groundColor: string;
  fogColor: string;
  structureColor: string;
  sunPosition: [number, number, number];
  ringComplexity: number; 
  density: number;
}

export const LEVELS: LevelData[] = [
  { id: 1, name: "Roma", country: "Italia", biome: BiomeType.ANCIENT, skyColor: "#7dd3fc", horizonColor: "#fcd34d", groundColor: "#57534e", structureColor: "#d6d3d1", fogColor: "#bfdbfe", sunPosition: [100, 50, 100], ringComplexity: 1, density: 800 },
  { id: 2, name: "Tokyo", country: "Giappone", biome: BiomeType.URBAN, skyColor: "#1e1b4b", horizonColor: "#db2777", groundColor: "#0f172a", structureColor: "#38bdf8", fogColor: "#312e81", sunPosition: [-100, 20, -50], ringComplexity: 2, density: 2000 },
  { id: 3, name: "Il Cairo", country: "Egitto", biome: BiomeType.DESERT, skyColor: "#fef08a", horizonColor: "#f97316", groundColor: "#d97706", structureColor: "#fcd34d", fogColor: "#fed7aa", sunPosition: [0, 80, 0], ringComplexity: 1, density: 400 },
  { id: 4, name: "Londra", country: "Regno Unito", biome: BiomeType.URBAN, skyColor: "#94a3b8", horizonColor: "#cbd5e1", groundColor: "#3f6212", structureColor: "#475569", fogColor: "#64748b", sunPosition: [50, 30, 50], ringComplexity: 1, density: 1500 },
  { id: 5, name: "New York", country: "USA", biome: BiomeType.URBAN, skyColor: "#0ea5e9", horizonColor: "#fdba74", groundColor: "#374151", structureColor: "#94a3b8", fogColor: "#bae6fd", sunPosition: [-200, 40, 100], ringComplexity: 2, density: 2500 },
  { id: 6, name: "Reykjavik", country: "Islanda", biome: BiomeType.SNOW, skyColor: "#e0f2fe", horizonColor: "#ffffff", groundColor: "#f8fafc", structureColor: "#a5f3fc", fogColor: "#e0f2fe", sunPosition: [0, 10, 200], ringComplexity: 1, density: 1000 },
  { id: 7, name: "Rio de Janeiro", country: "Brasile", biome: BiomeType.JUNGLE, skyColor: "#0284c7", horizonColor: "#4ade80", groundColor: "#166534", structureColor: "#15803d", fogColor: "#7dd3fc", sunPosition: [100, 90, 50], ringComplexity: 2, density: 1800 },
  { id: 8, name: "Mosca", country: "Russia", biome: BiomeType.URBAN, skyColor: "#f1f5f9", horizonColor: "#94a3b8", groundColor: "#e2e8f0", structureColor: "#64748b", fogColor: "#cbd5e1", sunPosition: [50, 20, 50], ringComplexity: 2, density: 1500 },
  { id: 9, name: "Sydney", country: "Australia", biome: BiomeType.URBAN, skyColor: "#0c4a6e", horizonColor: "#facc15", groundColor: "#065f46", structureColor: "#e2e8f0", fogColor: "#38bdf8", sunPosition: [200, 60, 0], ringComplexity: 2, density: 1200 },
  { id: 10, name: "Pechino", country: "Cina", biome: BiomeType.URBAN, skyColor: "#d6d3d1", horizonColor: "#ef4444", groundColor: "#44403c", structureColor: "#78350f", fogColor: "#a8a29e", sunPosition: [0, 40, -100], ringComplexity: 3, density: 2000 },
  { id: 11, name: "Parigi", country: "Francia", biome: BiomeType.URBAN, skyColor: "#60a5fa", horizonColor: "#fbbf24", groundColor: "#4d7c0f", structureColor: "#e2e8f0", fogColor: "#93c5fd", sunPosition: [80, 40, 80], ringComplexity: 2, density: 1600 },
  { id: 12, name: "Dubai", country: "EAU", biome: BiomeType.DESERT, skyColor: "#38bdf8", horizonColor: "#fde047", groundColor: "#d97706", structureColor: "#fef08a", fogColor: "#fcd34d", sunPosition: [0, 100, 0], ringComplexity: 3, density: 600 },
  { id: 13, name: "Berlino", country: "Germania", biome: BiomeType.URBAN, skyColor: "#475569", horizonColor: "#94a3b8", groundColor: "#1e293b", structureColor: "#334155", fogColor: "#64748b", sunPosition: [40, 40, 40], ringComplexity: 2, density: 1400 },
  { id: 14, name: "Città del Capo", country: "Sudafrica", biome: BiomeType.JUNGLE, skyColor: "#0284c7", horizonColor: "#ec4899", groundColor: "#15803d", structureColor: "#86efac", fogColor: "#a5f3fc", sunPosition: [-100, 50, -100], ringComplexity: 2, density: 1200 },
  { id: 15, name: "Atene", country: "Grecia", biome: BiomeType.ANCIENT, skyColor: "#38bdf8", horizonColor: "#bae6fd", groundColor: "#a3a3a3", structureColor: "#f5f5f5", fogColor: "#e0f2fe", sunPosition: [100, 80, 100], ringComplexity: 2, density: 900 },
  { id: 16, name: "Bangkok", country: "Thailandia", biome: BiomeType.JUNGLE, skyColor: "#10b981", horizonColor: "#facc15", groundColor: "#064e3b", structureColor: "#d4d4d8", fogColor: "#6ee7b7", sunPosition: [50, 70, 50], ringComplexity: 3, density: 1800 },
  { id: 17, name: "Toronto", country: "Canada", biome: BiomeType.URBAN, skyColor: "#0f172a", horizonColor: "#3b82f6", groundColor: "#f1f5f9", structureColor: "#64748b", fogColor: "#1e293b", sunPosition: [-50, 20, 100], ringComplexity: 2, density: 1700 },
  { id: 18, name: "Città del Messico", country: "Messico", biome: BiomeType.URBAN, skyColor: "#fdba74", horizonColor: "#ef4444", groundColor: "#78350f", structureColor: "#d6d3d1", fogColor: "#fed7aa", sunPosition: [0, 60, 0], ringComplexity: 2, density: 2200 },
  { id: 19, name: "Mumbai", country: "India", biome: BiomeType.URBAN, skyColor: "#f97316", horizonColor: "#db2777", groundColor: "#854d0e", structureColor: "#fbbf24", fogColor: "#fdba74", sunPosition: [100, 50, -50], ringComplexity: 3, density: 2500 },
  { id: 20, name: "Buenos Aires", country: "Argentina", biome: BiomeType.URBAN, skyColor: "#67e8f9", horizonColor: "#fef9c3", groundColor: "#3f6212", structureColor: "#e2e8f0", fogColor: "#cffafe", sunPosition: [-100, 80, 0], ringComplexity: 2, density: 1500 },
  { id: 21, name: "Seul", country: "Corea del Sud", biome: BiomeType.URBAN, skyColor: "#312e81", horizonColor: "#818cf8", groundColor: "#111827", structureColor: "#a5f3fc", fogColor: "#4338ca", sunPosition: [0, 30, 0], ringComplexity: 3, density: 2000 },
  { id: 22, name: "Madrid", country: "Spagna", biome: BiomeType.ANCIENT, skyColor: "#ea580c", horizonColor: "#fde047", groundColor: "#a16207", structureColor: "#fdba74", fogColor: "#fed7aa", sunPosition: [100, 50, 100], ringComplexity: 2, density: 1100 },
  { id: 23, name: "Singapore", country: "Singapore", biome: BiomeType.JUNGLE, skyColor: "#059669", horizonColor: "#34d399", groundColor: "#022c22", structureColor: "#f0fdf4", fogColor: "#6ee7b7", sunPosition: [0, 90, 0], ringComplexity: 3, density: 1600 },
  { id: 24, name: "Stoccolma", country: "Svezia", biome: BiomeType.SNOW, skyColor: "#1e3a8a", horizonColor: "#93c5fd", groundColor: "#1e293b", structureColor: "#cbd5e1", fogColor: "#60a5fa", sunPosition: [50, 20, 50], ringComplexity: 2, density: 1000 },
  { id: 25, name: "Lima", country: "Perù", biome: BiomeType.DESERT, skyColor: "#9ca3af", horizonColor: "#d1d5db", groundColor: "#374151", structureColor: "#9ca3af", fogColor: "#e5e7eb", sunPosition: [-50, 40, -50], ringComplexity: 2, density: 800 },
  { id: 26, name: "Istanbul", country: "Turchia", biome: BiomeType.ANCIENT, skyColor: "#7c2d12", horizonColor: "#fb923c", groundColor: "#78350f", structureColor: "#fdba74", fogColor: "#fdba74", sunPosition: [100, 30, 100], ringComplexity: 3, density: 1300 },
  { id: 27, name: "Nairobi", country: "Kenya", biome: BiomeType.JUNGLE, skyColor: "#84cc16", horizonColor: "#facc15", groundColor: "#365314", structureColor: "#d9f99d", fogColor: "#d9f99d", sunPosition: [0, 80, 0], ringComplexity: 2, density: 1000 },
  { id: 28, name: "L'Avana", country: "Cuba", biome: BiomeType.ANCIENT, skyColor: "#06b6d4", horizonColor: "#f472b6", groundColor: "#064e3b", structureColor: "#fce7f3", fogColor: "#67e8f9", sunPosition: [-100, 60, 50], ringComplexity: 2, density: 900 },
  { id: 29, name: "Antartide", country: "Base", biome: BiomeType.SNOW, skyColor: "#f8fafc", horizonColor: "#e2e8f0", groundColor: "#ffffff", structureColor: "#0ea5e9", fogColor: "#f1f5f9", sunPosition: [0, 20, 100], ringComplexity: 3, density: 500 },
  { id: 30, name: "Marte", country: "Colonia", biome: BiomeType.ALIEN, skyColor: "#450a0a", horizonColor: "#ef4444", groundColor: "#7f1d1d", structureColor: "#1e293b", fogColor: "#f87171", sunPosition: [100, 50, -100], ringComplexity: 3, density: 400 },
];

export interface Enemy {
  id: number;
  position: [number, number, number];
  alive: boolean;
}

interface ExtendedGameState extends GameState {
  currentLevelIndex: number;
  ringsCollected: number;
  lastRingTime: number; 
  isScanning: boolean;
  
  // FPS State
  health: number;
  ammo: number;
  enemiesDefeated: number;
  isSliding: boolean;
  enemies: Enemy[];
  
  incrementRings: () => void;
  triggerScan: () => void;
  nextLevel: () => void;
  
  // FPS Actions
  initEnemies: () => void;
  killEnemy: (id: number) => void;
  fireWeapon: () => void;
  reloadWeapon: () => void;
  setSliding: (sliding: boolean) => void;
}

export const useGameStore = create<ExtendedGameState>((set, get) => ({
  phase: GamePhase.MENU,
  altitude: 3000,
  speed: 0,
  distanceToTarget: 0,
  score: 0,
  ringsCollected: 0,
  lastRingTime: 0,
  isScanning: false,
  currentLevelIndex: 0,
  
  // FPS State Defaults
  health: 100,
  ammo: 30,
  enemiesDefeated: 0,
  isSliding: false,
  enemies: [],
  
  setPhase: (phase) => {
    if (phase === GamePhase.GROUND_COMBAT) {
        get().initEnemies();
    }
    set({ phase });
  },
  setAltitude: (altitude) => set({ altitude }),
  setSpeed: (speed) => set({ speed }),
  setDistance: (distanceToTarget) => set({ distanceToTarget }),
  setScore: (score) => set({ score }),
  incrementRings: () => set((state) => ({ 
    ringsCollected: state.ringsCollected + 1,
    score: state.score + 500,
    lastRingTime: Date.now()
  })),
  triggerScan: () => {
    set({ isScanning: true });
    setTimeout(() => set({ isScanning: false }), 2000);
  },
  reset: () => set((state) => ({ 
    phase: GamePhase.MENU, 
    altitude: 3000, 
    speed: 0, 
    distanceToTarget: 0, 
    score: 0, 
    ringsCollected: 0,
    lastRingTime: 0,
    isScanning: false,
    health: 100,
    ammo: 30,
    enemiesDefeated: 0,
    enemies: []
  })),
  nextLevel: () => set((state) => ({
    phase: GamePhase.MENU,
    currentLevelIndex: (state.currentLevelIndex + 1) % LEVELS.length,
    altitude: 3000,
    speed: 0,
    distanceToTarget: 0,
    ringsCollected: 0,
    lastRingTime: 0,
    isScanning: false,
    health: 100,
    ammo: 30,
    enemiesDefeated: 0,
    enemies: []
  })),
  
  // FPS Actions
  initEnemies: () => {
    const newEnemies: Enemy[] = new Array(12).fill(0).map((_, i) => ({
        id: i,
        position: [
            (Math.random() - 0.5) * 400,
            5 + Math.random() * 15,
            (Math.random() - 0.5) * 400
        ],
        alive: true
    }));
    set({ enemies: newEnemies });
  },
  killEnemy: (id) => set((state) => ({
    enemies: state.enemies.map(e => e.id === id ? { ...e, alive: false } : e),
    enemiesDefeated: state.enemiesDefeated + 1,
    score: state.score + 500
  })),
  fireWeapon: () => set((state) => {
    if (state.ammo > 0) return { ammo: state.ammo - 1 };
    return {};
  }),
  reloadWeapon: () => set({ ammo: 30 }),
  setSliding: (sliding) => set({ isSliding: sliding })
}));