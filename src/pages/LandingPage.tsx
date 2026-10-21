import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Radio, 
  Target,
  Play,
  Layers,
  ChevronRight,
  Bot,
  Activity
} from 'lucide-react';
import { KnowledgeReactor } from '../components/KnowledgeReactor';
import { ShowcaseSlider } from '../components/ShowcaseSlider';
import { CinematicHeadline } from '../components/CinematicHeadline';
import { CyberSkull3D } from '../components/CyberSkull3D';
import { useLearning } from '../context/LearningContext';
import { soundFX } from '../utils/audio';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { systemStatus, activeMission } = useLearning();
  const [heroVisualMode, setHeroVisualMode] = useState<'skull' | 'reactor'>('skull');

  const handleStartMission = () => {
    soundFX.click();
    onNavigate('onboarding');
  };

  const handleExploreLab = () => {
    soundFX.click();
    onNavigate('mock-test');
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-between overflow-hidden">
      
      {/* Luxury Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28">
        
        {/* Subtle, refined status pill */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-space-900/80 border border-white/10 text-xs font-mono text-slate-300 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
            <span className="text-white font-medium uppercase tracking-wider text-[11px]">
              PERSONALIZED LEARNING ENGINE
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 text-[11px]">
              {systemStatus?.ai?.isConfigured ? 'Gemini 2.0 Connected' : 'High-Fidelity Core Active'}
            </span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Editorial Hero Typography */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <CinematicHeadline
              kicker="SYSTEM BENCHMARK 01 // KINETIC COGNITION"
              lines={["YOUR NEXT LEVEL", "IS NOT AN ACCIDENT."]}
              accentWord="ACCIDENT."
              showReplayButton={true}
              className="text-4xl sm:text-6xl"
            />

            {/* Next section: smooth sequential transition after headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.85,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="space-y-6"
            >
              <p className="text-base sm:text-lg text-slate-300 max-w-xl font-light leading-relaxed">
                Know what you know. Discover what you&apos;re missing. Build the skills your future needs through diagnostic AI profiling, dual learning pathways, and intelligent Socratic tutoring.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5 justify-center lg:justify-start">
                <button
                  onClick={handleStartMission}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-luxury-goldLight text-space-950 font-display font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] group"
                >
                  <span>Build My Learning Mission</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleExploreLab}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-space-900/80 hover:bg-space-850 text-slate-200 hover:text-white border border-white/10 hover:border-white/20 font-display font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Cpu className="w-4 h-4 text-luxury-azure" />
                  <span>Explore the AI Lab</span>
                </button>
              </div>

              {/* Resume Active Mission if exists */}
              {activeMission && (
                <div className="pt-2">
                  <button 
                    onClick={() => onNavigate('dashboard')}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-space-900/60 border border-white/[0.08] hover:border-luxury-gold/40 text-xs font-mono text-slate-300 transition-colors"
                  >
                    <Play className="w-3 h-3 text-luxury-gold fill-luxury-gold" />
                    <span className="text-slate-400">Current Mission:</span>
                    <span className="text-white font-medium truncate max-w-xs">{activeMission.topic}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              )}

              {/* Refined Standards */}
              <div className="pt-8 border-t border-white/[0.08] grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <div className="font-display text-2xl font-bold text-white">0%</div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">Guesswork</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-luxury-gold">2 Paths</div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">Smart vs Deep</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-luxury-azure">100%</div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">Diagnostic</div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right: 3D Robot Skull Centerpiece */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.95,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="lg:col-span-5 flex flex-col items-center justify-center w-full"
          >
            {/* Visual Centerpiece Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-space-950/80 border border-white/10 mb-3 text-xs font-mono shadow-sm">
              <button
                onClick={() => {
                  soundFX.click();
                  setHeroVisualMode('skull');
                }}
                className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                  heroVisualMode === 'skull'
                    ? 'bg-white text-space-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>3D Cyber Skull</span>
              </button>
              <button
                onClick={() => {
                  soundFX.click();
                  setHeroVisualMode('reactor');
                }}
                className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                  heroVisualMode === 'reactor'
                    ? 'bg-white text-space-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Cognitive Reactor</span>
              </button>
            </div>

            {heroVisualMode === 'skull' ? (
              <CyberSkull3D />
            ) : (
              <div className="w-full flex flex-col items-center justify-center">
                <KnowledgeReactor />
                <div className="text-center mt-3 text-xs font-mono text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                  Interactive cognitive reactor — click any node to inspect telemetry
                </div>
              </div>
            )}
          </motion.div>

        </div>

      </section>

      {/* Simplified, Luxury 3-Pillar Section */}
      <section className="relative z-10 border-t border-white/[0.08] bg-space-900/40 backdrop-blur-xl py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-luxury-gold font-bold">
              FIRST-PRINCIPLES PEDAGOGY
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1.5">
              Three Pillars of Durable Mastery
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Designed for serious learners who refuse to waste hundreds of hours on shallow video tutorials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div 
              onClick={() => onNavigate('dashboard')}
              className="glass-panel p-6 sm:p-8 rounded-2xl hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-space-850 border border-white/10 flex items-center justify-center text-luxury-azure mb-4 group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-luxury-azure transition-colors">
                Diagnostic Gap Analysis
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                SkillNova identifies what you already grasp versus your high-leverage blind spots, so every study session addresses real weaknesses.
              </p>
            </div>

            {/* Pillar 2 */}
            <div 
              onClick={() => onNavigate('roadmap')}
              className="glass-panel p-6 sm:p-8 rounded-2xl hover:border-luxury-gold/40 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-space-850 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-luxury-gold transition-colors">
                Dual Strategic Pathways
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Choose between The Smart Route (80/20 time-conscious efficiency) and Deep Mastery (first-principles proofs and unfair capability).
              </p>
            </div>

            {/* Pillar 3 */}
            <div 
              onClick={() => onNavigate('future-signal')}
              className="glass-panel p-6 sm:p-8 rounded-2xl hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-space-850 border border-white/10 flex items-center justify-center text-luxury-emerald mb-4 group-hover:scale-105 transition-transform">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-luxury-emerald transition-colors">
                The Future Signal
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Understand what AI automates in your field versus irreplaceable human superpowers (judgment, ethics, system architecture, empathy).
              </p>
            </div>

          </div>

          {/* Interactive Reference Slider Showcase */}
          <div className="mt-16">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-luxury-azure font-bold">
                INTERACTIVE PLATFORM &amp; SPECIALIZATION SHOWCASE
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1.5">
                Explore Core AI Systems &amp; Curriculum Engines
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Slide through the interactive cognitive profiler, dual learning pathways, and specialized frontier domains.
              </p>
            </div>

            <ShowcaseSlider onNavigate={onNavigate} />
          </div>

          {/* Simple Executive CTA Banner */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-space-900 via-space-850 to-space-900 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="font-display font-bold text-xl text-white">
                Ready to upgrade your cognitive capability?
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">
                Configure your personalized AI learning system in under 2 minutes.
              </div>
            </div>
            <button
              onClick={handleStartMission}
              className="px-7 py-3 rounded-full bg-white hover:bg-luxury-goldLight text-space-950 font-display font-bold text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2 whitespace-nowrap"
            >
              <span>Configure Mission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
