'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Skeleton from '@/components/ui/Skeleton';

// Lazy load the theme hook to avoid SSR issues
const ThemeAwareContent = dynamic(() => import('./SettingsContent'), {
  ssr: false,
  loading: () => <SettingsSkeleton />,
});

/**
 * Loading skeleton while component hydrates
 */
function SettingsSkeleton() {
  return (
    <motion.div
      className="settings-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="settings-header">
        <Skeleton height="2rem" className="mb-2" />
        <Skeleton height="1rem" />
      </div>
      <div className="settings-container">
        <Skeleton height="2.5rem" className="mb-4" />
        <Skeleton height="18.75rem" />
      </div>
    </motion.div>
  );
}




/**
 * Main SettingsPage Component
 * Server wrapper that loads theme-aware content on client-side only
 */
export default function SettingsPage() {
  return <ThemeAwareContent />;
}
