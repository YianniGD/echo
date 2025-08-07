import React from 'react';

interface SelectableChipProps {
  isSelected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}

const SelectableChip: React.FC<SelectableChipProps> = ({ isSelected, onSelect, children }) => {
  return (
    <button
      onClick={onSelect}
      type="button"
      className={`
        px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-200
        ${
          isSelected
            ? 'bg-primary-600 border-primary-600 text-white shadow-md transform scale-105'
            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30'
        }
      `}
    >
      {children}
    </button>
  );
};

export default SelectableChip;
