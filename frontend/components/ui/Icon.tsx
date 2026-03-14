import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: keyof typeof LucideIcons;
  size?: number;
  className?: string;
  animate?: 'spin' | 'pulse' | 'bounce' | 'spin-slow' | 'spin-fast' | 'ping' | 'wobble' | 'glow';
  color?: 'primary' | 'secondary' | 'tertiary' | 'muted' | 'success' | 'warning' | 'error' | 'info' | 'default';
  strokeWidth?: number;
}

const colorMap: Record<string, string> = {
  primary: 'icon-primary',
  secondary: 'icon-secondary',
  tertiary: 'icon-tertiary',
  muted: 'icon-muted',
  success: 'icon-success',
  warning: 'icon-warning',
  error: 'icon-error',
  info: 'icon-info',
  default: '',
};

export default function Icon({
  name,
  size = 20,
  className = '',
  animate = undefined,
  color = 'default',
  strokeWidth = 1.5,
}: IconProps) {
  const IconComponent = LucideIcons[name] as React.ComponentType<any>;

  if (!IconComponent) {
    return <span className={`icon ${className}`}>?</span>;
  }

  // Map animation types to CSS classes
  const animationClassMap: Record<string, string> = {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    'spin-slow': 'icon-spin-slow',
    'spin-fast': 'icon-spin-fast',
    bounce: 'icon-bounce',
    ping: 'icon-pulse-ring',
    wobble: 'icon-wobble',
    glow: 'animate-glow',
  };

  const animationClass = animate ? animationClassMap[animate] : '';
  const colorClass = colorMap[color];
  const combinedClass = `icon ${animationClass} ${colorClass} ${className}`.trim();

  return (
    <IconComponent
      size={size}
      className={combinedClass}
      strokeWidth={strokeWidth}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    />
  );
}
