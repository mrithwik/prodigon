// ---------------------------------------------------------------------------
// AppShell — root layout: sidebar + main content + topics panel
// ---------------------------------------------------------------------------

import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { MobileNav } from './mobile-nav';
import { TopicsPanel } from '@/components/topics/topics-panel';
import { OnboardingBanner } from '@/components/shared/onboarding-banner';

export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Skip navigation for keyboard/screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Nav Overlay */}
      <MobileNav />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <OnboardingBanner />
        <main id="main-content" className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
          {/* Right Topics Panel (desktop inline) */}
          <TopicsPanel />
        </main>
      </div>
    </div>
  );
}
