import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LearningProvider, useLearning } from './context/LearningContext';
import { ParticleBackground } from './components/ParticleBackground';
import { FuturisticCursor } from './components/FuturisticCursor';
import { CinematicIntro } from './components/CinematicIntro';
import { Navigation } from './components/Navigation';

// Pages
import { LandingPage } from './pages/LandingPage';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { MissionDashboard } from './pages/MissionDashboard';
import { KnowledgeAnalysisPage } from './pages/KnowledgeAnalysisPage';
import { PathwaysComparisonPage } from './pages/PathwaysComparisonPage';
import { StudyRoadmapPage } from './pages/StudyRoadmapPage';
import { MockTestLabPage } from './pages/MockTestLabPage';
import { TestResultsPage } from './pages/TestResultsPage';
import { StudyCompanionPage } from './pages/StudyCompanionPage';
import { FutureSignalPage } from './pages/FutureSignalPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { SettingsPage } from './pages/SettingsPage';

import { TodayActivityChart } from './components/TodayActivityChart';
import { MockTestAttempt } from './types';

const MainAppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [pageParams, setPageParams] = useState<any>(null);
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return !sessionStorage.getItem('skillnova_intro_seen');
  });
  const { recordTestAttempt } = useLearning();

  const handleIntroComplete = () => {
    sessionStorage.setItem('skillnova_intro_seen', 'true');
    setShowIntro(false);
  };

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    setPageParams(params || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTestComplete = (attempt: MockTestAttempt) => {
    recordTestAttempt(attempt);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'onboarding':
        return <OnboardingWizard onNavigate={handleNavigate} />;
      case 'dashboard':
        return <MissionDashboard onNavigate={handleNavigate} />;
      case 'activity':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <TodayActivityChart />
          </div>
        );
      case 'analysis':
        return <KnowledgeAnalysisPage onNavigate={handleNavigate} />;
      case 'pathways':
        return <PathwaysComparisonPage onNavigate={handleNavigate} />;
      case 'roadmap':
        return <StudyRoadmapPage onNavigate={handleNavigate} />;
      case 'mock-test':
        return <MockTestLabPage onNavigate={handleNavigate} onTestComplete={handleTestComplete} />;
      case 'test-results':
        return <TestResultsPage attempt={pageParams?.attempt} onNavigate={handleNavigate} />;
      case 'companion':
        return <StudyCompanionPage onNavigate={handleNavigate} />;
      case 'future-signal':
        return <FutureSignalPage onNavigate={handleNavigate} />;
      case 'achievements':
        return <AchievementsPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-space-950 text-slate-100 flex flex-col justify-between selection:bg-cyber-cyan selection:text-space-950">
      {/* Cinematic Opening Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <CinematicIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {/* Background ambient visuals */}
      <ParticleBackground />

      {/* Futuristic Interactive Cursor, Trails & Floating Bioluminescent Orbs */}
      <FuturisticCursor />

      {/* Persistent Futuristic Navigation */}
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Content View with transition */}
      <main className="relative z-10 flex-1">
        {renderCurrentPage()}
      </main>

      {/* Futuristic Monospace Footer */}
      <footer className="relative z-10 border-t border-cyber-cyan/15 bg-space-950/90 py-6 text-center text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan" />
            <span className="text-white font-bold">SKILLNOVA AI</span>
            <span className="text-slate-500">//</span>
            <span>NEXT-GEN PERSONALIZED LEARNING ENGINE</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Space Grotesk &amp; JetBrains Mono</span>
            <span>•</span>
            <button 
              onClick={() => handleNavigate('settings')} 
              className="hover:text-cyber-cyan transition-colors"
            >
              System Diagnostics
            </button>
            <span>•</span>
            <button 
              onClick={() => handleNavigate('mock-test')} 
              className="hover:text-cyber-lime transition-colors"
            >
              Diagnostic Lab
            </button>
            <span>•</span>
            <button 
              onClick={() => {
                sessionStorage.removeItem('skillnova_intro_seen');
                setShowIntro(true);
              }} 
              className="hover:text-luxury-goldLight transition-colors flex items-center gap-1"
              title="Replay opening cinematic animation"
            >
              Replay Intro
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LearningProvider>
      <MainAppContent />
    </LearningProvider>
  );
};

export default App;
