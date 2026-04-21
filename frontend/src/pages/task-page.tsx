// ---------------------------------------------------------------------------
// TaskPage — /topics/:taskId — Subtopic card grid for a single task
// ---------------------------------------------------------------------------

import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Lock, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTask } from '@/lib/topics-data';
import { useTopicsStore } from '@/stores/topics-store';

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-500/10 text-green-600 dark:text-green-400',
  intermediate: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  advanced: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

export function TaskPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { isRead } = useTopicsStore();

  const task = getTask(taskId ?? '');

  if (!task) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Task not found.</p>
          <button
            onClick={() => navigate('/topics')}
            className="text-sm text-primary hover:underline"
          >
            Back to Workshop
          </button>
        </div>
      </div>
    );
  }

  if (!task.implemented) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">{task.title}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            This topic is part of {task.part === 'II' ? 'Part II — Scalability' : 'Part III — Security'}{' '}
            and will be available in a future workshop session.
          </p>
          <button
            onClick={() => navigate('/topics')}
            className="text-sm text-primary hover:underline"
          >
            ← Back to Workshop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link to="/topics" className="hover:text-foreground transition-colors">
            Workshop
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{task.title}</span>
        </nav>

        {/* Task header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-muted-foreground">Part {task.part}</span>
            <span className="text-muted-foreground">·</span>
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full capitalize font-medium',
                DIFFICULTY_COLORS[task.difficulty],
              )}
            >
              {task.difficulty}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {task.duration}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Task {task.taskNumber}: {task.title}</h1>
          <p className="text-muted-foreground">{task.description}</p>
        </div>

        {/* Subtopic cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {task.subtopics.map((subtopic) => {
            const Icon = subtopic.icon;
            const read = isRead(task.id, subtopic.id);

            return (
              <button
                key={subtopic.id}
                onClick={() => navigate(`/topics/${task.id}/${subtopic.id}`)}
                className="group flex flex-col items-start text-left p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  {read && (
                    <span className="text-[10px] bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                      Read
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold mb-1">{subtopic.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{subtopic.description}</p>

                <div className="flex items-center gap-1 mt-4 text-xs text-primary font-medium">
                  Open
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
