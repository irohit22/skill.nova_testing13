import React, { useState } from 'react';
import { 
  Settings, 
  Key, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Terminal,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { soundFX } from '../utils/audio';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { 
    systemStatus, 
    refreshSystemStatus, 
    resetAllData, 
    loadSampleMission,
    activeMission 
  } = useLearning();

  const [soundEnabled, setSoundEnabled] = useState(soundFX.isEnabled());
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    soundFX.setEnabled(next);
    setSoundEnabled(next);
    if (next) soundFX.click();
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('skillnova_gemini_key', apiKeyInput.trim());
      setSaveSuccess(true);
      soundFX.success();
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleExportData = () => {
    soundFX.click();
    const data = {
      exportedAt: new Date().toISOString(),
      activeMission,
      localStorageDump: { ...localStorage }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillnova-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-cyan/15 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-space-900 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>CONTROL PANEL // PREFERENCES</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            System & Engine Settings
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Configure AI provider keys, sound synthesizer telemetry, and local storage data persistence.
          </p>
        </div>
      </div>

      {/* 1. Live AI Integration Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-cyber-cyan/30 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyber-cyan font-display font-bold text-lg">
              <Key className="w-5 h-5" />
              <span>Google Gemini AI Configuration</span>
            </div>
            <p className="text-xs text-slate-400">
              SkillNova AI connects to Gemini 2.0 Flash for live generative analysis, questions, and Socratic tutoring.
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-mono ${
            systemStatus?.ai?.isConfigured 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
              : 'bg-space-900 border border-white/10 text-slate-400'
          }`}>
            {systemStatus?.ai?.isConfigured ? 'LIVE AI CONNECTED' : 'DEMO ENGINE ACTIVE'}
          </span>
        </div>

        {/* Backend Status Note */}
        <div className="p-4 rounded-xl bg-space-950 border border-white/10 text-xs font-mono text-slate-300 space-y-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyber-lime" />
            <span className="text-white font-bold">Server Engine Telemetry:</span>
          </div>
          <div className="pl-6 space-y-1 text-slate-400">
            <div>Status: <span className="text-cyber-cyan">{systemStatus?.status || 'Active'}</span></div>
            <div>Model: <span className="text-white">{systemStatus?.ai?.model || 'SkillNova Offline Core'}</span></div>
            <div>Mode: <span className="text-cyber-lime">{systemStatus?.ai?.demoMode ? 'Demo Mode (Offline High-Fidelity Simulation)' : 'Live AI Streaming'}</span></div>
          </div>
        </div>

        {/* Instructions to add API key in server/.env */}
        <div className="p-4 rounded-xl bg-space-900/80 border border-cyber-cyan/20 space-y-2 text-xs text-slate-300">
          <div className="font-display font-bold text-sm text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyber-cyan" />
            <span>How to Connect Your Own Gemini API Key</span>
          </div>
          <p className="leading-relaxed">
            For maximum security, API keys are kept strictly on the server and never bundled in the frontend. 
            To activate live generative responses:
          </p>
          <ol className="list-decimal list-inside space-y-1 pl-2 text-slate-300 font-mono text-[11px]">
            <li>Open the file <code className="text-cyber-cyan">.env</code> in the project root.</li>
            <li>Add your key: <code className="text-cyber-lime">GEMINI_API_KEY=AIzaSy...</code></li>
            <li>Restart the backend server via <code className="text-slate-200">npm run server</code>.</li>
          </ol>
          <p className="text-[11px] text-slate-400 italic">
            *If no key is configured, SkillNova seamlessly runs its offline domain intelligence engine with zero disruption.
          </p>
        </div>
      </div>

      {/* 2. Cybernetic Sound Effects */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-cyber-cyan" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
              <span>Cybernetic Web Audio Effects</span>
            </div>
            <p className="text-xs text-slate-400">
              Subtle futuristic acoustic feedback synthesized live via Web Audio API.
            </p>
          </div>

          <button
            onClick={handleToggleSound}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-colors border ${
              soundEnabled
                ? 'bg-cyber-cyan text-space-950 font-bold border-cyber-cyan'
                : 'bg-space-900 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {soundEnabled ? 'ENABLED' : 'MUTED'}
          </button>
        </div>
      </div>

      {/* 3. Data Persistence & Mission Backups */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 space-y-6">
        <div>
          <h2 className="font-display font-bold text-lg text-white">
            Data Management & Storage
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Your learning plans, task completions, and test scores are automatically saved to your browser&apos;s local storage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadSampleMission}
            className="px-4 py-2.5 rounded-xl bg-space-900 hover:bg-space-850 border border-cyber-cyan/30 text-xs font-mono text-cyber-cyan flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Default AI Mission</span>
          </button>

          <button
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-xl bg-space-900 hover:bg-space-850 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup JSON</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2.5 rounded-xl bg-space-900 hover:bg-rose-950/40 border border-rose-500/30 text-xs font-mono text-rose-400 flex items-center gap-2 transition-colors ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Progress</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-glow max-w-md w-full p-6 rounded-2xl space-y-4 text-center">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <h3 className="font-display font-bold text-xl text-white">
              Reset all local data?
            </h3>
            <p className="text-xs text-slate-300">
              This will clear your study roadmap, completed tasks, earned XP, and mock test scores, restoring default factory state.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-space-900 border border-white/10 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-6 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-display font-bold text-xs"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
