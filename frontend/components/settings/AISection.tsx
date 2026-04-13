'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface AISectionProps {
  aiChatEnabled?: boolean;
  onToggle?: (enabled: boolean) => Promise<void>;
  isLoading?: boolean;
  canDisableAI?: boolean;
  isAdmin?: boolean;
}

/**
 * AISection Component
 * AI features toggle and settings
 * Allows users to enable/disable AI chat feature
 */
export default function AISection({
  aiChatEnabled = true,
  onToggle = async () => {},
  isLoading = false,
  canDisableAI = true,
  isAdmin = false,
}: AISectionProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleToggleAI = async (enabled: boolean) => {
    try {
      await onToggle(enabled);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Failed to toggle AI feature:', error);
    }
  };

  return (
    <motion.div
      className="settings-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="section-header">
        <Icon name="Brain" size={24} color="cyan" />
        <div>
          <h3 className="section-title">AI Assistant Settings</h3>
          <p className="text-xs text-muted">Manage AI features in your workspace</p>
        </div>
      </div>

      <div className="settings-content">
        <div className="ai-card">
          <div className="ai-card-header">
            <div>
              <div className="ai-header">
                <h4 className="ai-title">AI Chat Assistant</h4>
                <Badge color={aiChatEnabled ? 'emerald' : 'amber'}>
                  {aiChatEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <p className="ai-description">
                Use the AI-powered assistant to help with loan processing, customer analysis, and
                workflow automation. The assistant appears as a chat button on all pages.
              </p>
            </div>
          </div>

          <div className="feature-chip-list">
            {[
              'Intelligent loan recommendations',
              'Customer risk analysis',
              'Automated workflow suggestions',
              'Natural language interface',
            ].map((feature) => (
              <div key={feature} className="feature-chip">
                <Icon name="CheckCircle" size={16} color="emerald" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="action-row">
            {!canDisableAI ? (
              <div className="alert alert-info">
                <Icon name="Lock" size={16} />
                <span>AI features are managed by your administrator</span>
              </div>
            ) : showConfirmDialog ? (
              <div className="confirmation-dialog">
                <div className="dialog-content">
                  <Icon name="AlertTriangle" size={24} color="amber" />
                  <h5 className="text-sm font-semibold mt-2">Disable AI Assistant?</h5>
                  <p className="text-xs text-muted">
                    You won't be able to use the AI chat feature. You can re-enable it anytime.
                  </p>
                </div>
                <div className="dialog-actions">
                  <Button variant="secondary" onClick={() => setShowConfirmDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleToggleAI(false)}
                    isLoading={isLoading}
                  >
                    Disable
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant={aiChatEnabled ? 'danger' : 'success'}
                onClick={() => {
                  if (aiChatEnabled) {
                    setShowConfirmDialog(true);
                  } else {
                    handleToggleAI(true);
                  }
                }}
                isLoading={isLoading}
              >
                <Icon name={aiChatEnabled ? 'Power' : 'Check'} size={18} />
                {aiChatEnabled ? 'Disable AI Chat' : 'Enable AI Chat'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
