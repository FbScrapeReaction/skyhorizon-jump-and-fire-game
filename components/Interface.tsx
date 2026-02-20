import React from 'react';
import { useGameStore, LEVELS } from '../store';
import { GamePhase } from '../types';
import { Wind, MapPin, Play, RotateCcw, Target, Scan, CircleDot, ArrowRight, Globe, Zap, Crosshair } from 'lucide-react';

export const Interface: React.FC = () => {
  const { phase, altitude, speed, distanceToTarget, score, setPhase, reset, ringsCollected, triggerScan, isScanning, currentLevelIndex, nextLevel, ammo, health, enemiesDefeated } = useGameStore();

  const currentLevel = LEVELS[currentLevelIndex];

  if (phase === GamePhase.MENU) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white font-tech select-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] pointer-events-none" />
        
        {/* Holographic Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-500/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-dashed border-cyan-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
        </div>

        <h1 className="text-5xl md:text-9xl font-bold mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500 drop-shadow-[0_0_35px_rgba(6,182,212,0.8)] text-center relative z-10">
          HORIZON
          <span className="block text-2xl md:text-4xl tracking-[0.8em] text-cyan-400 font-light mt-0 uppercase opacity-80">Apex Protocol</span>
        </h1>
        
        <div className="mt-8 mb-12 text-center relative z-10 p-8 border-y border-cyan-900/50 bg-black/20 backdrop-blur-md w-full max-w-3xl">
            <div className="flex items-center justify-center gap-2 mb-2 text-cyan-400/80 tracking-widest text-xs uppercase font-hud">
                <Globe size={14} className="animate-pulse" /> Target Designation
            </div>
            <h2 className="text-6xl md:text-7xl font-bold text-white uppercase tracking-tighter mb-2">{currentLevel.name}</h2>
            <div className="flex items-center justify-center gap-4">
                <span className="h-px w-12 bg-cyan-500/50"></span>
                <div className="text-cyan-300 text-xl uppercase tracking-[0.2em] font-light">{currentLevel.country}</div>
                <span className="h-px w-12 bg-cyan-500/50"></span>
            </div>
            
            <div className="mt-6 flex justify-center gap-8 text-xs font-hud text-cyan-500/60 uppercase">
                <div><span className="block text-white text-lg">{currentLevel.biome}</span>Terrain Class</div>
                <div><span className="block text-white text-lg">{currentLevel.density > 1500 ? 'HIGH' : 'MED'}</span>Density</div>
                <div><span className="block text-white text-lg">{currentLevel.ringComplexity}</span>Diff. Rating</div>
            </div>
        </div>
        
        <button 
          onClick={() => setPhase(GamePhase.FREEFALL)}
          className="relative z-10 group px-20 py-6 bg-cyan-950/40 border-2 border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-900/60 transition-all duration-300 overflow-hidden skew-x-[-10deg]"
        >
          <div className="absolute inset-0 bg-cyan-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative z-10 flex items-center gap-3 text-3xl font-bold tracking-widest text-cyan-100 group-hover:text-white uppercase skew-x-[10deg]">
            <Play size={28} className="fill-current" /> INITIATE DROP
          </span>
        </button>
      </div>
    );
  }

  if (phase === GamePhase.LANDED || phase === GamePhase.CRASHED) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl text-white font-tech select-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none" />
        
        <h2 className={`text-6xl md:text-9xl font-bold mb-8 ${phase === GamePhase.LANDED ? 'text-transparent bg-clip-text bg-gradient-to-b from-green-300 to-green-600' : 'text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-700'} tracking-tighter drop-shadow-2xl uppercase`}>
          {phase === GamePhase.LANDED ? 'Mission Clear' : 'Signal Lost'}
        </h2>
        
        <div className="grid grid-cols-2 gap-px bg-gray-800 border border-gray-700 w-full max-w-md">
            <div className="bg-gray-900/90 p-6 flex flex-col items-center justify-center">
                 <span className="text-gray-500 font-hud text-xs uppercase tracking-widest mb-1">Total Score</span>
                 <span className="text-4xl font-mono text-white">{score}</span>
            </div>
            <div className="bg-gray-900/90 p-6 flex flex-col items-center justify-center">
                 <span className="text-gray-500 font-hud text-xs uppercase tracking-widest mb-1">Targets</span>
                 <span className="text-4xl font-mono text-cyan-400">{enemiesDefeated}</span>
            </div>
             <div className="bg-gray-900/90 p-6 flex flex-col items-center justify-center col-span-2">
                 <span className="text-gray-500 font-hud text-xs uppercase tracking-widest mb-1">Landing Precision</span>
                 <span className={`text-5xl font-mono ${distanceToTarget < 50 ? 'text-green-400' : 'text-yellow-400'}`}>{distanceToTarget}m</span>
            </div>
        </div>

        <div className="flex gap-6 mt-12">
            <button 
            onClick={reset}
            className="flex items-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
            >
            <RotateCcw size={20} /> Re-Simulate
            </button>

            {phase === GamePhase.LANDED && (
                <button 
                onClick={nextLevel}
                className="flex items-center gap-2 px-10 py-4 bg-cyan-600 text-white font-bold uppercase tracking-wider hover:bg-cyan-500 transition-all shadow-[0_0_30px_rgba(8,145,178,0.6)] hover:shadow-[0_0_50px_rgba(8,145,178,0.8)]"
                >
                <ArrowRight size={24} /> {currentLevelIndex === 29 ? 'Finalize' : 'Next Sector'}
                </button>
            )}
        </div>
      </div>
    );
  }

  // GROUND COMBAT HUD
  if (phase === GamePhase.GROUND_COMBAT) {
    return (
        <div className="absolute inset-0 pointer-events-none font-hud select-none">
            {/* Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-75">
                <div className="relative">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_cyan]"></div>
                    {/* Dynamic spread lines */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-0.5 h-3 bg-white/50"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 w-0.5 h-3 bg-white/50"></div>
                    <div className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 w-3 h-0.5 bg-white/50"></div>
                    <div className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 w-3 h-0.5 bg-white/50"></div>
                </div>
            </div>

            {/* Bottom Left: Health */}
            <div className="absolute bottom-8 left-8 flex items-end gap-4">
                <div className="bg-black/60 backdrop-blur-md p-4 rounded-lg border-l-4 border-white skew-x-[-10deg]">
                    <div className="flex items-center gap-2 text-white/70 text-xs uppercase mb-1 skew-x-[10deg]">
                        <Zap size={14} /> Shield Integrity
                    </div>
                    <div className="w-64 h-4 bg-gray-800 rounded-full skew-x-[10deg] overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 w-[100%]"></div>
                    </div>
                    <div className="w-64 h-2 bg-gray-800 rounded-full mt-1 skew-x-[10deg] overflow-hidden">
                        <div className="h-full bg-white w-[100%]"></div>
                    </div>
                </div>
            </div>

            {/* Bottom Right: Ammo & Weapon */}
            <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2">
                 <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-lg border-r-4 border-orange-500 skew-x-[-10deg] flex items-center gap-6">
                     <div className="text-right skew-x-[10deg]">
                         <div className="text-xs text-orange-400 uppercase tracking-wider">Havoc-X</div>
                         <div className="text-gray-400 text-[10px] uppercase">Energy Rifle</div>
                     </div>
                     <div className="text-5xl font-mono font-bold text-white skew-x-[10deg] tabular-nums">
                         {ammo}<span className="text-2xl text-gray-500">/∞</span>
                     </div>
                 </div>
                 {/* Kill Feed */}
                 <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded text-xs text-cyan-400">
                     <Target size={14} /> Targets Eliminated: {enemiesDefeated}
                 </div>
            </div>

            {/* Top Center: Compass/Objective */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur px-4 py-1 rounded-full border border-white/10 flex items-center gap-4">
                <span className="font-bold text-xl">{currentLevel.name.toUpperCase()}</span>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center gap-2 text-red-400 animate-pulse">
                    <Crosshair size={16} /> HOSTILES DETECTED
                </div>
            </div>
            
            {/* Sliding Indicator */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 transition-opacity duration-200" style={{ opacity: useGameStore.getState().isSliding ? 1 : 0 }}>
                 <div className="text-cyan-400 font-bold tracking-[0.3em] uppercase text-sm bg-black/50 px-4 py-1 rounded-full">Sliding</div>
            </div>
        </div>
    );
  }

  // SKYDIVING HUD (Standard)
  return (
    <div className="absolute inset-0 pointer-events-none z-10 font-hud text-white overflow-hidden">
      
      {/* Scan Overlay Effect */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${isScanning ? 'opacity-100 bg-cyan-500/10 mix-blend-screen' : 'opacity-0'}`}>
         <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(6,182,212,0.2)_50%,_transparent_100%)] bg-[length:100%_4px]" />
      </div>

      {/* Dynamic Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80">
        <div className={`w-16 h-16 border-2 border-white/40 rounded-full flex items-center justify-center transition-all duration-300 ${phase === GamePhase.FREEFALL ? 'scale-100 rotate-0' : 'scale-125 border-dashed rotate-45'}`}>
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_10px_red]" />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-[10px] font-bold">N</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 text-[10px] font-bold">S</div>
      </div>

      {/* HUD Borders */}
      <div className="absolute top-4 left-4 w-32 h-32 border-l-2 border-t-2 border-white/20 rounded-tl-3xl"></div>
      <div className="absolute top-4 right-4 w-32 h-32 border-r-2 border-t-2 border-white/20 rounded-tr-3xl"></div>
      <div className="absolute bottom-4 left-4 w-32 h-32 border-l-2 border-b-2 border-white/20 rounded-bl-3xl"></div>
      <div className="absolute bottom-4 right-4 w-32 h-32 border-r-2 border-b-2 border-white/20 rounded-br-3xl"></div>

      {/* Top Info Bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-12 bg-black/40 backdrop-blur-md px-8 py-2 rounded-full border border-white/10">
            <div className="flex flex-col items-center">
                <span className="text-[10px] text-cyan-500 uppercase tracking-widest">SECTOR</span>
                <span className="font-bold text-lg">{currentLevel.name.substring(0, 3).toUpperCase()}</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="flex flex-col items-center">
                 <span className="text-[10px] text-cyan-500 uppercase tracking-widest">ARTIFACTS</span>
                 <div className="flex gap-1 mt-1">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-sm ${i < ringsCollected ? 'bg-cyan-400 shadow-[0_0_5px_cyan]' : 'bg-gray-700'}`} />
                    ))}
                 </div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="flex flex-col items-center">
                 <span className="text-[10px] text-red-500 uppercase tracking-widest">TARGET</span>
                 <span className="font-mono text-lg font-bold">{distanceToTarget}m</span>
            </div>
      </div>

      {/* Left Vertical Altimeter */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-6">
        <div className="h-96 w-1.5 bg-gray-900/50 relative rounded-full overflow-hidden border border-gray-700">
            <div className="absolute inset-0 flex flex-col justify-between py-2 opacity-50">
                {[...Array(10)].map((_, i) => <div key={i} className="w-full h-px bg-white/30" />)}
            </div>
            <div 
                className={`absolute bottom-0 left-0 w-full transition-all duration-100 ${altitude < 600 ? 'bg-gradient-to-t from-red-600 to-red-400' : 'bg-gradient-to-t from-cyan-600 to-cyan-400'}`}
                style={{ height: `${Math.min(100, (altitude / 3000) * 100)}%` }}
            />
        </div>
        <div className="flex flex-col gap-0 shadow-black drop-shadow-lg">
            <span className="text-6xl font-bold font-mono tracking-tighter tabular-nums leading-none">{altitude}</span>
            <span className="text-xs text-cyan-500/80 uppercase tracking-[0.3em]">Altitude</span>
        </div>
      </div>

      {/* Right Vertical Speedometer */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-6 flex-row-reverse text-right">
        <div className="h-96 w-1.5 bg-gray-900/50 relative rounded-full overflow-hidden border border-gray-700">
            <div 
                className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-orange-600 to-yellow-400 transition-all duration-100"
                style={{ height: `${Math.min(100, (speed / 120) * 100)}%` }}
            />
        </div>
        <div className="flex flex-col gap-0 shadow-black drop-shadow-lg">
            <span className="text-6xl font-bold font-mono tracking-tighter tabular-nums leading-none text-yellow-400">{speed}</span>
            <span className="text-xs text-yellow-600/80 uppercase tracking-[0.3em]">KPH</span>
        </div>
      </div>

      {/* Action Prompts */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-6">
        {phase === GamePhase.FREEFALL && (
            <button
                onClick={triggerScan}
                className={`w-16 h-16 rounded-full border-2 border-cyan-500 bg-cyan-950/60 text-cyan-300 flex items-center justify-center hover:bg-cyan-500/20 active:scale-95 transition-all group ${isScanning ? 'shadow-[0_0_30px_cyan]' : ''}`}
            >
                <Scan size={28} className={isScanning ? "animate-spin" : "group-hover:scale-110 transition-transform"} />
            </button>
        )}
        
        {phase === GamePhase.FREEFALL && altitude < 1500 && (
            <button
              onClick={() => setPhase(GamePhase.PARACHUTE)}
              className={`
                relative overflow-hidden
                flex items-center justify-center w-72 h-16 
                border-2 font-bold text-xl uppercase tracking-[0.2em]
                transition-all duration-200 clip-path-polygon
                ${altitude < 600 ? 'border-red-500 text-red-500 animate-pulse bg-red-950/90 shadow-[0_0_30px_red]' : 'border-white text-white hover:bg-white/10 bg-black/50'}
              `}
            >
              DEPLOY CHUTE
            </button>
        )}
      </div>
    </div>
  );
};