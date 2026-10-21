import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, SkipForward } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface CinematicIntroProps {
  onComplete: () => void;
}

const SYSTEM_STAGES = [
  'INITIALIZING COGNITIVE RUNTIME...',
  'CALIBRATING FRONTIER ONTOLOGIES...',
  'SYNCHRONIZING DUAL STRATEGIC PATHWAYS...',
  'WARMING SOCRATIC AI COMPANION...',
  'SYSTEM OPERATIONAL // WELCOME TO SKILLNOVA'
];

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const handleSkip = () => {
    soundFX.click();
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  // Keyboard accessibility: ESC key to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Expanding Canvas Rings & Particle Ignition
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Expanding concentric orbital shockwaves
    const rings: { radius: number; maxRadius: number; speed: number; alpha: number; color: string }[] = [
      { radius: 10, maxRadius: Math.max(width, height) * 0.75, speed: 1.8, alpha: 0.6, color: 'rgba(56, 189, 248, ' },
      { radius: 40, maxRadius: Math.max(width, height) * 0.85, speed: 2.2, alpha: 0.5, color: 'rgba(0, 240, 255, ' },
      { radius: 80, maxRadius: Math.max(width, height) * 0.95, speed: 2.6, alpha: 0.4, color: 'rgba(212, 175, 55, ' },
      { radius: 120, maxRadius: Math.max(width, height) * 1.1, speed: 3.0, alpha: 0.35, color: 'rgba(255, 255, 255, ' },
    ];

    // Radial stardust spark particles
    const sparks = Array.from({ length: 45 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 0.8;
      return {
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.6 + 0.3,
        color: Math.random() > 0.4 ? '#38bdf8' : '#ffffff'
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      // 1. Draw expanding rings
      for (let i = 0; i < rings.length; i++) {
        const ring = rings[i];
        ring.radius += ring.speed;
        const progress = ring.radius / ring.maxRadius;
        const currentAlpha = Math.max(0, (1 - progress) * ring.alpha);

        if (ring.radius > ring.maxRadius) {
          ring.radius = 10;
        }

        ctx.beginPath();
        ctx.arc(cx, cy, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${ring.color}${currentAlpha.toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 2. Draw dispersing spark particles
      for (let i = 0; i < sparks.length; i++) {
        const sp = sparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha *= 0.992;

        if (sp.alpha < 0.05 || Math.hypot(sp.x - cx, sp.y - cy) > Math.max(width, height) * 0.5) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 2.5 + 0.8;
          sp.x = cx;
          sp.y = cy;
          sp.vx = Math.cos(angle) * speed;
          sp.vy = Math.sin(angle) * speed;
          sp.alpha = Math.random() * 0.6 + 0.3;
        }

        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animId = requestAnimationFrame(render);
    };

    if (!prefersReducedMotion) {
      animId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReducedMotion]);

  // Smooth loading progression loop (approx 2.8 seconds total duration)
  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const duration = 2800; // 2.8s
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(currentPct);

      // Map progress to stage index
      const stage = Math.min(
        Math.floor((currentPct / 100) * SYSTEM_STAGES.length),
        SYSTEM_STAGES.length - 1
      );
      setStageIndex(stage);

      if (elapsed >= duration) {
        clearInterval(interval);
        setIsExiting(true);
        setTimeout(() => {
          onComplete();
        }, 550);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete, prefersReducedMotion]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.04 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[10000] bg-[#030508] flex flex-col items-center justify-center select-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Cinematic Site Intro"
    >
      {/* Expanding Concentric Rings Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-75" />

      {/* Atmospheric Luminous Blue-White Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-radial from-luxury-azure/20 via-luxury-gold/5 to-transparent blur-[140px] pointer-events-none" />

      {/* Top Bar with Skip Intro Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={handleSkip}
          className="px-4 py-2 rounded-full bg-space-900/80 hover:bg-space-800 border border-white/10 hover:border-luxury-gold/40 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-all shadow-lg group backdrop-blur-md"
          title="Skip Opening Intro (Press ESC)"
          aria-label="Skip Intro"
        >
          <span>Skip Intro</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-space-950 border border-white/10 text-slate-400 group-hover:text-luxury-goldLight">
            ESC
          </span>
          <SkipForward className="w-3.5 h-3.5 text-luxury-azure group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Central Brand Identity & Animated Typography */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-xl mx-auto space-y-6">
        
        {/* Animated Orbital Monogram Symbol */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative w-16 h-16 rounded-2xl bg-gradient-to-b from-space-850 to-space-950 border border-luxury-gold/40 flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.25)]"
        >
          <svg viewBox="0 0 32 32" className="w-8 h-8">
            <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <ellipse cx="16" cy="16" rx="15" ry="6" fill="none" stroke="#d4af37" strokeWidth="1.4" transform="rotate(-30 16 16)" />
            <circle cx="16" cy="16" r="3.5" fill="#ffffff" />
          </svg>
          <div className="absolute inset-0 rounded-2xl border border-luxury-azure/30 animate-pulse pointer-events-none" />
        </motion.div>

        {/* Animated Brand Typography */}
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-luxury-azure animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-luxury-azure font-bold">
              AUTONOMOUS COGNITIVE ENGINE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, letterSpacing: '0.25em' }}
            animate={{ opacity: 1, letterSpacing: '0.04em' }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight"
          >
            SkillNova <span className="bg-gradient-to-r from-luxury-champagne to-luxury-gold bg-clip-text text-transparent">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xs sm:text-sm font-mono text-slate-400 uppercase tracking-widest"
          >
            Your Future, Upgraded // Next-Gen Learning
          </motion.p>
        </div>

        {/* High-Tech Smooth Loading Bar & Stage Telemetry */}
        <div className="w-full max-w-sm space-y-2.5 pt-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[11px] text-slate-400 truncate max-w-[240px]">
              {SYSTEM_STAGES[stageIndex]}
            </span>
            <span className="text-luxury-gold font-bold">
              {progress}%
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="h-1.5 w-full bg-space-900 rounded-full overflow-hidden border border-white/[0.08] p-0.5 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-luxury-azure via-white to-luxury-gold rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <div className="text-[10px] font-mono text-slate-400 text-center flex items-center justify-center gap-2 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>HYBRID NEURAL RUNTIME v2.0 • ZERO LATENCY</span>
          </div>
        </div>

      </div>

    </motion.div>
  );
};
