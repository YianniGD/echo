
import React from 'react';

// A flexible card component
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md ${className}`}>
    {children}
  </div>
);

// Card Header
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`pb-4 mb-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

// Card Content
export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

// Card Title
export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h4 className={`text-xl font-bold text-gray-800 dark:text-white ${className}`}>
    {children}
  </h4>
);
