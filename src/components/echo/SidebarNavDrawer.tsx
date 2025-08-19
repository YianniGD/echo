
'use client';
import React, { useState, useEffect } from 'react';
import ActionButton from '@/components/echo/ActionButton';
import { 
  Clipboard,
  Calendar as PlannerIcon,
  MinusCircle, 
  X,
  Cloud,
  Edit3, 
  Home,
  Sunrise,
  User,
  HelpCircle,
} from 'lucide-react';
import { View } from '@/lib/types';

interface SidebarNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToView: (view: View) => void;
  currentView: View;
}

const mainNavItems: { label: string; view: View; icon: React.ReactNode; 'aria-label': string }[] = [
  { label: 'Dashboard', view: 'dashboard', icon: <Home className="w-6 h-6" />, 'aria-label': 'Navigate to Dashboard' },
  { label: 'Journal', view: 'journal', icon: <Edit3 className="w-6 h-6" />, 'aria-label': 'Navigate to Journal page' },
  { label: 'Planner', view: 'planner', icon: <PlannerIcon className="w-6 h-6" />, 'aria-label': 'Navigate to Planner and Calendar page' },
  { label: 'Thought Record', view: 'thoughtRecord', icon: <Clipboard className="w-6 h-6" />, 'aria-label': 'Navigate to Thought Record page' },
  { label: 'Affirmations', view: 'affirmations', icon: <Sunrise className="w-6 h-6" />, 'aria-label': 'Navigate to Affirmations page'},
  { label: 'Med Tracker', view: 'medication', icon: <MinusCircle className="w-6 h-6 transform rotate-90" />, 'aria-label': 'Navigate to Med Tracker page' },
  { label: 'Resources', view: 'resources', icon: <HelpCircle className="w-6 h-6" />, 'aria-label': 'Navigate to Resources Page' },
];

const secondaryNavItems: { label: string; view: View; icon: React.ReactNode; 'aria-label': string }[] = [
    { label: 'Profile & Settings', view: 'profile', icon: <User className="w-6 h-6" />, 'aria-label': 'Navigate to Profile & Settings Page' },
];


const SidebarNavDrawer: React.FC<SidebarNavDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToView,
  currentView,
}) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [applyTransitionState, setApplyTransitionState] = useState(false);

  useEffect(() => {
    let frameId1: number;
    let frameId2: number;
    let timeoutId: number;

    if (isOpen) {
      setIsRendered(true); 
      frameId1 = requestAnimationFrame(() => {
        frameId2 = requestAnimationFrame(() => {
          setApplyTransitionState(true);
        });
      });
    } else {
      setApplyTransitionState(false); 
      timeoutId = window.setTimeout(() => {
        setIsRendered(false);
      }, 1000); 
    }
    return () => {
      cancelAnimationFrame(frameId1);
      cancelAnimationFrame(frameId2);
      clearTimeout(timeoutId);
    };
  }, [isOpen]);

  if (!isRendered) return null;

  const checkIsActive = (baseView: View) => {
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

  const NavItemButton: React.FC<{ 
    item: { label: string; view: View; icon: React.ReactNode; 'aria-label': string };
    isActive: boolean;
  }> = ({ item, isActive }) => (
    <ActionButton
      variant={isActive ? "tonal" : "text"}
      size="lg"
      className={`w-full justify-start ${isActive ? 'text-primary bg-primary-container/30' : 'text-surface-on hover:bg-surface-container'}`}
      leadingIcon={item.icon}
      onClick={() => { onNavigateToView(item.view); onClose(); }}
      aria-label={item['aria-label']}
      aria-current={isActive ? "page" : undefined}
    >
      {item.label}
    </ActionButton>
  );

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`
          fixed inset-0 z-40 bg-scrim/60 backdrop-blur-sm 
          transition-opacity ease-[cubic-bezier(0.16,1,0.3,1)] duration-[1000ms]
          md:hidden 
          ${applyTransitionState && isOpen ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 w-72 sm:w-80 h-full 
          bg-surface-container-highest shadow-xl 
          transform transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] duration-[1000ms]
          md:hidden 
          ${applyTransitionState && isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative flex items-center justify-center p-4 border-b border-outline-variant h-20">
            <div className="flex items-center space-x-2">
              <Cloud className="w-7 h-7 text-primary" />
              <h2 id="sidebar-title" className="font-geologica font-medium text-2xl text-primary">
                echo
              </h2>
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <ActionButton
                variant="text"
                size="sm"
                isIconOnly
                onClick={onClose}
                className="text-surface-on-variant hover:bg-surface-on-variant/10"
                aria-label="Close navigation menu"
              >
                <X className="w-6 w-6" />
              </ActionButton>
            </div>
          </div>

          {/* Main Navigation Links */}
          <nav className="flex-grow p-6 space-y-3 overflow-y-auto">
            {mainNavItems.map(item => (
              <NavItemButton
                key={item.view}
                item={item}
                isActive={checkIsActive(item.view)}
              />
            ))}
            <hr className="my-3 border-outline-variant" />
            {secondaryNavItems.map(item => (
              <NavItemButton
                key={item.view}
                item={item}
                isActive={checkIsActive(item.view)}
              />
            ))}
          </nav>
                    
          {/* Copyright Footer */}
          <div className="p-6 border-t border-outline-variant">
            <p className="text-label-sm text-center text-surface-on-variant">echo &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarNavDrawer;
