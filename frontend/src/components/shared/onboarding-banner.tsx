// ---------------------------------------------------------------------------
// OnboardingBanner — one-time welcome banner for first-time visitors
// ---------------------------------------------------------------------------

import { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { useSettingsStore } from '@/stores/settings-store';

const STORAGE_KEY = 'prodigon-onboarded';

function isOnboarded(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return true; // Fail closed — don't show if we can't read
  }
}

function setOnboarded() {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // Ignore
  }
}

export function OnboardingBanner() {
  const [dismissed, setDismissed] = useState(isOnboarded);
  const setTopicsPanelOpen = useSettingsStore((s) => s.setTopicsPanelOpen);

  if (dismissed) return null;

  const handleDismiss = () => {
    setOnboarded();
    setDismissed(true);
  };

  const handleOpenTopics = () => {
    setTopicsPanelOpen(true);
    handleDismiss();
  };

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-primary/5 border-b border-primary/10 text-sm shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <BookOpen className="h-4 w-4 text-primary shrink-0" />
        <span className="text-muted-foreground truncate">
          New here? Explore the Workshop Topics to start learning production AI patterns.
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleOpenTopics}
          className="text-primary text-xs font-medium hover:underline whitespace-nowrap"
        >
          Open Topics Panel →
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 rounded hover:bg-accent transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
