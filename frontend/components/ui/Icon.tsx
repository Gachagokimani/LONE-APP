import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: keyof typeof LucideIcons;
  size?: number;
  className?: string;
  animate?: 'spin' | 'pulse';
  color?: 'primary' | 'secondary' | 'tertiary' | 'muted' | 'success' | 'warning' | 'error' | 'default';
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

  const animationClass = animate ? `animate-${animate}` : '';
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
