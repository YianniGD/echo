'use client';
import React from 'react';
import ActionButton from '@/components/echo/ActionButton';
import { 
  Clipboard,
  Calendar as PlannerIcon,
  MinusCircle,
  Edit3,
  Home,
  Sunrise,
  Waves,
  Calendar as CalendarPageIcon,
  User,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { View } from '@/lib/types';

interface DesktopSidebarProps {
  onNavigateToView: (view: View) => void;
  currentView: View;
}

const mainNavItems: { label: string; view: View; icon: React.ReactNode; 'aria-label': string }[] = [
  { label: 'Dashboard', view: 'dashboard', icon: <Home className="w-5 h-5" />, 'aria-label': 'Navigate to Dashboard' },
  { label: 'Journal', view: 'journal', icon: <Edit3 className="w-5 h-5" />, 'aria-label': 'Navigate to Journal page' },
  { label: 'Goal Tracker', view: 'planner', icon: <PlannerIcon className="w-5 h-5" />, 'aria-label': 'Navigate to Goal Tracker page' },
  { label: 'Calendar', view: 'calendar', icon: <CalendarPageIcon className="w-5 h-5" />, 'aria-label': 'Navigate to Calendar page' },
  { label: 'Thought Record', view: 'thoughtRecord', icon: <Clipboard className="w-5 h-5" />, 'aria-label': 'Navigate to Thought Record page' },
  { label: 'Affirmations', view: 'affirmations', icon: <Sunrise className="w-5 h-5" />, 'aria-label': 'Navigate to Affirmations page'},
  { label: 'Med Tracker', view: 'medication', icon: <MinusCircle className="w-5 h-5 transform rotate-90" />, 'aria-label': 'Navigate to Med Tracker page' },
];

const secondaryNavItems: { label: string; view: View; icon: React.ReactNode; 'aria-label': string }[] = [
    { label: 'Profile', view: 'profile', icon: <User className="w-5 h-5" />, 'aria-label': 'Navigate to Profile Page' },
    { label: 'Resources', view: 'resources', icon: <HelpCircle className="w-5 h-5" />, 'aria-label': 'Navigate to Resources Page' },
    { label: 'Settings', view: 'settings', icon: <Settings className="w-5 h-5" />, 'aria-label': 'Navigate to Settings Page' },
];

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  onNavigateToView,
  currentView,
}) => {

  const checkIsActive = (baseView: View) => {
    if (baseView === 'journal') {
        return currentView.startsWith('journal');
    }
    if (baseView === 'thoughtRecord') {
        return currentView.startsWith('thoughtRecord');
    }
    return currentView === baseView;
  }

  const NavItemButton: React.FC<{ 
    item: { label: string; view: View; icon: React.ReactNode; 'aria-label': string };
    isActive?: boolean;
  }> = ({ item, isActive = false }) => (
    <ActionButton
      variant={isActive ? "tonal" : "text"}
      size="md" 
      className={`w-full justify-start px-4 py-4 ${isActive ? 'text-primary bg-primary-container/40' : 'text-surface-on hover:bg-surface-container'}`}
      leadingIcon={item.icon}
      onClick={() => onNavigateToView(item.view)}
      aria-label={item['aria-label']}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="text-sm">{item.label}</span>
    </ActionButton>
  );

  return (
    <aside 
      className="hidden md:flex flex-col fixed top-0 left-0 z-30 w-60 h-full
                 bg-surface-container-low shadow-lg" 
      aria-label="Main navigation"
    >
        <div className="h-20 flex items-center justify-center border-b border-outline-variant">
             {/* This space is for alignment with the top navbar height */}
        </div>
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto mt-4">
        {mainNavItems.map(item => (
          <NavItemButton
            key={item.view}
            item={item}
            isActive={checkIsActive(item.view)}
          />
        ))}
        <hr className="my-2 border-outline-variant" />
        {secondaryNavItems.map(item => (
          <NavItemButton
            key={item.view}
            item={item}
            isActive={checkIsActive(item.view)}
          />
        ))}
      </nav>
            
      <div className="p-4 border-t border-outline-variant">
        <p className="text-label-sm text-center text-surface-on-variant">echo &copy; {new Date().getFullYear()}</p>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
