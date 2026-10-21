import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Sparkles, 
  Target, 
  Cpu, 
  Code, 
  Bot, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Radio, 
  Clock, 
  Flame,
  Volume2
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface ShowcaseSliderProps {
  onNavigate: (page: string, params?: any) => void;
}

interface SlideItem {
  id: string;
  category: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  primaryActionLabel: string;
  primaryActionTarget: string;
  secondaryActionLabel?: string;
  secondaryActionTarget?: string;
  icon: any;
  metricBadge: { label: string; value: string };
  previewType: 'diagnostic' | 'pathways' | 'llm' | 'distributed' | 'studio';
}

const SLIDES: SlideItem[] = [
  {
    id: 'slide-diagnostic',
    category: 'PHASE 01 // COGNITIVE PROFILING',
    badgeColor: 'text-luxury-azure border-luxury-azure/30 bg-luxury-azure/10',
    title: 'Diagnostic Knowledge Analyzer',
    subtitle: 'Map What You Know. Expose High-Yield Blind Spots.',
    description: 'Eliminate hundreds of wasted hours on redundant basics. SkillNova deconstructs your baseline across first-principles axioms, isolating high-leverage blind spots with 94%+ diagnostic confidence.',
    highlights: ['First-Principles Axiom Deconstruction', '94% Confidence Rating', 'Dynamic Blind-Spot Isolation', 'Personalized Roadmap Generation'],
    primaryActionLabel: 'Launch Diagnostic Quiz',
    primaryActionTarget: 'mock-test',
    secondaryActionLabel: 'Explore Roadmaps',
    secondaryActionTarget: 'roadmap',
    icon: Target,
    metricBadge: { label: 'ACCURACY BENCHMARK', value: '94%+' },
    previewType: 'diagnostic'
  },
  {
    id: 'slide-pathways',
    category: 'PHASE 02 // DUAL ARCHITECTURES',
    badgeColor: 'text-luxury-gold border-luxury-gold/30 bg-luxury-gold/10',
    title: 'Dual Strategic Pathways',
    subtitle: 'The Smart Route vs Deep Mastery.',
    description: 'Choose between Path A for time-conscious 80/20 active recall sprints, or Path B for first-principles rigor, architectural proofs, error analysis, and permanent retention.',
    highlights: ['Path A: 80/20 Yield & Active Recall', 'Path B: Deep First-Principles Proofs', 'Feynman Explanation Drills', 'Custom Cadence Synchronization'],
    primaryActionLabel: 'Compare Dual Pathways',
    primaryActionTarget: 'pathways',
    secondaryActionLabel: 'Start Mission',
    secondaryActionTarget: 'onboarding',
    icon: Layers,
    metricBadge: { label: 'CURRICULUM ROUTES', value: '2 PATHS' },
    previewType: 'pathways'
  },
  {
    id: 'slide-llm',
    category: 'SPECIALIZATION // FRONTIER AI',
    badgeColor: 'text-luxury-azure border-luxury-azure/30 bg-luxury-azure/10',
    title: 'Generative AI & LLM Systems',
    subtitle: 'Architect Production-Grade RAG & Multi-Agent Networks.',
    description: 'Master large language models, semantic vector retrieval with rerankers, parameter-efficient fine-tuning (LoRA/QLoRA), speculative decoding, and high-throughput vLLM inference.',
    highlights: ['Hybrid Keyword + Dense Vector Search', 'Multi-Agent Tool-Calling Networks', 'LoRA & QLoRA Quantization', 'Inference Latency Optimization'],
    primaryActionLabel: 'Configure AI Mission',
    primaryActionTarget: 'onboarding',
    secondaryActionLabel: 'AI Studio',
    secondaryActionTarget: 'companion',
    icon: Cpu,
    metricBadge: { label: 'LATENCY TARGET', value: '<15ms p99' },
    previewType: 'llm'
  },
  {
    id: 'slide-distributed',
    category: 'SPECIALIZATION // CLOUD & SCALE',
    badgeColor: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
    title: 'High-Scale Distributed Systems',
    subtitle: 'Build Fault-Tolerant Microservices & Kafka Streams.',
    description: 'Master distributed consensus protocols (Raft), multi-region active-active storage, Saga data consistency patterns, idempotency, and sub-10ms tail latency at 1M+ RPS.',
    highlights: ['Raft State Machine Replication', 'Event-Driven Streaming (Kafka)', 'Saga Consistency & Idempotency', 'Zero-Data-Loss Failover'],
    primaryActionLabel: 'Configure Systems Mission',
    primaryActionTarget: 'onboarding',
    secondaryActionLabel: 'Future Signal',
    secondaryActionTarget: 'future-signal',
    icon: Code,
    metricBadge: { label: 'THROUGHPUT SCALE', value: '1M+ RPS' },
    previewType: 'distributed'
  },
  {
    id: 'slide-studio',
    category: 'PHASE 03 // MULTI-MODAL STUDIO',
    badgeColor: 'text-luxury-goldLight border-luxury-gold/30 bg-luxury-gold/10',
    title: 'Socratic AI Studio & The Future Signal',
    subtitle: 'Voice Assistant, Markdown Notes & Career Horizons.',
    description: 'Speak your architectural questions aloud, receive spoken explanations, generate downloadable structured study sheets, and connect daily milestones to high-impact career trajectories.',
    highlights: ['Microphone Voice Input & Speech Synthesis', 'Downloadable Markdown Study Sheets', 'Inline SVG Architecture Blueprints', 'Future-of-Work Automation Intelligence'],
    primaryActionLabel: 'Enter AI Studio',
    primaryActionTarget: 'companion',
    secondaryActionLabel: 'Daily Activity',
    secondaryActionTarget: 'activity',
    icon: Bot,
    metricBadge: { label: 'INTERACTION', value: 'VOICE & AUDIO' },
    previewType: 'studio'
  }
];

const AUTOPLAY_INTERVAL_MS = 6000;

export const ShowcaseSlider: React.FC<ShowcaseSliderProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentSlide = SLIDES[currentIndex];

  const handleNext = useCallback(() => {
    soundFX.click();
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const handlePrev = useCallback(() => {
    soundFX.click();
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const handleSelectSlide = (index: number) => {
    if (index === currentIndex) return;
    soundFX.click();
    setCurrentIndex(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  const togglePlayPause = () => {
    soundFX.click();
    setIsPlaying((prev) => !prev);
  };

  // Autoplay and progress bar scrubber update loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    startTimeRef.current = Date.now();
    setProgress(0);

    const updateInterval = 50; // update every 50ms for smooth progress bar
    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / AUTOPLAY_INTERVAL_MS) * 100, 100);
      setProgress(pct);

      if (elapsed >= AUTOPLAY_INTERVAL_MS) {
        handleNext();
      }
    }, updateInterval);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isPlaying, handleNext]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  // Render dynamic interactive mockup preview for each slide
  const renderSlidePreview = (type: SlideItem['previewType']) => {
    switch (type) {
      case 'diagnostic':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-[11px] font-mono text-luxury-azure uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                COGNITIVE RADAR TELEMETRY
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 font-bold">
                94% CONFIDENCE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-space-950/80 border border-white/[0.06]">
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase mb-1">
                  CRITICAL BLIND SPOTS
                </div>
                <div className="text-xs text-white font-medium">Quantization & vLLM PagedAttention</div>
                <div className="text-[10px] text-slate-400 mt-1">High Yield • Day 3 Target</div>
              </div>

              <div className="p-3.5 rounded-xl bg-space-950/80 border border-white/[0.06]">
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase mb-1">
                  VERIFIED STRENGTHS
                </div>
                <div className="text-xs text-white font-medium">Prompt Engineering & RAG Foundations</div>
                <div className="text-[10px] text-slate-400 mt-1">Mastered • Ready to Skip Basics</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-space-950/90 border border-luxury-gold/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-luxury-gold/15 flex items-center justify-center text-luxury-gold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Diagnostic Verification Active</div>
                  <div className="text-[10px] text-slate-400">Honest initial estimate verified by test</div>
                </div>
              </div>
              <span className="text-xs font-mono text-luxury-gold font-bold">CALIBRATED</span>
            </div>
          </div>
        );

      case 'pathways':
        return (
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-luxury-azure/30 bg-space-950/70 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-luxury-azure font-bold uppercase tracking-wider text-[10px]">
                  PATH A: THE SMART ROUTE
                </span>
                <span className="text-[10px] font-mono text-slate-400">80/20 Time Conscious</span>
              </div>
              <div className="text-sm font-bold text-white font-display">
                High-Yield Active Recall &amp; Sprints
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prioritizes high-frequency patterns, spaced repetition flashcards, and rapid conceptual synthesis.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-luxury-gold/30 bg-space-950/70 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-luxury-gold font-bold uppercase tracking-wider text-[10px]">
                  PATH B: DEEP MASTERY
                </span>
                <span className="text-[10px] font-mono text-slate-400">Unfair Advantage</span>
              </div>
              <div className="text-sm font-bold text-white font-display">
                First-Principles Rigor &amp; Proofs
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Demanding deep architectural understanding, edge case analysis, and Feynman teaching drills.
              </p>
            </div>
          </div>
        );

      case 'llm':
        return (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-space-950/90 border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-luxury-azure uppercase font-bold">RAG &amp; INFERENCE PIPELINE</span>
                <span className="text-slate-400">vLLM Continuous Batching</span>
              </div>
              
              {/* Architecture Blueprint Mockup */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[10px] font-mono">
                <div className="p-2.5 rounded-lg bg-space-900 border border-white/10 text-slate-300">
                  <div className="text-luxury-azure font-bold mb-1">CHUNK &amp; EMBED</div>
                  <span>Hybrid HNSW</span>
                </div>
                <div className="p-2.5 rounded-lg bg-space-900 border border-white/10 text-slate-300">
                  <div className="text-luxury-gold font-bold mb-1">CROSS-ENCODER</div>
                  <span>Semantic Rerank</span>
                </div>
                <div className="p-2.5 rounded-lg bg-space-900 border border-white/10 text-slate-300">
                  <div className="text-emerald-400 font-bold mb-1">SPECULATIVE</div>
                  <span>Low-Latency Token</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-luxury-azure animate-pulse" />
                  Autonomous Agent Tool-Calling Active
                </span>
                <span className="font-mono text-luxury-azure font-bold">p99 &lt;14ms</span>
              </div>
            </div>
          </div>
        );

      case 'distributed':
        return (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-space-950/90 border border-white/[0.08] space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-400 uppercase font-bold">RAFT CONSENSUS TOPOLOGY</span>
                <span className="text-slate-400">Multi-Region Quorum</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
                  <div>NODE 01</div>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400">LEADER (TERM 4)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-space-900 border border-white/10 text-slate-300">
                  <div>NODE 02</div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500">FOLLOWER</span>
                </div>
                <div className="p-2.5 rounded-lg bg-space-900 border border-white/10 text-slate-300">
                  <div>NODE 03</div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500">FOLLOWER</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-300">
                <span>Zero-Downtime Replication</span>
                <span className="text-emerald-400 font-bold">1M+ RPS CAPABLE</span>
              </div>
            </div>
          </div>
        );

      case 'studio':
      default:
        return (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-space-950/90 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-luxury-gold/20 text-luxury-gold flex items-center justify-center">
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-display font-bold text-white">Voice Dialogue &amp; Notes</span>
                </div>
                <span className="text-[10px] font-mono text-luxury-gold font-bold">LIVE ASSISTANT</span>
              </div>

              <div className="p-3 rounded-lg bg-space-900/80 border border-white/10 text-xs text-slate-200 font-body leading-relaxed">
                &ldquo;Explain the Saga pattern versus two-phase commits with a real e-commerce scenario...&rdquo;
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 text-luxury-goldLight">
                  <CheckCircle2 className="w-3 h-3 text-luxury-gold" />
                  Markdown Note Export Ready
                </span>
                <span>TTS Speech Active</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full relative overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      
      {/* Outer Luxury Slider Frame */}
      <div className="glass-panel-glow p-6 sm:p-10 rounded-3xl relative border border-white/[0.1] shadow-2xl overflow-hidden group">
        
        {/* Subtle Ambient Cosmic Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-luxury-gold/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-luxury-azure/5 blur-[120px] pointer-events-none rounded-full" />

        {/* Top Slider Navigation Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-white/[0.08] relative z-10">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider border ${currentSlide.badgeColor}`}>
              {currentSlide.category}
            </span>
            <span className="text-xs font-mono text-slate-400">
              SLIDE <span className="text-white font-bold">{currentIndex + 1}</span> OF {SLIDES.length}
            </span>
          </div>

          {/* Quick Segmented Dots / Pill Selector */}
          <div className="flex items-center gap-2">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => handleSelectSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'w-8 bg-gradient-to-r from-luxury-azure to-luxury-gold' 
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={`Jump to ${slide.title}`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Main Animated Slide Body */}
        <div className="relative min-h-[360px] z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              
              {/* Left Column: Editorial Information & CTAs */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-luxury-goldLight font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>{currentSlide.subtitle}</span>
                  </div>
                  <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
                    {currentSlide.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-body font-light max-w-xl">
                  {currentSlide.description}
                </p>

                {/* Highlights Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {currentSlide.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-luxury-gold flex-shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      soundFX.click();
                      onNavigate(currentSlide.primaryActionTarget);
                    }}
                    className="px-7 py-3 rounded-full bg-white hover:bg-luxury-goldLight text-space-950 font-display font-bold text-xs flex items-center gap-2 shadow-lg transition-all group/btn"
                  >
                    <span>{currentSlide.primaryActionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>

                  {currentSlide.secondaryActionLabel && (
                    <button
                      onClick={() => {
                        soundFX.click();
                        onNavigate(currentSlide.secondaryActionTarget!);
                      }}
                      className="px-6 py-3 rounded-full bg-space-900/80 hover:bg-space-850 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-display font-medium text-xs transition-colors"
                    >
                      {currentSlide.secondaryActionLabel}
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Live Interactive Mockup Showcase */}
              <div className="lg:col-span-5 w-full">
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-space-900 via-space-850 to-space-900 border border-white/[0.08] shadow-inner relative">
                  
                  {/* Metric Top Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {currentSlide.metricBadge.label}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-luxury-gold/15 border border-luxury-gold/30 text-luxury-gold text-xs font-mono font-bold">
                      {currentSlide.metricBadge.value}
                    </span>
                  </div>

                  {/* Dynamic Slide Preview Canvas */}
                  {renderSlidePreview(currentSlide.previewType)}

                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Scrubber & Playback Controls Bar (Matching Reference Video Player Controls) */}
        <div className="mt-8 pt-5 border-t border-white/[0.08] relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Left: Previous / Next & Play / Pause Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-space-900 hover:bg-space-850 border border-white/10 text-slate-300 hover:text-white transition-colors"
              title="Previous Slide"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlayPause}
              className="px-4 py-2.5 rounded-xl bg-space-900 hover:bg-space-850 border border-white/10 text-slate-300 hover:text-white flex items-center gap-2 text-xs font-mono transition-colors"
              title={isPlaying ? 'Pause Autoplay' : 'Play Autoplay'}
              aria-label="Toggle Autoplay"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-luxury-gold" />
                  <span className="text-[11px]">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-luxury-azure fill-luxury-azure" />
                  <span className="text-[11px]">Auto-Slide</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-space-900 hover:bg-space-850 border border-white/10 text-slate-300 hover:text-white transition-colors"
              title="Next Slide"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Center / Right: Reference Video Scrubber Bar & Timestamp Indicator */}
          <div className="flex-1 max-w-md flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
              0{currentIndex + 1} / 0{SLIDES.length}
            </span>

            {/* Glowing Scrubber Progress Bar */}
            <div className="flex-1 h-1.5 bg-space-950 rounded-full overflow-hidden border border-white/[0.08] relative">
              <div 
                className="h-full bg-gradient-to-r from-luxury-azure via-white to-luxury-gold rounded-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-space-950 border border-white/10 text-slate-300 font-bold">
              HD
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
