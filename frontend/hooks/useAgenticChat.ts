'use client';

import { useState, useCallback } from 'react';
import { sendToN8nWebhookWithRetry } from '@/lib/n8nWebhook';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  thinking?: string;
  actions?: {
    type: string;
    data: any;
  }[];
}

interface UseAgenticChatOptions {
  initialMessages?: Message[];
  maxRetries?: number;
}

/**
 * useAgenticChat Hook
 * Manages chat state and n8n webhook integration for agentic workflows
 * Provides message history, loading states, and error handling
 */
export function useAgenticChat(options: UseAgenticChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(options.initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    const message: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    return message;
  }, []);

  const sendMessage = useCallback(
    async (userMessage: string, context?: Record<string, any>) => {
      setError(null);
      setIsLoading(true);

      try {
        // Add user message to history
        addMessage('user', userMessage);

        // Get current user context for webhook
        const pageContext = {
          page: typeof window !== 'undefined' ? window.location.pathname : undefined,
          userId: context?.userId,
          ...context,
        };

        // Send to n8n webhook with retry logic
        const response = await sendToN8nWebhookWithRetry(userMessage, pageContext, options.maxRetries);

        if (!response.success) {
          const errorMsg = response.error || 'Failed to get response from agent';
          setError(errorMsg);
          addMessage('assistant', `❌ ${errorMsg}`);
          return;
        }

        // Add assistant response
        const assistantMsg: Message = {
          id: `msg-${Date.now()}-${Math.random()}`,
          role: 'assistant',
          content: response.response || 'Request processed successfully',
          timestamp: new Date(),
          thinking: response.thinking,
          actions: response.actions,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setError(null);
      } catch (err: any) {
        const errorMsg = err.message || 'An unexpected error occurred';
        setError(errorMsg);
        addMessage('assistant', `❌ Error: ${errorMsg}`);
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage, options.maxRetries]
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    addMessage,
    clearHistory,
    clearError,
  };
}
