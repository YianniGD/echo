'use client';
import React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode; 
  variant?: ButtonVariant;
  size?: ButtonSize;
  isIconOnly?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const getVariantStyles = (variant: ButtonVariant): string => {
  switch (variant) {
    case 'filled':
      return 'bg-primary text-primary-foreground shadow-sm';
    case 'tonal':
      return 'bg-secondary-container text-on-secondary-container shadow-sm';
    case 'outlined':
      return 'border border-outline bg-transparent text-primary hover:bg-primary-container/20';
    case 'text':
      return 'bg-transparent text-primary shadow-none';
    case 'elevated':
      return 'bg-surface-container-low shadow-md text-primary';
    default:
      return '';
  }
};

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = 'filled',
  size = 'md',
  className = '',
  isIconOnly = false,
  leadingIcon,
  trailingIcon,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
    dark:focus-visible:ring-offset-surface-dark
    disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
    transition-all duration-500 ease-in-out 
    hover:brightness-110 active:brightness-90
    dark:hover:brightness-125 dark:active:brightness-90
  `;

  const sizeStyles: Record<ButtonSize, string> = {
    sm: `h-8 ${isIconOnly ? 'w-8 px-0' : 'text-label-md px-3'} rounded-full`,
    md: `h-10 ${isIconOnly ? 'w-10 px-0' : 'text-label-lg px-6'} rounded-full`,
    lg: `h-12 ${isIconOnly ? 'w-12 px-0' : 'text-label-lg px-8'} rounded-full`,
  };

  const iconSizeStyles: Record<ButtonSize, string> = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const renderIcon = (iconNode: React.ReactNode) => {
    if (React.isValidElement(iconNode)) {
      const currentProps = iconNode.props as { className?: string; [key: string]: any };
      const originalClassName = currentProps.className || '';
      // Consistently apply size classes. `cn` handles merging/overriding.
      const newClassName = cn(originalClassName, iconSizeStyles[size]);
      
      return React.cloneElement(iconNode, { className: newClassName });
    }
    return iconNode;
  };
  
  return (
    <button
      className={cn(baseStyles, sizeStyles[size], getVariantStyles(variant), className)}
      {...props}
    >
      {isIconOnly ? (
        // For icon-only buttons, render the leadingIcon or children, but not both.
        // This makes the component more robust to different usage patterns.
        renderIcon(leadingIcon || children)
      ) : (
        // For buttons with text
        <>
          {leadingIcon && (
            <span className="mr-2">
              {renderIcon(leadingIcon)}
            </span>
          )}
          {children}
          {trailingIcon && (
            <span className="ml-2">
               {renderIcon(trailingIcon)}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default ActionButton;
