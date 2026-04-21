// ---------------------------------------------------------------------------
// Settings Store — theme, model selection, sidebar state, generation params
// ---------------------------------------------------------------------------

import { create } from 'zustand';
import { DEFAULT_MODEL, DEFAULT_TEMPERATURE, DEFAULT_MAX_TOKENS } from '@/lib/constants';

export type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
  theme: Theme;
  sidebarOpen: boolean;
  topicsPanelOpen: boolean;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  /** Topic-specific system prompt set by "Chat About This" — takes priority over systemPrompt */
  topicSystemPrompt: string | null;

  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleTopicsPanel: () => void;
  setTopicsPanelOpen: (open: boolean) => void;
  setModel: (model: string) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  setSystemPrompt: (prompt: string) => void;
  setTopicSystemPrompt: (prompt: string | null) => void;
  resetToDefaults: () => void;
}

/** Resolve and apply the effective theme class on <html> */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
}

// Read initial theme from localStorage or default to system
const storedTheme = (typeof localStorage !== 'undefined'
  ? (localStorage.getItem('prodigon-theme') as Theme | null)
  : null) ?? 'system';
applyTheme(storedTheme);

const storedTopicsPanel = (typeof localStorage !== 'undefined'
  ? localStorage.getItem('prodigon-topics-panel') === 'true'
  : false);

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: storedTheme,
  sidebarOpen: true,
  topicsPanelOpen: storedTopicsPanel,
  model: DEFAULT_MODEL,
  temperature: DEFAULT_TEMPERATURE,
  maxTokens: DEFAULT_MAX_TOKENS,
  systemPrompt: '',
  topicSystemPrompt: null,

  setTheme: (theme) => {
    localStorage.setItem('prodigon-theme', theme);
    applyTheme(theme);
    set({ theme });
  },

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleTopicsPanel: () =>
    set((s) => {
      const next = !s.topicsPanelOpen;
      localStorage.setItem('prodigon-topics-panel', String(next));
      return { topicsPanelOpen: next };
    }),
  setTopicsPanelOpen: (open) => {
    localStorage.setItem('prodigon-topics-panel', String(open));
    set({ topicsPanelOpen: open });
  },

  setModel: (model) => set({ model }),
  setTemperature: (temperature) => set({ temperature }),
  setMaxTokens: (maxTokens) => set({ maxTokens }),
  setSystemPrompt: (systemPrompt) => set({ systemPrompt }),
  setTopicSystemPrompt: (topicSystemPrompt) => set({ topicSystemPrompt }),

  resetToDefaults: () => {
    localStorage.removeItem('prodigon-theme');
    localStorage.removeItem('prodigon-topics-panel');
    applyTheme('system');
    set({
      theme: 'system',
      topicsPanelOpen: false,
      model: DEFAULT_MODEL,
      temperature: DEFAULT_TEMPERATURE,
      maxTokens: DEFAULT_MAX_TOKENS,
      systemPrompt: '',
      topicSystemPrompt: null,
    });
  },
}));
