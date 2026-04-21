// ---------------------------------------------------------------------------
// TopicsPanel — right-side workshop browser (desktop inline, mobile overlay)
// ---------------------------------------------------------------------------

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/stores/settings-store';
import { TopicTree } from './topic-tree';

export function TopicsPanel() {
  const { topicsPanelOpen, setTopicsPanelOpen } = useSettingsStore();
  const location = useLocation();

  // Close on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setTopicsPanelOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden',
          topicsPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setTopicsPanelOpen(false)}
        aria-hidden="true"
      />

      {/* Panel — inline on desktop, overlay on mobile */}
      <aside
        role="complementary"
        aria-label="Workshop topics"
        className={cn(
          // Desktop: inline right column
          'hidden lg:flex lg:flex-col lg:h-full lg:border-l lg:border-border lg:bg-card',
          'transition-all duration-300 ease-in-out overflow-hidden',
          topicsPanelOpen ? 'lg:w-72' : 'lg:w-0',
        )}
      >
        <PanelContents onClose={() => setTopicsPanelOpen(false)} />
      </aside>

      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-72 bg-card border-l border-border flex flex-col lg:hidden',
          'transition-transform duration-300 ease-in-out',
          topicsPanelOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        role="complementary"
        aria-label="Workshop topics"
      >
        <PanelContents onClose={() => setTopicsPanelOpen(false)} />
      </div>
    </>
  );
}

function PanelContents({ onClose }: { onClose: () => void }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Workshop Topics</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          aria-label="Close topics panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable topic tree */}
      <div className="flex-1 overflow-y-auto">
        <TopicTree />
      </div>
    </>
  );
}
