// ---------------------------------------------------------------------------
// Router — React Router configuration with layout wrapper
// ---------------------------------------------------------------------------

import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { ChatPage } from '@/pages/chat-page';
import { DashboardPage } from '@/pages/dashboard-page';
import { JobsPage } from '@/pages/jobs-page';
import { TopicsPage } from '@/pages/topics-page';
import { TaskPage } from '@/pages/task-page';
import { ContentPage } from '@/pages/content-page';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<ChatPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/topics/:taskId" element={<TaskPage />} />
        <Route path="/topics/:taskId/:subtopicId" element={<ContentPage />} />
      </Route>
    </Routes>
  );
}
