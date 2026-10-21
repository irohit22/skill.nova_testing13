import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  BrainCircuit, 
  Plus, 
  Trash2,
  Bookmark,
  Layers,
  Lightbulb,
  Loader2
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { ChatMessage, StudyNoteDoc, VisualDiagram } from '../types';
import { api } from '../services/api';
import { soundFX } from '../utils/audio';
import { voiceAssistant } from '../utils/voice';

interface StudyCompanionPageProps {
  onNavigate: (page: string) => void;
}

export const StudyCompanionPage: React.FC<StudyCompanionPageProps> = ({ onNavigate }) => {
  const { 
    activeMission, 
    pathway, 
    addXP, 
    savedNotes, 
    saveNote, 
    deleteNote,
    logStudyActivity
  } = useLearning();

  const topic = activeMission?.topic || 'Generative AI & LLM Systems';
  const level = activeMission?.currentLevel || 'intermediate';

  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');

  // Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `### 🌌 Welcome to Nova AI Studio & Tutor\n\nI am your ChatGPT-grade learning agent configured for **${topic}** (**${pathway === 'deep' ? 'Deep Mastery Route' : 'The Smart Route'}**).\n\nYou can **talk to me using your voice**, ask any question, request **structured study notes**, or ask me to **generate visual concept diagrams and architecture blueprints**.\n\nWhat would you like to explore or synthesize right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        "Generate executive study notes on this topic",
        "Draw an architecture diagram of Transformer Attention",
        "Explain this like I'm a beginner with an analogy",
        "Test my understanding with a diagnostic challenge"
      ]
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Voice State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(voiceAssistant.isTTSEnabled());
  const [speechError, setSpeechError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Voice Toggle
  const toggleTTS = () => {
    const next = !ttsEnabled;
    voiceAssistant.setVoiceEnabled(next);
    setTtsEnabled(next);
    soundFX.click();
  };

  // Start Voice Recognition
  const handleStartVoice = () => {
    if (!voiceAssistant.isSpeechSupported()) {
      setSpeechError('Speech recognition is not supported in this browser. Please type your message.');
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    soundFX.click();
    setIsListening(true);
    setSpeechError(null);

    voiceAssistant.startListening(
      (transcript) => {
        setIsListening(false);
        setInput(transcript);
        handleSend(transcript);
      },
      (err) => {
        setIsListening(false);
        setSpeechError('Voice recognition error. Please speak clearly or type.');
        setTimeout(() => setSpeechError(null), 3000);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  // Generator Helpers
  const generateDiagramForQuery = (query: string): VisualDiagram | undefined => {
    const lower = query.toLowerCase();
    if (lower.includes('diagram') || lower.includes('image') || lower.includes('visual') || lower.includes('draw') || lower.includes('flowchart') || lower.includes('architecture')) {
      return {
        id: `diag-${Date.now()}`,
        title: `${topic} Architectural Data Flow`,
        diagramType: 'architecture',
        badge: 'INTERACTIVE BLUEPRINT',
        description: 'Hierarchical query-key-value flow through projection layers with residual bypass and layer normalization.',
        svgXml: `<svg viewBox="0 0 600 240" class="w-full h-auto max-h-56">
          <defs>
            <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#11141d" />
              <stop offset="100%" stopColor="#181c28" />
            </linearGradient>
          </defs>
          <!-- Input Tokens -->
          <rect x="20" y="90" width="100" height="50" rx="10" fill="url(#boxGrad)" stroke="#38bdf8" stroke-width="1.5" />
          <text x="70" y="115" fill="#ffffff" font-size="11" font-family="Space Grotesk" text-anchor="middle" font-weight="bold">Input Tokens</text>
          <text x="70" y="130" fill="#94a3b8" font-size="9" font-family="JetBrains Mono" text-anchor="middle">[Batch, Seq, D]</text>
          
          <!-- Vector Arrow -->
          <line x1="120" y1="115" x2="170" y2="115" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3 3" />
          <circle cx="170" cy="115" r="3" fill="#38bdf8" />

          <!-- QKV Projection -->
          <rect x="180" y="50" width="130" height="130" rx="12" fill="url(#boxGrad)" stroke="#d4af37" stroke-width="1.5" />
          <text x="245" y="75" fill="#f5e6b8" font-size="11" font-family="Space Grotesk" text-anchor="middle" font-weight="bold">Q, K, V Projections</text>
          <line x1="200" y1="95" x2="290" y2="95" stroke="#ffffff" stroke-width="1" opacity="0.3" />
          <text x="245" y="115" fill="#38bdf8" font-size="10" font-family="JetBrains Mono" text-anchor="middle">Q = X · W_q</text>
          <text x="245" y="135" fill="#d4af37" font-size="10" font-family="JetBrains Mono" text-anchor="middle">K = X · W_k</text>
          <text x="245" y="155" fill="#10b981" font-size="10" font-family="JetBrains Mono" text-anchor="middle">V = X · W_v</text>

          <!-- Arrow to Softmax -->
          <line x1="310" y1="115" x2="360" y2="115" stroke="#d4af37" stroke-width="2" />
          <circle cx="360" cy="115" r="3" fill="#d4af37" />

          <!-- Scaled Dot-Product Softmax -->
          <rect x="370" y="70" width="110" height="90" rx="10" fill="url(#boxGrad)" stroke="#f59e0b" stroke-width="1.5" />
          <text x="425" y="98" fill="#ffffff" font-size="11" font-family="Space Grotesk" text-anchor="middle" font-weight="bold">Softmax Math</text>
          <text x="425" y="118" fill="#e2e8f0" font-size="9" font-family="JetBrains Mono" text-anchor="middle">A = (Q·K^T)/√d_k</text>
          <text x="425" y="138" fill="#10b981" font-size="9" font-family="JetBrains Mono" text-anchor="middle">Weights sum to 1</text>

          <!-- Arrow to Output -->
          <line x1="480" y1="115" x2="520" y2="115" stroke="#10b981" stroke-width="2" />
          <circle cx="520" cy="115" r="3" fill="#10b981" />

          <!-- Context Output -->
          <rect x="525" y="90" width="60" height="50" rx="10" fill="url(#boxGrad)" stroke="#10b981" stroke-width="1.5" />
          <text x="555" y="115" fill="#ffffff" font-size="10" font-family="Space Grotesk" text-anchor="middle" font-weight="bold">Output</text>
          <text x="555" y="130" fill="#94a3b8" font-size="8" font-family="JetBrains Mono" text-anchor="middle">Context</text>
        </svg>`
      };
    }
    return undefined;
  };

  const generateNoteForQuery = (query: string): StudyNoteDoc | undefined => {
    const lower = query.toLowerCase();
    if (lower.includes('note') || lower.includes('summary') || lower.includes('cheat sheet') || lower.includes('flashcard')) {
      return {
        id: `note-${Date.now()}`,
        title: `Executive Brief: Core Principles of ${topic}`,
        topic,
        summary: `Structured first-principles breakdown of ${topic}. Focuses on deterministic interfaces, latency-accuracy tradeoffs, and cognitive retention.`,
        keyTakeaways: [
          'Deconstruct every complex problem into foundational axioms before writing syntax.',
          'Identify the 80/20 critical path: focus on what causes 80% of runtime or exam failures.',
          'Active recall and Socratic self-interrogation double long-term memory consolidation.'
        ],
        codeSnippet: `# First-principles validation harness in Python\ndef evaluate_system_stability(metrics):\n    return all(m['error_rate'] < 0.01 for m in metrics)`,
        memoryMnemonic: 'The Bedrock Rule: A skyscraper cannot stand on unverified assumptions.',
        reviewQuestion: 'What single architectural parameter in this system has the largest non-linear impact on performance?',
        createdAt: new Date().toLocaleDateString()
      };
    }
    return undefined;
  };

  // Main Send Handler
  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    soundFX.click();

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(-5).map(m => ({ sender: m.sender, text: m.text }));
      const response = await api.chatTutor(textToSend, topic, level, pathway, history);

      const generatedDiagram = generateDiagramForQuery(textToSend);
      const generatedNote = generateNoteForQuery(textToSend);

      const assistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: response.suggestedPrompts || [
          "Generate structured study notes",
          "Draw visual concept diagram",
          "Give me an intuitive analogy",
          "Test my understanding"
        ],
        generatedDiagram,
        generatedNote
      };

      setMessages(prev => [...prev, assistantMsg]);
      addXP(20, 'Socratic Dialogue with AI Tutor');
      logStudyActivity(`AI Studio Dialogue: "${textToSend.slice(0, 30)}..."`, 15, 'AI Studio');
      soundFX.completeTask();

      // Read aloud via TTS if voice enabled
      if (ttsEnabled) {
        voiceAssistant.speak(response.text);
      }

    } catch (e) {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text: `### Connection Error\n\nUnable to reach AI tutor. Operating in high-fidelity offline mode.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundFX.click();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveGeneratedNote = (note: StudyNoteDoc) => {
    saveNote(note);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-4.5rem)] flex flex-col space-y-4">
      
      {/* Top Luxury Header with Voice Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-space-850 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-lg sm:text-xl text-white">
                Nova AI Studio & Voice Agent
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-luxury-gold/15 border border-luxury-gold/30 text-[10px] font-mono text-luxury-goldLight font-bold">
                CHATGPT-GRADE TUTOR
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Domain: <span className="text-slate-200">{topic}</span> ({level}) • Generates Notes & Visual Diagrams
            </p>
          </div>
        </div>

        {/* Action Controls (Voice Toggle, Tab Switcher, Reset) */}
        <div className="flex items-center gap-2">
          
          {/* Tab Switcher: Chat vs Saved Notes */}
          <div className="flex items-center p-1 rounded-full bg-space-900 border border-white/10 text-xs font-mono">
            <button
              onClick={() => { setActiveTab('chat'); soundFX.click(); }}
              className={`px-3 py-1 rounded-full transition-all ${activeTab === 'chat' ? 'bg-white text-space-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Dialogue & Diagrams
            </button>
            <button
              onClick={() => { setActiveTab('notes'); soundFX.click(); }}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${activeTab === 'notes' ? 'bg-white text-space-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <FileText className="w-3 h-3" />
              <span>Saved Notes ({savedNotes.length})</span>
            </button>
          </div>

          {/* Voice Read Aloud Toggle */}
          <button
            onClick={toggleTTS}
            className={`p-2 rounded-full border transition-colors ${
              ttsEnabled 
                ? 'bg-space-850 border-luxury-azure text-luxury-azure shadow-[0_0_10px_rgba(56,189,248,0.2)]' 
                : 'bg-space-900 border-white/10 text-slate-500 hover:text-white'
            }`}
            title={ttsEnabled ? 'Voice read-aloud active' : 'Voice read-aloud muted'}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset Conversation */}
          <button
            onClick={() => {
              setMessages([
                {
                  id: `welcome-${Date.now()}`,
                  sender: 'assistant',
                  text: `### Session Reset\n\nReady for your next inquiry in **${topic}**. What shall we dissect or illustrate?`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  suggestedPrompts: [
                    "Generate executive study notes on this topic",
                    "Draw an architecture diagram of Transformer Attention",
                    "Explain this like I'm a beginner with an analogy"
                  ]
                }
              ]);
              soundFX.click();
            }}
            className="p-2 rounded-full bg-space-900 border border-white/10 text-slate-400 hover:text-white transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Speech Error Banner if any */}
      {speechError && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-center gap-2">
          <span>⚠️ {speechError}</span>
        </div>
      )}

      {/* Main Content: Chat View or Notes View */}
      {activeTab === 'chat' ? (
        <>
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-5 pr-2 no-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-space-900 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-space-850 border border-white/20 text-white rounded-tr-none'
                    : 'glass-panel text-slate-200 border-white/[0.08] rounded-tl-none space-y-3'
                }`}>
                  
                  {/* Message Header */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1 border-b border-white/[0.06] pb-1">
                    <span className="uppercase text-luxury-azure font-semibold">
                      {msg.sender === 'assistant' ? 'Nova AI Studio' : 'You'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'assistant' && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-white transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-luxury-emerald" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="prose prose-invert prose-xs max-w-none text-slate-200 whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Inline Generated Visual Diagram / Blueprint if present */}
                  {msg.generatedDiagram && (
                    <div className="mt-3 p-4 rounded-xl bg-space-950/90 border border-luxury-azure/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-luxury-azure uppercase font-bold flex items-center gap-1.5">
                          <ImageIcon className="w-3 h-3" />
                          {msg.generatedDiagram.badge}
                        </span>
                        <span className="text-xs font-display text-white font-semibold">
                          {msg.generatedDiagram.title}
                        </span>
                      </div>

                      {msg.generatedDiagram.svgXml && (
                        <div 
                          className="p-3 bg-space-900/60 rounded-lg border border-white/5 flex items-center justify-center overflow-x-auto"
                          dangerouslySetInnerHTML={{ __html: msg.generatedDiagram.svgXml }}
                        />
                      )}

                      <p className="text-[11px] text-slate-400">
                        {msg.generatedDiagram.description}
                      </p>
                    </div>
                  )}

                  {/* Inline Generated Study Note Card if present */}
                  {msg.generatedNote && (
                    <div className="mt-3 p-4 rounded-xl bg-space-950/90 border border-luxury-gold/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-luxury-gold uppercase font-bold flex items-center gap-1.5">
                          <FileText className="w-3 h-3" />
                          STRUCTURED STUDY NOTES
                        </span>
                        <button
                          onClick={() => handleSaveGeneratedNote(msg.generatedNote!)}
                          className="px-2.5 py-1 rounded-full bg-luxury-gold/15 hover:bg-luxury-gold/25 border border-luxury-gold/40 text-[10px] font-mono text-luxury-goldLight flex items-center gap-1 transition-colors"
                        >
                          <Bookmark className="w-3 h-3" />
                          <span>Save to My Notes</span>
                        </button>
                      </div>

                      <h4 className="font-display font-bold text-sm text-white">
                        {msg.generatedNote.title}
                      </h4>
                      <p className="text-xs text-slate-300">
                        {msg.generatedNote.summary}
                      </p>

                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Key Takeaways:</span>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {msg.generatedNote.keyTakeaways.map((k, kIdx) => (
                            <li key={kIdx} className="flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold mt-1.5 flex-shrink-0" />
                              <span>{k}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {msg.generatedNote.codeSnippet && (
                        <pre className="p-2.5 rounded-lg bg-space-900 font-mono text-[11px] text-slate-200 overflow-x-auto">
                          {msg.generatedNote.codeSnippet}
                        </pre>
                      )}
                    </div>
                  )}

                  {/* Inline Prompt Chips */}
                  {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-luxury-gold" />
                        Recommended Next Inquiries:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedPrompts.map((chip, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => handleSend(chip)}
                            className="px-2.5 py-1 rounded-full bg-space-950 hover:bg-space-850 border border-white/10 hover:border-luxury-gold/40 text-xs font-mono text-slate-300 hover:text-white transition-colors"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-space-850 border border-white/20 flex items-center justify-center text-white flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3.5 justify-start">
                <div className="w-8 h-8 rounded-xl bg-space-900 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="glass-panel p-4 rounded-2xl rounded-tl-none border-white/[0.08] flex items-center gap-2 text-xs font-mono text-luxury-gold">
                  <Loader2 className="w-4 h-4 animate-spin text-luxury-gold" />
                  <span>Nova AI Agent synthesizing educational knowledge...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 flex-shrink-0 no-scrollbar">
            {[
              "📝 Generate executive study notes",
              "🎨 Draw architecture diagram",
              "🧠 Socratic challenge question",
              "⚡ 3 rapid-fire flashcards",
              "🚀 Real-world job applications"
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.slice(3))}
                className="px-3.5 py-1.5 rounded-full bg-space-900 hover:bg-space-850 border border-white/10 hover:border-luxury-gold/40 text-xs font-mono text-slate-300 hover:text-white whitespace-nowrap transition-colors flex-shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Form Bar with Microphone & Send */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2.5 pt-1 flex-shrink-0"
          >
            {/* Microphone button for Voice Assistant */}
            <button
              type="button"
              onClick={handleStartVoice}
              className={`p-3 rounded-full border transition-all flex items-center justify-center ${
                isListening 
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                  : 'bg-space-900 hover:bg-space-850 border-white/10 text-slate-300 hover:text-white'
              }`}
              title={isListening ? 'Listening to your voice... Speak now' : 'Click to speak query with voice'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening to your speech... Speak now' : `Ask any question or request notes/diagrams for ${topic}...`}
                className="w-full px-5 py-3.5 rounded-full bg-space-950 border border-white/10 text-white placeholder-slate-500 font-display text-sm focus:outline-none focus:border-luxury-gold pr-14 shadow-inner"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white text-space-950 hover:bg-luxury-goldLight disabled:opacity-30 transition-colors shadow-sm"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </>
      ) : (
        /* Saved Notes View */
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h3 className="font-display font-bold text-xl text-white">Your Executive Study Notes</h3>
              <p className="text-xs text-slate-400">Generated and saved from your Socratic AI sessions.</p>
            </div>
            <button
              onClick={() => handleSend("Generate executive study notes on this topic")}
              className="px-4 py-2 rounded-full bg-white hover:bg-luxury-goldLight text-space-950 font-display font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate New Notes</span>
            </button>
          </div>

          {savedNotes.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl text-center text-slate-400 text-xs">
              No saved study notes yet. Ask the AI agent to generate study notes in the chat tab!
            </div>
          ) : (
            savedNotes.map((note) => (
              <div key={note.id} className="p-6 rounded-2xl glass-panel border-white/[0.08] space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-luxury-gold uppercase font-bold">
                      {note.topic} • {note.createdAt}
                    </span>
                    <h4 className="font-display font-bold text-lg text-white mt-0.5">
                      {note.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {note.summary}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Key Takeaways:</span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {note.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {note.codeSnippet && (
                  <pre className="p-3 rounded-xl bg-space-950 border border-white/5 font-mono text-xs text-slate-200 overflow-x-auto">
                    {note.codeSnippet}
                  </pre>
                )}

                <div className="p-3 rounded-xl bg-space-900/60 border border-luxury-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-luxury-gold block">Memory Trick / Mnemonic:</span>
                    <span className="text-slate-200 italic">&ldquo;{note.memoryMnemonic}&rdquo;</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`# ${note.title}\n\n${note.summary}\n\n### Key Takeaways\n${note.keyTakeaways.map(k => `- ${k}`).join('\n')}\n\n${note.codeSnippet || ''}`);
                      soundFX.click();
                    }}
                    className="px-3 py-1.5 rounded-full bg-space-950 border border-white/10 hover:border-white/20 text-[11px] font-mono text-slate-300 flex items-center gap-1 self-start sm:self-center"
                  >
                    <Download className="w-3 h-3" />
                    <span>Copy Markdown</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
