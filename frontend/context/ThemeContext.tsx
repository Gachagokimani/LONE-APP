'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '@/lib/types';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider - Manages theme state (light/dark mode)
 * DSS Alignment: Dark mode is primary, light mode available for accessibility
 * Persists theme preference to localStorage
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(Theme.DARK);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference') as Theme | null;
    const preferredTheme = savedTheme || Theme.DARK; // Default to DARK

    setThemeState(preferredTheme);

    // Determine actual dark mode state
    if (preferredTheme === Theme.AUTO) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      // Apply system preference to document
      document.documentElement.classList.toggle('dark-mode', prefersDark);
      document.documentElement.classList.toggle('light-mode', !prefersDark);
    } else {
      const isDarkMode = preferredTheme === Theme.DARK;
      setIsDark(isDarkMode);
      // Apply selected theme to document
      document.documentElement.classList.toggle('dark-mode', isDarkMode);
      document.documentElement.classList.toggle('light-mode', !isDarkMode);
    }

    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme-preference', newTheme);

    let newIsDark = true;

    if (newTheme === Theme.AUTO) {
      newIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      newIsDark = newTheme === Theme.DARK;
    }

    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark-mode', newIsDark);
    document.documentElement.classList.toggle('light-mode', !newIsDark);
  };

  const toggleDarkMode = () => {
    const newTheme = isDark ? Theme.LIGHT : Theme.DARK;
    setTheme(newTheme);
  };

  // Only render after mounting to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  const value: ThemeContextType = {
    theme,
    isDark,
    setTheme,
    toggleDarkMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * useTheme hook - Access theme context anywhere in the app
 * Usage: const { theme, isDark, setTheme, toggleDarkMode } = useTheme();
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
