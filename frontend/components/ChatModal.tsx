'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './ui/Icon';
import ChatInput from './ChatInput';
import { useAgenticChat } from '@/hooks/useAgenticChat';
import Badge from './ui/Badge';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: Record<string, any>;
}

/**
 * ChatModal Component
 * Reusable modal for agentic chat interface
 * Integrates with n8n workflows for contextual requests
 * Displays chat history and agent responses
 */
export default function ChatModal({ isOpen, onClose, context }: ChatModalProps) {
  const { messages, isLoading, error, sendMessage, clearHistory, clearError } = useAgenticChat();
  const [showThinking, setShowThinking] = useState(false);

  const handleSendMessage = async (message: string) => {
    await sendMessage(message, context);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="chat-modal-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="chat-modal-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crimson to-orange flex items-center justify-center">
                  <Icon name="Bot" size={20} color="primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-primary">AI Agent Assistant</h2>
                  <p className="text-xs text-muted">Mkopo Loan Management Workflow Engine</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <motion.button
                    onClick={clearHistory}
                    className="chat-header-btn"
                    title="Clear chat history"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon name="Trash2" size={18} color="muted" />
                  </motion.button>
                )}

                <motion.button
                  onClick={onClose}
                  className="chat-header-btn"
                  title="Close chat"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon name="X" size={20} color="muted" />
                </motion.button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="chat-modal-messages">
              {messages.length === 0 ? (
                <motion.div
                  className="chat-empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-center">
                    <Icon name="MessageCircle" size={48} color="cyan" animate="pulse" />
                    <h3 className="text-lg font-semibold text-primary mt-4">Start a Conversation</h3>
                    <p className="text-sm text-muted mt-2">
                      Ask me about loans, customers, or request any action within Mkopo
                    </p>

                    {/* Quick Start Examples */}
                    <div className="quick-start-tips mt-6 space-y-2">
                      <p className="text-xs text-muted font-semibold">Try asking:</p>
                      <Badge color="sky" className="inline-block text-xs">
                        "Create new loan"
                      </Badge>
                      <Badge color="emerald" className="inline-block text-xs ml-2">
                        "List pending approvals"
                      </Badge>
                      <Badge color="amber" className="inline-block text-xs ml-2">
                        "Analyze KPIs"
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div className="space-y-4" initial="hidden" animate="visible" variants={messageVariants}>
                  {messages.map((message, idx) => (
                    <motion.div
                      key={message.id}
                      className={`chat-message chat-message-${message.role}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-crimson to-orange flex items-center justify-center flex-shrink-0">
                          <Icon name="Bot" size={16} color="primary" />
                        </div>
                      )}

                      <div className={`chat-message-content chat-content-${message.role}`}>
                        <p className="text-sm">{message.content}</p>

                        {/* Show thinking block if available */}
                        {message.thinking && (
                          <motion.div
                            className="mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <button
                              onClick={() => setShowThinking(!showThinking)}
                              className="text-xs text-cyan hover:text-violet transition flex items-center gap-1"
                            >
                              <Icon name="Brain" size={12} />
                              {showThinking ? 'Hide thinking' : 'Show thinking'} ({message.thinking.length} chars)
                            </button>
                            {showThinking && (
                              <div className="mt-2 p-2 bg-surface rounded border border-border text-xs text-muted font-mono">
                                {message.thinking}
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* Show actions if available */}
                        {message.actions && message.actions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs text-muted font-semibold">Suggested Actions:</p>
                            {message.actions.map((action, idx) => (
                              <motion.button
                                key={idx}
                                className="chat-action-btn"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Icon name="Play" size={14} color="orange" />
                                <span className="text-xs">{action.type}</span>
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>

                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-fuchsia flex items-center justify-center flex-shrink-0">
                          <Icon name="User" size={16} color="primary" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <motion.div className="chat-message chat-message-assistant" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-crimson to-orange flex items-center justify-center flex-shrink-0">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                          <Icon name="Loader" size={16} color="primary" />
                        </motion.div>
                      </div>
                      <div className="chat-message-content chat-content-assistant">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-crimson animate-bounce" />
                          <span className="w-2 h-2 rounded-full bg-crimson animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <span className="w-2 h-2 rounded-full bg-crimson animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                className="chat-error-banner"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Icon name="AlertCircle" size={16} color="rose" />
                <span>{error}</span>
                <motion.button
                  onClick={clearError}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon name="X" size={14} color="rose" />
                </motion.button>
              </motion.div>
            )}

            {/* Input Area */}
            <div className="chat-modal-footer">
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                placeholder="Ask anything about your loans or customers..."
                showSuggestions={true}
                suggestedPrompts={[
                  'Create a new loan application',
                  'Check pending customer applications',
                  'Analyze loan performance metrics',
                  'Generate loan recommendations',
                  'View customer credit scores',
                  'Process loan disbursement',
                ]}
              />
            </div>

            {/* Info Footer */}
            <div className="chat-modal-info">
              <p className="text-xs text-muted">
                💡 Tip: You can ask me to perform actions, generate reports, or query data from Mkopo
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
