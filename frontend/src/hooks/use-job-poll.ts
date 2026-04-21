// ---------------------------------------------------------------------------
// useJobPoll — polls a running/pending job until it completes
// ---------------------------------------------------------------------------

import { useEffect, useRef } from 'react';
import { api } from '@/api/endpoints';
import { useJobsStore } from '@/stores/jobs-store';
import { useToast } from '@/hooks/use-toast';
import { JOB_POLL_INTERVAL } from '@/lib/constants';

export function useJobPoll(jobId: string, status: string) {
  const updateJob = useJobsStore((s) => s.updateJob);
  const toast = useToast();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (status !== 'pending' && status !== 'running') {
      return;
    }

    notifiedRef.current = false;

    const poll = async () => {
      try {
        const data = await api.getJob(jobId);
        updateJob(jobId, data);

        if (data.status === 'completed' || data.status === 'failed') {
          if (intervalRef.current) clearInterval(intervalRef.current);

          // Fire toast only once per job completion
          if (!notifiedRef.current) {
            notifiedRef.current = true;
            if (data.status === 'completed') {
              toast.success(
                'Job completed',
                `${data.total_prompts} prompt${data.total_prompts === 1 ? '' : 's'} processed`,
              );
            } else {
              toast.error('Job failed', data.error ?? 'An unknown error occurred');
            }
          }
        }
      } catch {
        // Silently retry on next interval
      }
    };

    poll();
    intervalRef.current = setInterval(poll, JOB_POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, status, updateJob]);
}
