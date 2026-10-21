import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserMission, 
  PathwayType, 
  StudyRoadmap, 
  MockTestAttempt, 
  GamificationState, 
  Badge,
  KnowledgeLevel,
  StudyActivityEntry,
  StudyNoteDoc
} from '../types';
import { api, SystemStatusResponse } from '../services/api';
import { soundFX } from '../utils/audio';

const INITIAL_BADGES: Badge[] = [
  { id: 'b1', name: 'First Light', description: 'Initiated your first SkillNova learning mission', icon: '✨', unlockedAt: new Date().toISOString() },
  { id: 'b2', name: 'Diagnostic Certified', description: 'Validated your knowledge level via a Mock Test', icon: '🎯' },
  { id: 'b3', name: 'Deep Diver', description: 'Selected the Deep Mastery Pathway for rigorous excellence', icon: '🌊' },
  { id: 'b4', name: 'Flawless Test', description: 'Scored 100% on a Mock Test Lab challenge', icon: '🏆' },
  { id: 'b5', name: 'Speed Demon', description: 'Finished a timed test in under 3 minutes', icon: '⚡' },
  { id: 'b6', name: 'Architect of Tomorrow', description: 'Explored The Future Signal & completed all capstone tasks', icon: '🚀' },
];

const SAMPLE_DEFAULT_MISSION: UserMission = {
  id: 'mission-sample-1',
  topic: 'Generative AI & LLM Systems Engineering',
  category: 'ai-ml',
  priorKnowledge: 'Built simple Python scripts and tried basic OpenAI API calls. Understand what prompts are, but want to master production RAG, vector embeddings, fine-tuning, and low-latency agents.',
  currentLevel: 'intermediate',
  targetScore: 'Top 1% Industry Mastery',
  dailyTime: '1.5 hours',
  deadline: '4 weeks',
  deadlineDate: new Date(Date.now() + 28 * 24 * 3600 * 1000).toISOString().split('T')[0],
  preferredPathway: 'deep',
  createdAt: new Date().toISOString(),
  verifiedScore: 88,
  verifiedLevel: 'intermediate',
};

const MOTIVATIONAL_LINES = [
  "Excellence is not an accident; it is the compounding of quiet, consistent disciplines repeated daily.",
  "You do not rise to the level of your goals; you fall to the level of your systems.",
  "The standard is first-principles mastery. Every minute invested in understanding why pays dividends for a decade.",
  "Momentum is built in silence. Today's focused study session is tomorrow's unfair competitive advantage.",
  "Great architects aren't born with innate intuition; they construct it through rigorous error post-mortems.",
  "Complexity is easy; simplicity and precision require genuine mastery. Keep drilling the axioms.",
  "Small daily improvements over time lead to stunning, non-linear breakthroughs.",
  "Focus is the art of saying no to trivial distractions so your core mission receives uninterrupted brilliance."
];

const DEFAULT_TODAY_ACTIVITIES: StudyActivityEntry[] = [
  {
    id: 'act-1',
    timeSlot: '09:00 - 09:45',
    timestamp: '09:00 AM',
    title: 'Transformer Attention Math & Softmax Derivation',
    durationMinutes: 45,
    category: 'Theory'
  },
  {
    id: 'act-2',
    timeSlot: '11:15 - 11:55',
    timestamp: '11:15 AM',
    title: 'Vector Embeddings & Cosine Metric Diagnostic Lab',
    durationMinutes: 40,
    category: 'Mock Test'
  },
  {
    id: 'act-3',
    timeSlot: '14:20 - 15:00',
    timestamp: '02:20 PM',
    title: 'Socratic AI Tutor Dialogue & Architecture Note Generation',
    durationMinutes: 40,
    category: 'AI Studio'
  },
  {
    id: 'act-4',
    timeSlot: '16:30 - 17:00',
    timestamp: '04:30 PM',
    title: 'Production RAG Chunking Code Implementation Drill',
    durationMinutes: 30,
    category: 'Practice'
  }
];

interface LearningContextType {
  activeMission: UserMission | null;
  setActiveMission: (mission: UserMission) => void;
  pathway: PathwayType;
  setPathway: (pathway: PathwayType) => void;
  roadmap: StudyRoadmap | null;
  setRoadmap: React.Dispatch<React.SetStateAction<StudyRoadmap | null>>;
  toggleTaskCompletion: (taskId: string) => void;
  addTask: (task: { title: string; description: string; category: any; estimatedMinutes: number; priority: any }) => void;
  testAttempts: MockTestAttempt[];
  recordTestAttempt: (attempt: MockTestAttempt) => void;
  gamification: GamificationState;
  addXP: (amount: number, reason?: string) => void;
  systemStatus: SystemStatusResponse | null;
  refreshSystemStatus: () => Promise<void>;
  keywordMastery: Record<string, boolean>;
  toggleKeywordMastery: (keyword: string) => void;
  resetAllData: () => void;
  loadSampleMission: () => void;

  // Today's Activity & Time Tracking
  todayStudyMinutes: number;
  todayGoalMinutes: number;
  setTodayGoalMinutes: (mins: number) => void;
  todayActivityLog: StudyActivityEntry[];
  logStudyActivity: (title: string, durationMinutes: number, category: StudyActivityEntry['category']) => void;
  
  // Live Study Timer
  isTimerRunning: boolean;
  timerSeconds: number;
  startFocusTimer: () => void;
  pauseFocusTimer: () => void;
  resetFocusTimer: () => void;
  saveTimerSession: (title?: string, category?: StudyActivityEntry['category']) => void;

  // Motivational Quote
  currentMotivationalQuote: string;
  rotateMotivationalQuote: () => void;

  // Study Notes
  savedNotes: StudyNoteDoc[];
  saveNote: (note: StudyNoteDoc) => void;
  deleteNote: (id: string) => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMission, setActiveMissionState] = useState<UserMission | null>(() => {
    const saved = localStorage.getItem('skillnova_active_mission');
    return saved ? JSON.parse(saved) : SAMPLE_DEFAULT_MISSION;
  });

  const [pathway, setPathwayState] = useState<PathwayType>(() => {
    return (localStorage.getItem('skillnova_pathway') as PathwayType) || 'deep';
  });

  const [roadmap, setRoadmap] = useState<StudyRoadmap | null>(() => {
    const saved = localStorage.getItem('skillnova_roadmap');
    return saved ? JSON.parse(saved) : null;
  });

  const [testAttempts, setTestAttempts] = useState<MockTestAttempt[]>(() => {
    const saved = localStorage.getItem('skillnova_tests');
    return saved ? JSON.parse(saved) : [];
  });

  const [keywordMastery, setKeywordMastery] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('skillnova_keyword_mastery');
    return saved ? JSON.parse(saved) : {};
  });

  const [gamification, setGamification] = useState<GamificationState>(() => {
    const saved = localStorage.getItem('skillnova_gamification');
    if (saved) return JSON.parse(saved);
    return {
      xp: 420,
      level: 2,
      levelTitle: 'Knowledge Seeker',
      streakDays: 5,
      lastActiveDate: new Date().toISOString(),
      completedTasksCount: 4,
      completedTestsCount: 2,
      badges: INITIAL_BADGES,
      topicMastery: {
        'Attention Mechanisms': 88,
        'RAG Architectures': 82,
        'Vector Embeddings': 94,
        'System Observability': 70,
        'Prompt Optimization': 92
      }
    };
  });

  // Today's Study Activity State
  const [todayActivityLog, setTodayActivityLog] = useState<StudyActivityEntry[]>(() => {
    const saved = localStorage.getItem('skillnova_today_activity');
    return saved ? JSON.parse(saved) : DEFAULT_TODAY_ACTIVITIES;
  });

  const [todayGoalMinutes, setTodayGoalMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('skillnova_today_goal');
    return saved ? Number(saved) : 120; // 2 hours default
  });

  const todayStudyMinutes = todayActivityLog.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  // Live Timer State
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  // Motivational Quote State
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  // Saved Notes State
  const [savedNotes, setSavedNotes] = useState<StudyNoteDoc[]>(() => {
    const saved = localStorage.getItem('skillnova_saved_notes');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'note-sample-1',
        title: 'Executive Notes: Transformer Self-Attention Mechanics',
        topic: 'Generative AI & LLM Systems Engineering',
        summary: 'Self-Attention enables neural tokens to dynamically attend to all other tokens in a context sequence using Query, Key, and Value dot-product projections normalized via Softmax.',
        keyTakeaways: [
          'Attention weights = Softmax((Q · K^T) / √d_k)',
          'Scaling factor √d_k prevents dot products from growing excessively large and pushing Softmax into saturated zero-gradient regions.',
          'Multi-Head Attention projects tokens into multiple subspace representations concurrently (e.g. 8 or 16 heads).'
        ],
        codeSnippet: `def scaled_dot_product_attention(Q, K, V, mask=None):\n    d_k = Q.shape[-1]\n    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)\n    if mask is not None:\n        scores = scores.masked_fill(mask == 0, -1e9)\n    weights = torch.softmax(scores, dim=-1)\n    return torch.matmul(weights, V), weights`,
        memoryMnemonic: 'Think of a theater spotlight: shines brightest on who is speaking right now, dimming background noise.',
        reviewQuestion: 'Why does dividing by √d_k prevent vanishing gradients during backward backpropagation?',
        createdAt: new Date().toLocaleDateString()
      }
    ];
  });

  const [systemStatus, setSystemStatus] = useState<SystemStatusResponse | null>(null);

  // Active Timer Tick effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Sync to local storage
  useEffect(() => {
    if (activeMission) {
      localStorage.setItem('skillnova_active_mission', JSON.stringify(activeMission));
    }
  }, [activeMission]);

  useEffect(() => {
    localStorage.setItem('skillnova_pathway', pathway);
  }, [pathway]);

  useEffect(() => {
    if (roadmap) {
      localStorage.setItem('skillnova_roadmap', JSON.stringify(roadmap));
    }
  }, [roadmap]);

  useEffect(() => {
    localStorage.setItem('skillnova_tests', JSON.stringify(testAttempts));
  }, [testAttempts]);

  useEffect(() => {
    localStorage.setItem('skillnova_gamification', JSON.stringify(gamification));
  }, [gamification]);

  useEffect(() => {
    localStorage.setItem('skillnova_today_activity', JSON.stringify(todayActivityLog));
  }, [todayActivityLog]);

  useEffect(() => {
    localStorage.setItem('skillnova_today_goal', String(todayGoalMinutes));
  }, [todayGoalMinutes]);

  useEffect(() => {
    localStorage.setItem('skillnova_saved_notes', JSON.stringify(savedNotes));
  }, [savedNotes]);

  const refreshSystemStatus = async () => {
    const status = await api.getSystemStatus();
    setSystemStatus(status);
  };

  useEffect(() => {
    refreshSystemStatus();
  }, []);

  // Initialize roadmap if missing
  useEffect(() => {
    if (activeMission && !roadmap) {
      api.generatePlan(
        activeMission.topic,
        pathway,
        activeMission.currentLevel,
        activeMission.dailyTime,
        activeMission.deadline,
        activeMission.priorKnowledge
      ).then(plan => setRoadmap(plan));
    }
  }, [activeMission, pathway]);

  const setActiveMission = (mission: UserMission) => {
    setActiveMissionState(mission);
    setPathwayState(mission.preferredPathway);
    api.generatePlan(
      mission.topic,
      mission.preferredPathway,
      mission.currentLevel,
      mission.dailyTime,
      mission.deadline,
      mission.priorKnowledge
    ).then(plan => setRoadmap(plan));
    soundFX.success();
  };

  const setPathway = (newPathway: PathwayType) => {
    setPathwayState(newPathway);
    if (activeMission) {
      api.generatePlan(
        activeMission.topic,
        newPathway,
        activeMission.currentLevel,
        activeMission.dailyTime,
        activeMission.deadline,
        activeMission.priorKnowledge
      ).then(plan => setRoadmap(plan));
    }
    soundFX.click();
  };

  const addXP = (amount: number, _reason?: string) => {
    setGamification(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 300) + 1;
      let title = 'Nova Initiate';
      if (newLevel === 2) title = 'Knowledge Seeker';
      if (newLevel === 3) title = 'Orbital Scholar';
      if (newLevel === 4) title = 'Quantum Practitioner';
      if (newLevel >= 5) title = 'Master Architect';

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        levelTitle: title,
      };
    });
    soundFX.completeTask();
  };

  const logStudyActivity = (title: string, durationMinutes: number, category: StudyActivityEntry['category']) => {
    const now = new Date();
    const end = new Date(now.getTime() + durationMinutes * 60000);
    const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEntry: StudyActivityEntry = {
      id: `act-${Date.now()}`,
      timeSlot: `${formatTime(now)} - ${formatTime(end)}`,
      timestamp: formatTime(now),
      title,
      durationMinutes,
      category
    };

    setTodayActivityLog(prev => [newEntry, ...prev]);
    addXP(Math.round(durationMinutes * 1.5), `Logged ${durationMinutes}m Study Session`);
    soundFX.success();
  };

  const startFocusTimer = () => {
    setIsTimerRunning(true);
    soundFX.click();
  };

  const pauseFocusTimer = () => {
    setIsTimerRunning(false);
    soundFX.click();
  };

  const resetFocusTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    soundFX.click();
  };

  const saveTimerSession = (title?: string, category?: StudyActivityEntry['category']) => {
    const minutes = Math.max(1, Math.round(timerSeconds / 60));
    logStudyActivity(
      title || `${activeMission?.topic || 'Deep Learning'} Focused Sprint`,
      minutes,
      category || 'Practice'
    );
    resetFocusTimer();
  };

  const toggleTaskCompletion = (taskId: string) => {
    if (!roadmap) return;
    let justCompleted = false;
    let taskTitle = '';
    let taskMinutes = 30;
    let taskCategory: StudyActivityEntry['category'] = 'Practice';

    const updatedTasks = roadmap.tasks.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        if (nextState) {
          justCompleted = true;
          taskTitle = t.title;
          taskMinutes = t.estimatedMinutes;
          if (t.category === 'Theory') taskCategory = 'Theory';
          else if (t.category === 'Mock Test') taskCategory = 'Mock Test';
          else if (t.category === 'Active Recall') taskCategory = 'Practice';
        }
        return {
          ...t,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined
        };
      }
      return t;
    });

    setRoadmap({
      ...roadmap,
      tasks: updatedTasks
    });

    if (justCompleted) {
      addXP(60, 'Completed Study Task');
      logStudyActivity(taskTitle, taskMinutes, taskCategory);
      setGamification(prev => ({
        ...prev,
        completedTasksCount: prev.completedTasksCount + 1
      }));
    } else {
      soundFX.click();
    }
  };

  const addTask = (newTask: { title: string; description: string; category: any; estimatedMinutes: number; priority: any }) => {
    if (!roadmap) return;
    const taskObj = {
      id: `task-custom-${Date.now()}`,
      dayNumber: roadmap.tasks.length + 1,
      weekNumber: Math.ceil((roadmap.tasks.length + 1) / 5),
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
      estimatedMinutes: newTask.estimatedMinutes,
      priority: newTask.priority,
      completed: false
    };

    setRoadmap({
      ...roadmap,
      tasks: [...roadmap.tasks, taskObj]
    });
    soundFX.click();
  };

  const recordTestAttempt = (attempt: MockTestAttempt) => {
    setTestAttempts(prev => [attempt, ...prev]);

    const earnedXP = Math.round(attempt.score * 25) + 50;
    addXP(earnedXP, `Finished Mock Test: ${attempt.percentage}%`);

    // Also automatically log to Today's Activity timeline!
    const testMinutes = Math.max(5, Math.round(attempt.timeSpentSeconds / 60));
    logStudyActivity(`Diagnostic Mock Test: ${attempt.config.topic} (${attempt.percentage}% score)`, testMinutes, 'Mock Test');

    if (activeMission) {
      let verifiedLevel: KnowledgeLevel = 'beginner';
      if (attempt.percentage >= 80) verifiedLevel = 'advanced';
      else if (attempt.percentage >= 60) verifiedLevel = 'intermediate';

      setActiveMissionState({
        ...activeMission,
        verifiedScore: attempt.percentage,
        verifiedLevel
      });
    }

    setGamification(prev => {
      const updatedBadges = prev.badges.map(b => {
        if (b.id === 'b2' && !b.unlockedAt) {
          return { ...b, unlockedAt: new Date().toISOString() };
        }
        if (b.id === 'b4' && attempt.percentage === 100 && !b.unlockedAt) {
          return { ...b, unlockedAt: new Date().toISOString() };
        }
        if (b.id === 'b5' && attempt.timeSpentSeconds < 180 && !b.unlockedAt) {
          return { ...b, unlockedAt: new Date().toISOString() };
        }
        return b;
      });

      return {
        ...prev,
        completedTestsCount: prev.completedTestsCount + 1,
        badges: updatedBadges
      };
    });

    soundFX.success();
  };

  const toggleKeywordMastery = (keyword: string) => {
    setKeywordMastery(prev => {
      const nextVal = !prev[keyword];
      if (nextVal) {
        addXP(25, `Mastered Keyword: ${keyword}`);
      } else {
        soundFX.click();
      }
      return { ...prev, [keyword]: nextVal };
    });
  };

  const rotateMotivationalQuote = () => {
    setQuoteIndex(prev => (prev + 1) % MOTIVATIONAL_LINES.length);
    soundFX.click();
  };

  const saveNote = (note: StudyNoteDoc) => {
    setSavedNotes(prev => [note, ...prev.filter(n => n.id !== note.id)]);
    addXP(40, `Created Study Note: ${note.title}`);
    soundFX.success();
  };

  const deleteNote = (id: string) => {
    setSavedNotes(prev => prev.filter(n => n.id !== id));
    soundFX.click();
  };

  const resetAllData = () => {
    localStorage.clear();
    setActiveMissionState(SAMPLE_DEFAULT_MISSION);
    setPathwayState('deep');
    setRoadmap(null);
    setTestAttempts([]);
    setKeywordMastery({});
    setTodayActivityLog(DEFAULT_TODAY_ACTIVITIES);
    setTodayGoalMinutes(120);
    setSavedNotes([]);
    setGamification({
      xp: 0,
      level: 1,
      levelTitle: 'Nova Initiate',
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      completedTasksCount: 0,
      completedTestsCount: 0,
      badges: INITIAL_BADGES,
      topicMastery: {}
    });
    soundFX.click();
  };

  const loadSampleMission = () => {
    setActiveMission(SAMPLE_DEFAULT_MISSION);
  };

  return (
    <LearningContext.Provider
      value={{
        activeMission,
        setActiveMission,
        pathway,
        setPathway,
        roadmap,
        setRoadmap,
        toggleTaskCompletion,
        addTask,
        testAttempts,
        recordTestAttempt,
        gamification,
        addXP,
        systemStatus,
        refreshSystemStatus,
        keywordMastery,
        toggleKeywordMastery,
        resetAllData,
        loadSampleMission,
        todayStudyMinutes,
        todayGoalMinutes,
        setTodayGoalMinutes,
        todayActivityLog,
        logStudyActivity,
        isTimerRunning,
        timerSeconds,
        startFocusTimer,
        pauseFocusTimer,
        resetFocusTimer,
        saveTimerSession,
        currentMotivationalQuote: MOTIVATIONAL_LINES[quoteIndex],
        rotateMotivationalQuote,
        savedNotes,
        saveNote,
        deleteNote
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
