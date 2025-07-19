'use client';
import React from 'react';
import ActionButton from '@/components/echo/ActionButton';

interface SegmentedControlOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center bg-surface-container-low p-1 rounded-full space-x-1 ${className}`}>
      {options.map(option => (
        <ActionButton
          key={option.value}
          onClick={() => onChange(option.value)}
          variant={value === option.value ? 'tonal' : 'text'}
          size="md"
          className={`!rounded-full transition-all duration-300 ${
            value === option.value
              ? 'bg-secondary-container text-on-secondary-container shadow-sm'
              : 'text-surface-on-variant hover:bg-black/5'
          }`}
          aria-pressed={value === option.value}
        >
          {option.label}
        </ActionButton>
      ))}
    </div>
  );
};

export default SegmentedControl;
