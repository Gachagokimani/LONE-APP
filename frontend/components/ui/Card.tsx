import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({
  children,
  className = '',
  hoverable = true,
  variant = 'default',
}: CardProps) {
  const baseClass = 'card';
  const variantClass = variant === 'elevated' ? 'shadow-lg' : variant === 'outlined' ? 'border-2 border-primary' : '';
  const hoverClass = hoverable ? 'hover:shadow-lg hover:border-primary transition-all duration-300' : '';

  const combinedClass = `${baseClass} ${hoverClass} ${variantClass} ${className}`.trim();

  return <div className={combinedClass}>{children}</div>;
}
