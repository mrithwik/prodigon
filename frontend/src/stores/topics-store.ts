// ---------------------------------------------------------------------------
// Topics Store — tracks which parts are expanded and read history
// ---------------------------------------------------------------------------

import { create } from 'zustand';

interface ReadEntry {
  taskId: string;
  subtopicId: string;
  readAt: number;
}

interface TopicsState {
  /** Parts that are expanded in the topic tree — Part I open by default */
  expandedParts: string[];
  /** Read history — persisted to localStorage */
  readHistory: ReadEntry[];

  togglePart: (part: string) => void;
  markAsRead: (taskId: string, subtopicId: string) => void;
  isRead: (taskId: string, subtopicId: string) => boolean;
  /** How many subtopics in the given part have been read */
  getReadCountForPart: (part: string, taskIds: string[]) => number;
}

const STORAGE_KEY = 'prodigon-read-history';

function loadHistory(): ReadEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReadEntry[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: ReadEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export const useTopicsStore = create<TopicsState>((set, get) => ({
  expandedParts: ['I'],
  readHistory: loadHistory(),

  togglePart: (part) =>
    set((s) => ({
      expandedParts: s.expandedParts.includes(part)
        ? s.expandedParts.filter((p) => p !== part)
        : [...s.expandedParts, part],
    })),

  markAsRead: (taskId, subtopicId) => {
    const { readHistory } = get();
    // Avoid duplicates
    if (readHistory.some((e) => e.taskId === taskId && e.subtopicId === subtopicId)) return;
    const updated = [...readHistory, { taskId, subtopicId, readAt: Date.now() }];
    saveHistory(updated);
    set({ readHistory: updated });
  },

  isRead: (taskId, subtopicId) =>
    get().readHistory.some((e) => e.taskId === taskId && e.subtopicId === subtopicId),

  getReadCountForPart: (_, taskIds) => {
    const { readHistory } = get();
    return readHistory.filter((e) => taskIds.includes(e.taskId)).length;
  },
}));
