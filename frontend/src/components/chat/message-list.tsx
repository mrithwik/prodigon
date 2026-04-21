// ---------------------------------------------------------------------------
// MessageList — scrollable container rendering all messages
// ---------------------------------------------------------------------------

import type { ChatMessage } from '@/stores/chat-store';
import { MessageBubble } from './message-bubble';
import { useAutoScroll } from '@/hooks/use-auto-scroll';

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const { containerRef, sentinelRef } = useAutoScroll([messages]);

  // Announce when streaming starts (for screen readers)
  const isStreaming = messages.some((m) => m.isStreaming);

  return (
    <>
      {/* Screen-reader live region */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="sr-only"
      >
        {isStreaming ? 'Response loading…' : ''}
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={sentinelRef} />
      </div>
    </>
  );
}
