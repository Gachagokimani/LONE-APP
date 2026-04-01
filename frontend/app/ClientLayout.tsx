'use client';

import React, { useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import MonopolyAvatar from '@/components/MonopolyAvatar';
import ChatModal from '@/components/ChatModal';
import Icon from '@/components/ui/Icon';
import { useAuth } from '@/context/AuthContext';

/**
 * Navigation Component
 * Extracted for use within AuthProvider context
 */
function Navigation() {
  const { user } = useAuth();

  return (
    <nav className="bg-surface border-b border-border p-4 sticky top-0 z-50">
      <div className="container flex-between">
        <h1 className="text-2xl font-bold text-accent-primary">
          🇰🇪 Mkopo
        </h1>
        <div className="flex items-center gap-6">
          <a href="/dashboard" className="text-muted hover:text-accent-primary transition">
            Dashboard
          </a>
          <a href="/loans" className="text-muted hover:text-accent-primary transition">
            Loans
          </a>
          <a href="/customers" className="text-muted hover:text-accent-primary transition">
            Customers
          </a>
          {user && (
            <a href="/settings" className="flex items-center gap-2 text-muted hover:text-accent-primary transition">
              <Icon name="Settings" size={18} />
              <span>Settings</span>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

/**
 * ClientContent Component
 * Main content wrapper within providers
 */
function ClientContent({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="container">{children}</main>

      {/* Monopoly Avatar - Floating Chat Trigger */}
      <MonopolyAvatar onClick={() => setIsChatOpen(true)} size="md" />

      {/* Chat Modal */}
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} context={{ page: typeof window !== 'undefined' ? window.location.pathname : undefined }} />
    </>
  );
}

/**
 * ClientLayout Component
 * Root wrapper providing authentication and theme contexts
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ClientContent>{children}</ClientContent>
      </ThemeProvider>
    </AuthProvider>
  );
}
