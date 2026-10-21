import React, { useState } from 'react';
import { 
  Compass, 
  Target, 
  MapPin, 
  FileCheck2, 
  MessageSquareCode, 
  Radio, 
  Award, 
  Settings, 
  Menu, 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Flame,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { soundFX } from '../utils/audio';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { gamification, systemStatus, activeMission } = useLearning();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundFX.isEnabled());

  const toggleSound = () => {
    const next = !soundEnabled;
    soundFX.setEnabled(next);
    setSoundEnabled(next);
    if (next) soundFX.click();
  };

  // Simplified luxury navigation (clean, purposeful, uncrowded)
  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Mission Hub' },
    { id: 'activity', label: 'Daily Activity' },
    { id: 'roadmap', label: 'Study Roadmap' },
    { id: 'mock-test', label: 'Diagnostic Lab' },
    { id: 'companion', label: 'AI Studio' },
    { id: 'future-signal', label: 'Future Signal' },
  ];

  const handleNavClick = (pageId: string) => {
    soundFX.click();
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-space-950/85 backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Luxury Brand Logo */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3.5 cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="SkillNova AI Home"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-b from-space-850 to-space-900 border border-white/10 flex items-center justify-center group-hover:border-luxury-gold/50 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all">
            {/* Elegant Luxury Star/Orbit Monogram */}
            <svg viewBox="0 0 32 32" className="w-5 h-5">
              <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <ellipse cx="16" cy="16" rx="14" ry="5.5" fill="none" stroke="#d4af37" strokeWidth="1.2" transform="rotate(-30 16 16)" />
              <circle cx="16" cy="16" r="3" fill="#ffffff" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="font-display font-bold text-base tracking-tight text-white group-hover:text-luxury-goldLight transition-colors">
              SkillNova <span className="font-light text-slate-400">AI</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-slate-400">
              Executive Learning
            </span>
          </div>
        </div>

        {/* Clean Center Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-space-900/70 border border-white/[0.06]" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = currentPage === item.id || 
              (item.id === 'roadmap' && (currentPage === 'pathways' || currentPage === 'analysis')) ||
              (item.id === 'mock-test' && currentPage === 'test-results');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'text-white bg-space-800 shadow-sm border border-white/10 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-space-850/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Luxury Controls (Streak/XP, Sound, Settings) */}
        <div className="flex items-center gap-3">
          
          {/* Active Status Dot */}
          <div 
            onClick={() => handleNavClick('settings')}
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-space-900 border border-white/[0.08] hover:border-white/20 text-[11px] font-mono text-slate-400 cursor-pointer transition-colors"
            title={systemStatus?.ai?.message || 'System Operational'}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${systemStatus?.ai?.isConfigured ? 'bg-luxury-emerald' : 'bg-luxury-azure'}`} />
            <span>{systemStatus?.ai?.isConfigured ? 'Gemini 2.0 Live' : 'Offline Core'}</span>
          </div>

          {/* XP Badge */}
          <button 
            onClick={() => handleNavClick('achievements')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-space-900 hover:bg-space-850 border border-white/[0.08] hover:border-luxury-gold/40 text-xs font-mono transition-all"
            title="Earned XP & Achievements"
          >
            <Flame className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="text-white font-medium">{gamification.streakDays}d</span>
            <span className="text-slate-600">•</span>
            <span className="text-luxury-goldLight font-bold">{gamification.xp} XP</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-full bg-space-900 border border-white/[0.08] hover:border-white/20 text-slate-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Settings */}
          <button
            onClick={() => handleNavClick('settings')}
            className={`p-2 rounded-full border transition-colors ${
              currentPage === 'settings' 
                ? 'bg-space-800 border-luxury-gold/40 text-luxury-gold' 
                : 'bg-space-900 border-white/[0.08] text-slate-400 hover:text-white'
            }`}
            title="Settings & Data"
            aria-label="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-space-900 border border-white/10 text-slate-300"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-space-950/95 border-b border-white/10 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm ${
                currentPage === item.id
                  ? 'text-white bg-space-850 font-semibold'
                  : 'text-slate-400 hover:bg-space-900'
              }`}
            >
              <span>{item.label}</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
