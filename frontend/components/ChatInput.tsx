'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from './ui/Icon';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  suggestedPrompts?: string[];
}

/**
 * ChatInput Component - Reusable Chat Message Input
 * Handles user input, suggestions, and message submission
 * Integrates with n8n webhook triggers for agentic workflows
 */
export default function ChatInput({
  onSendMessage,
  isLoading = false,
  placeholder = 'Ask about loans, customers, or create new records...',
  className = '',
  showSuggestions = true,
  suggestedPrompts = [
    'Create a new loan application',
    'Check pending customer applications',
    'Analyze loan performance metrics',
    'Generate loan recommendations',
  ],
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      setShowSuggestionsDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestionsDropdown(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`chat-input-container ${className}`}>
      <div className="chat-input-wrapper">
        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (showSuggestions && e.target.value.length > 0) {
                setShowSuggestionsDropdown(true);
              } else {
                setShowSuggestionsDropdown(false);
              }
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (showSuggestions && input.length > 0) {
                setShowSuggestionsDropdown(true);
              }
            }}
            placeholder={placeholder}
            disabled={isLoading}
            className="chat-input-field"
            rows={1}
          />

          {/* Suggestions Dropdown */}
          {showSuggestionsDropdown && showSuggestions && input.length > 0 && (
            <motion.div
              className="chat-suggestions-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {suggestedPrompts
                .filter((p) => p.toLowerCase().includes(input.toLowerCase()))
                .slice(0, 3)
                .map((suggestion, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="chat-suggestion-item"
                    whileHover={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}
                  >
                    <Icon name="Lightbulb" size={16} color="orange" />
                    <span>{suggestion}</span>
                  </motion.button>
                ))}
            </motion.div>
          )}
        </div>

        {/* Send Button */}
        <motion.button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="chat-send-btn"
          whileHover={!isLoading ? { scale: 1.05 } : {}}
          whileTap={!isLoading ? { scale: 0.95 } : {}}
          title="Send message (Shift+Enter for new line)"
        >
          {isLoading ? (
            <Icon name="Loader" size={20} animate="spin" color="primary" />
          ) : (
            <Icon
              name="Send"
              size={20}
              color={input.trim() ? 'crimson' : 'muted'}
              animate={input.trim() ? 'bounce' : undefined}
            />
          )}
        </motion.button>
      </div>

      {/* Quick Actions */}
      {showSuggestions && !showSuggestionsDropdown && input.length === 0 && (
        <motion.div
          className="chat-quick-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-xs text-muted">Suggested actions:</span>
          <div className="quick-action-buttons">
            {suggestedPrompts.map((prompt, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleSuggestionClick(prompt)}
                className="quick-action-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon name="Zap" size={14} color="orange" />
                {prompt.split(' ').slice(0, 2).join(' ')}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
