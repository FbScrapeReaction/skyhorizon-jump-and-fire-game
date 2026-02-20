import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store';
import { GamePhase } from '../types';

export const SoundManager: React.FC = () => {
  const { phase, speed, ringsCollected, isScanning } = useGameStore();
  
  const audioCtx = useRef<AudioContext | null>(null);
  const windNode = useRef<AudioBufferSourceNode | null>(null);
  const windGain = useRef<GainNode | null>(null);
  const windFilter = useRef<BiquadFilterNode | null>(null);
  const previousRings = useRef(0);

  // Initialize Audio Context
  useEffect(() => {
    const initAudio = async () => {
      if (!window.AudioContext) return;
      
      const ctx = new window.AudioContext();
      audioCtx.current = ctx;

      // Create Wind Noise Buffer
      const bufferSize = ctx.sampleRate * 2; // 2 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      // Create Wind Nodes
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 200;

      const gain = ctx.createGain();
      gain.gain.value = 0;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();

      windNode.current = noise;
      windFilter.current = filter;
      windGain.current = gain;
    };

    const handleFirstInteraction = () => {
        if (!audioCtx.current) {
            initAudio();
        } else if (audioCtx.current.state === 'suspended') {
            audioCtx.current.resume();
        }
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      audioCtx.current?.close();
    };
  }, []);

  // Update Wind based on speed
  useEffect(() => {
    if (!windGain.current || !windFilter.current || !audioCtx.current) return;

    if (phase === GamePhase.FREEFALL || phase === GamePhase.PARACHUTE) {
        // Map speed (0-100) to Volume and Frequency
        const normalizedSpeed = Math.min(speed / 120, 1);
        
        // Smooth transitions
        const now = audioCtx.current.currentTime;
        windGain.current.gain.setTargetAtTime(0.1 + normalizedSpeed * 0.4, now, 0.1);
        windFilter.current.frequency.setTargetAtTime(200 + normalizedSpeed * 2000, now, 0.1);
    } else {
        const now = audioCtx.current.currentTime;
        windGain.current.gain.setTargetAtTime(0, now, 0.5);
    }
  }, [speed, phase]);

  // Play Ring Collect Sound
  useEffect(() => {
      if (ringsCollected > previousRings.current && audioCtx.current) {
          playCollectSound(audioCtx.current);
          previousRings.current = ringsCollected;
      }
  }, [ringsCollected]);

  // Play Scan Sound
  useEffect(() => {
      if (isScanning && audioCtx.current) {
          playScanSound(audioCtx.current);
      }
  }, [isScanning]);

  const playCollectSound = (ctx: AudioContext) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
  };

  const playScanSound = (ctx: AudioContext) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
  };

  return null;
};