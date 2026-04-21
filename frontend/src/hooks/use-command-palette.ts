// ---------------------------------------------------------------------------
// useCommandPalette — tiny Zustand slice for command palette open/query state
// ---------------------------------------------------------------------------

import { create } from 'zustand';

interface CommandPaletteState {
  open: boolean;
  query: string;
  setOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
}

export const useCommandPalette = create<CommandPaletteState>((set) => ({
  open: false,
  query: '',
  setOpen: (open) => set({ open, query: '' }),
  setQuery: (query) => set({ query }),
}));
