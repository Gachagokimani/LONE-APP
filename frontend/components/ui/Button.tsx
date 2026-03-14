import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import Icon from './Icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  fullWidth = false,
  icon = undefined,
  iconPosition = 'left',
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';

  const combinedClass = `btn ${variantClass} ${sizeClass} ${widthClass} ${disabledClass} ${className}`.trim();

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 20;
  const renderIcon = () => icon && !isLoading ? (
    <Icon name={icon as any} size={iconSize} color="default" />
  ) : null;

  return (
    <button
      className={combinedClass}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Icon name="Loader" size={iconSize} animate="spin" color="default" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {iconPosition === 'left' && renderIcon()}
          <span>{children}</span>
          {iconPosition === 'right' && renderIcon()}
        </>
      )}
    </button>
  );
}
