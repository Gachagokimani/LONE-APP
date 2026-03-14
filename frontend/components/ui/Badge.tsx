import React, { ReactNode } from 'react';

type BadgeColor =
  | 'crimson'
  | 'orange'
  | 'cyan'
  | 'violet'
  | 'blue'
  | 'emerald'
  | 'lime'
  | 'amber'
  | 'rose'
  | 'fuchsia'
  | 'indigo'
  | 'sky'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

interface BadgeProps {
  children: ReactNode;
  color?: BadgeColor;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
}

export default function Badge({
  children,
  color = 'primary',
  size = 'md',
  className = '',
  title = '',
}: BadgeProps) {
  const colorClass = `badge-${color}`;
  const sizeClass = `badge-${size}`;
  const badgeClass = `badge ${colorClass} ${sizeClass} ${className}`.trim();

  return (
    <span className={badgeClass} title={title}>
      {children}
    </span>
  );
}
