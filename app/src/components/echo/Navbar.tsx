
'use client';
import React from 'react';
import { 
  Cloud, 
  Menu, 
  User, 
  HelpCircle,
} from 'lucide-react';
import ActionButton from '@/components/echo/ActionButton';
import { View } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onToggleDrawer: () => void;
  onNavigateToView: (view: View) => void;
  currentView: View;
  desktopAudioPlayer?: React.ReactNode;
}

const mainNavItems: { label: string; view: View; 'aria-label': string }[] = [
  { label: 'Dashboard', view: 'dashboard', 'aria-label': 'Navigate to Dashboard' },
  { label: 'Journal', view: 'journal', 'aria-label': 'Navigate to Journal page' },
  { label: 'Planner', view: 'planner', 'aria-label': 'Navigate to Planner and Calendar page' },
  { label: 'Thought Record', view: 'thoughtRecord', 'aria-label': 'Navigate to Thought Record page' },
  { label: 'Affirmations', view: 'affirmations', 'aria-label': 'Navigate to Affirmations page'},
  { label: 'Med Tracker', view: 'medication', 'aria-label': 'Navigate to Med Tracker page' },
  { label: 'Resources', view: 'resources', 'aria-label': 'Navigate to Resources Page' },
];

const secondaryNavItems: { label: string; view: View; icon: React.ReactNode; 'aria-label': string }[] = [
    { label: 'Profile', view: 'profile', icon: <User className="w-5 h-5" />, 'aria-label': 'Navigate to Profile & Settings Page' },
];

const checkIsActive = (currentView: View, baseView: View) => {
    if (baseView === 'journal') {
        return currentView.startsWith('journal');
    }
    if (baseView === 'thoughtRecord') {
        return currentView.startsWith('thoughtRecord');
    }
    if (baseView === 'resources') {
        return currentView.startsWith('resources') || currentView === 'understanding-cbt' || currentView === 'crisis-support';
    }
    return currentView === baseView;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onToggleDrawer,
  onNavigateToView,
  currentView,
  desktopAudioPlayer,
}) => {

  const handleLogoClick = () => {
    onNavigateToView('dashboard');
  };

  const handleLogoKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onNavigateToView('dashboard');
    }
  };

  return (
    <nav className="bg-surface-container shadow-md sticky top-0 z-40 h-20">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
        {/* Left side: Hamburger (mobile) and Logo */}
        <div className="flex items-center gap-2">
          <div className="md:hidden"> 
            <ActionButton
              onClick={onToggleDrawer}
              variant="text"
              size="md"
              isIconOnly={true}
              title="Open navigation menu"
              aria-label="Open navigation menu"
              className="text-primary"
              leadingIcon={<Menu className="w-6 h-6" />} 
            />
          </div>
          <div 
            className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-opacity duration-200 ease-in-out hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
            onClick={handleLogoClick}
            onKeyDown={handleLogoKeyDown}
            role="button"
            tabIndex={0}
            aria-label="echo - Navigate to Dashboard"
          >
            <Cloud className="w-7 h-7 text-primary" /> 
            <h1 className="font-geologica font-medium text-2xl text-primary hidden sm:block"> 
              echo
            </h1>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center h-full gap-4">
            {mainNavItems.map((item) => {
                const isActive = checkIsActive(currentView, item.view);
                return (
                     <button
                        key={item.view}
                        onClick={() => onNavigateToView(item.view)}
                        aria-label={item['aria-label']}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                            "h-full inline-flex items-center px-3 border-b-2 text-sm font-medium transition-colors duration-200",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-background",
                            isActive
                                ? 'border-primary text-primary'
                                : 'border-transparent text-surface-on-variant hover:text-primary'
                        )}
                    >
                      {item.label}
                    </button>
                )
            })}
        </div>
        
        {/* Right side: Audio Player and User/Settings icons */}
        <div className="flex items-center space-x-2">
            {desktopAudioPlayer}
            {/* Desktop secondary nav */}
            <div className="hidden md:flex items-center gap-1">
                <div className="h-6 w-px bg-outline-variant mx-2" />
                {secondaryNavItems.map((item) => {
                    const isActive = checkIsActive(currentView, item.view);
                    return (
                        <ActionButton
                            key={item.view}
                            variant="text"
                            size="md"
                            isIconOnly
                            title={item.label}
                            onClick={() => onNavigateToView(item.view)}
                            className={cn(
                                'text-surface-on-variant hover:bg-surface-on-variant/10',
                                isActive && 'text-primary bg-primary-container/40'
                            )}
                            aria-label={item['aria-label']}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {item.icon}
                        </ActionButton>
                    )
                })}
            </div>
            {/* Mobile user nav */}
            <div className="md:hidden">
                <ActionButton
                    onClick={() => onNavigateToView('profile')}
                    variant="text"
                    size="md"
                    isIconOnly={true}
                    title="View Profile"
                    aria-label="View your profile"
                    className="text-primary"
                    leadingIcon={<User className="w-6 h-6" />}
                />
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
