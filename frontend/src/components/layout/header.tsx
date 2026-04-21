// ---------------------------------------------------------------------------
// Header — top bar with mobile menu, page title, model selector, theme toggle,
//          search (Cmd+K), topics panel toggle, and settings
// ---------------------------------------------------------------------------

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Settings, BookOpen, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/stores/settings-store';
import { MODELS } from '@/lib/constants';
import SettingsDialog from '@/components/settings/settings-dialog';
import { CommandPalette } from '@/components/ui/command-palette';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Chat',
  '/dashboard': 'Dashboard',
  '/jobs': 'Batch Jobs',
  '/topics': 'Workshop',
};

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/topics')) return 'Workshop';
  return PAGE_TITLES[pathname] ?? 'Prodigon';
}

export function Header() {
  const location = useLocation();
  const {
    theme,
    setTheme,
    model,
    setModel,
    toggleSidebar,
    sidebarOpen,
    topicsPanelOpen,
    toggleTopicsPanel,
  } = useSettingsStore();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const pageTitle = getPageTitle(location.pathname);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Detect Mac for keyboard hint display
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl';

  return (
    <>
      <header className="flex items-center justify-between h-14 px-4 border-b border-border bg-card shrink-0">
        {/* Left — Hamburger (visible when sidebar is closed or on mobile) */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className={cn(
              'p-2 rounded-lg hover:bg-accent transition-colors',
              sidebarOpen ? 'hidden lg:hidden' : 'block',
              'md:hidden',
              !sidebarOpen && 'md:block',
            )}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page Title */}
          <h1 className="text-base font-semibold">{pageTitle}</h1>
        </div>

        {/* Right — controls */}
        <div className="flex items-center gap-1">
          {/* Model Selector */}
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="h-8 px-2 pr-7 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer mr-1"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
            }}
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Search / Command Palette */}
          <button
            onClick={() => setCommandOpen(true)}
            className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-background text-sm text-muted-foreground hover:text-foreground hover:border-input transition-colors"
            aria-label="Open command palette"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden md:inline text-xs">Search</span>
            <kbd className="hidden md:inline text-[10px] bg-muted px-1 rounded font-mono">
              {modKey}K
            </kbd>
          </button>

          {/* Search icon only on small screens */}
          <button
            onClick={() => setCommandOpen(true)}
            className="sm:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Topics Panel Toggle */}
          <button
            onClick={toggleTopicsPanel}
            aria-pressed={topicsPanelOpen}
            aria-label="Toggle workshop topics panel"
            className={cn(
              'p-2 rounded-lg transition-colors',
              topicsPanelOpen
                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                : 'hover:bg-accent text-foreground',
            )}
          >
            <BookOpen className="h-4 w-4" />
          </button>
        </div>
      </header>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </>
  );
}
