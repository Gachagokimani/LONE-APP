'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MonopolyAvatarProps {
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 48,
  md: 56,
  lg: 64,
};

/**
 * MonopolyAvatar Component
 * Monopoly Rich Uncle Pennybags-inspired SVG avatar that triggers the chat modal
 * Displays as a floating button with hover animation
 */
export default function MonopolyAvatar({
  onClick,
  className = '',
  size = 'md',
}: MonopolyAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const dimension = sizeMap[size];

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`monopoly-avatar-btn ${className}`}
      aria-label="Open chat assistant"
      title="Chat with AI Agent"
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="monopoly-avatar-svg"
      >
        {/* Head */}
        <circle cx="50" cy="35" r="25" fill="#F4D9B5" stroke="#2D2D44" strokeWidth="2" />

        {/* Top Hat - Black */}
        <rect x="28" y="8" width="44" height="12" fill="#0A0A0F" stroke="#2D2D44" strokeWidth="2" />
        {/* Hat band - Red */}
        <rect x="28" y="18" width="44" height="3" fill="#DC2626" stroke="#2D2D44" strokeWidth="1" />
        {/* Hat shine */}
        <ellipse cx="50" cy="12" rx="18" ry="3" fill="#3A3A52" opacity="0.3" />

        {/* Eyes */}
        <circle cx="40" cy="32" r="3" fill="#333333" />
        <circle cx="60" cy="32" r="3" fill="#333333" />
        {/* Eye highlights */}
        <circle cx="41" cy="31" r="1" fill="#FFFFFF" />
        <circle cx="61" cy="31" r="1" fill="#FFFFFF" />

        {/* Monocle - Left eye */}
        <circle cx="40" cy="32" r="6" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
        <line x1="35" y1="32" x2="32" y2="35" stroke="#F59E0B" strokeWidth="1.5" />

        {/* Mustache - Distinguished */}
        <path
          d="M 50 40 Q 42 37 35 39 Q 35 41 50 42 Q 65 41 65 39 Q 58 37 50 40"
          fill="#8B7355"
          stroke="#2D2D44"
          strokeWidth="1"
        />

        {/* Nose */}
        <path d="M 50 36 L 49 40 L 51 40" fill="#D4A574" stroke="#2D2D44" strokeWidth="0.5" />

        {/* Mouth - Smile */}
        <path
          d="M 45 45 Q 50 48 55 45"
          stroke="#DC2626"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Cigar (optional detail) */}
        <ellipse cx="62" cy="46" rx="8" ry="3" fill="#8B6914" stroke="#2D2D44" strokeWidth="1" />
        <ellipse cx="68" cy="45" rx="3" ry="2" fill="#F59E0B" opacity="0.6" />

        {/* Body/Suit - Red*/}
        <rect x="20" y="60" width="60" height="35" fill="#DC2626" stroke="#2D2D44" strokeWidth="2" rx="2" />

        {/* Shirt front - White */}
        <rect x="38" y="62" width="24" height="28" fill="#F8FAFC" stroke="#2D2D44" strokeWidth="1" />

        {/* Bow Tie - Crimson and Gold */}
        <ellipse cx="44" cy="64" rx="5" ry="4" fill="#DC2626" stroke="#2D2D44" strokeWidth="1" />
        <ellipse cx="56" cy="64" rx="5" ry="4" fill="#DC2626" stroke="#2D2D44" strokeWidth="1" />
        <circle cx="50" cy="64" r="2" fill="#F59E0B" />

        {/* Vest buttons */}
        <circle cx="50" cy="74" r="1.5" fill="#F59E0B" />
        <circle cx="50" cy="82" r="1.5" fill="#F59E0B" />

        {/* Arms/Hands (simplified) */}
        <rect x="15" y="65" width="8" height="20" fill="#F4D9B5" stroke="#2D2D44" strokeWidth="1.5" rx="4" />
        <rect x="77" y="65" width="8" height="20" fill="#F4D9B5" stroke="#2D2D44" strokeWidth="1.5" rx="4" />

        {/* Hands holding cane */}
        <circle cx="17" cy="87" r="3" fill="#F4D9B5" stroke="#2D2D44" strokeWidth="1" />
        <circle cx="83" cy="87" r="3" fill="#F4D9B5" stroke="#2D2D44" strokeWidth="1" />

        {/* Walking Cane */}
        <line x1="19" y1="85" x2="22" y2="60" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
        <circle cx="22" cy="58" r="3" fill="#F59E0B" stroke="#2D2D44" strokeWidth="1" />

        {/* Animated glow effect background */}
        {isHovered && (
          <motion.circle
            cx="50"
            cy="50"
            r="55"
            fill="none"
            stroke="#DC2626"
            strokeWidth="2"
            opacity="0.3"
            initial={{ r: 50 }}
            animate={{ r: 60, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </svg>

      {/* Message badge indicator */}
      <motion.div
        className="monopoly-badge"
        initial={{ scale: 0 }}
        animate={isHovered ? { scale: 1 } : { scale: 0 }}
        transition={{ type: 'spring', damping: 12 }}
      >
        💬
      </motion.div>
    </motion.button>
  );
}
