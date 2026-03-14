'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { auth } from '@/lib/auth';
import Icon from '@/components/ui/Icon';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isDev = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
    
    // In dev mode, always go to dashboard
    if (isDev) {
      router.push('/dashboard');
    } else if (auth.isAuthenticated()) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <motion.div
      className="flex-center min-h-screen bg-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Icon name="Loader2" size={48} color="primary" />
        </motion.div>
        <p className="text-text-muted text-lg">Redirecting...</p>
      </div>
    </motion.div>
  );
}

