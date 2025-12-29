import { create } from 'zustand';
import type { VoiceState, Task, HistoryItem, Profile, ActionTaken, Conflict } from '@/types';

interface AppState {
  // Voice state
  voiceState: VoiceState;
  setVoiceState: (state: VoiceState) => void;

  // Current transcript
  transcript: string | null;
  setTranscript: (transcript: string | null) => void;

  // AI response message
  responseText: string | null;
  setResponseText: (text: string | null) => void;

  // Recent actions (for result card)
  recentActions: ActionTaken[];
  setRecentActions: (actions: ActionTaken[]) => void;
  clearRecentActions: () => void;

  // Conflicts
  conflicts: Conflict[];
  setConflicts: (conflicts: Conflict[]) => void;

  // Tasks
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;

  // History
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
  addHistoryItem: (item: HistoryItem) => void;

  // User profile
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;

  // UI state
  isResultCardVisible: boolean;
  showResultCard: () => void;
  hideResultCard: () => void;

  // Active tab for navigation
  activeTab: 'home' | 'tasks' | 'history' | 'settings';
  setActiveTab: (tab: 'home' | 'tasks' | 'history' | 'settings') => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Voice state
  voiceState: 'ready',
  setVoiceState: (voiceState) => set({ voiceState }),

  // Transcript
  transcript: null,
  setTranscript: (transcript) => set({ transcript }),

  // Response text
  responseText: null,
  setResponseText: (responseText) => set({ responseText }),

  // Recent actions
  recentActions: [],
  setRecentActions: (recentActions) => set({ recentActions }),
  clearRecentActions: () => set({ recentActions: [] }),

  // Conflicts
  conflicts: [],
  setConflicts: (conflicts) => set({ conflicts }),

  // Tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

  // History
  history: [],
  setHistory: (history) => set({ history }),
  addHistoryItem: (item) => set((state) => ({ history: [item, ...state.history] })),

  // Profile
  profile: null,
  setProfile: (profile) => set({ profile }),

  // UI state
  isResultCardVisible: false,
  showResultCard: () => set({ isResultCardVisible: true }),
  hideResultCard: () => set({ isResultCardVisible: false }),

  // Active tab
  activeTab: 'home',
  setActiveTab: (activeTab) => set({ activeTab }),
}));
