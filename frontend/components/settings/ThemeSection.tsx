'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/Icon';
import { Theme } from '@/lib/types';

interface ThemeSectionProps {
  currentTheme: Theme;
  isDark: boolean;
  onThemeChange: (theme: Theme) => void;
}

/**
 * ThemeSection Component - DSS Aligned
 * Theme selection with visual preview and semantic styling
 * Follows DSS: Dark theme primary, semantic class names, proper icon usage
 */
export default function ThemeSection({
  currentTheme,
  isDark,
  onThemeChange,
}: ThemeSectionProps) {
  const themes: Array<{ value: Theme; label: string; icon: string; description: string; color: 'violet' | 'sky' | 'indigo' }> = [
    {
      value: Theme.DARK,
      label: 'Dark Mode',
      icon: 'Moon',
      description: 'Recommended - Reduced eye strain, premium appearance',
      color: 'violet',
    },
    {
      value: Theme.LIGHT,
      label: 'Light Mode',
      icon: 'Sun',
      description: 'Alternative - For bright environments',
      color: 'sky',
    },
    {
      value: Theme.AUTO,
      label: 'Auto (System)',
      icon: 'Monitor',
      description: 'Follow device settings preference',
      color: 'indigo',
    },
  ];

  return (
    <motion.div
      className="settings-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="section-header">
        <Icon name="Palette" size={24} color="violet" animate="spin-slow" />
        <div>
          <h3 className="section-title">Appearance Settings</h3>
          <p className="text-xs text-muted">Customize your interface appearance</p>
        </div>
      </div>

      <div className="settings-content">
        {/* Theme Selection Cards */}
        <div className="theme-options">
          {themes.map((themeOption) => {
            const isSelected = currentTheme === themeOption.value;
            return (
              <motion.button
                key={themeOption.value}
                onClick={() => onThemeChange(themeOption.value)}
                className={`theme-card ${isSelected ? 'active' : ''}`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Icon */}
                <div className="theme-card-icon">
                  <Icon
                    name={themeOption.icon as any}
                    size={32}
                    color={isSelected ? themeOption.color : 'muted'}
                    animate={isSelected ? 'glow' : undefined}
                  />
                </div>

                {/* Label */}
                <h4 className="theme-card-label">{themeOption.label}</h4>

                {/* Description */}
                <p className="theme-card-description">{themeOption.description}</p>

                {/* Active Indicator Badge */}
                {isSelected && (
                  <motion.div
                    className="theme-card-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <Icon name="Check" size={16} color="text" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Current Theme Info */}
        <motion.div
          className="theme-info-box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Icon name="Info" size={20} color="blue" />
          <div>
            <h5 className="text-sm font-semibold">Current: {currentTheme || 'Auto'}</h5>
            <p className="text-xs text-muted">
              {isDark
                ? 'Dark mode provides better readability and reduces eye strain'
                : 'Light mode is useful in bright environments'}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
