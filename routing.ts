
import React from 'react';

import DashboardPage from './pages/DashboardPage';
import JournalPage from './pages/JournalPage';
import DailyPlannerPage from './pages/DailyPlannerPage';
import CalendarPage from './pages/CalendarPage';
import MedicationPage from './pages/MedicationPage';
import ThoughtRecordPage from './pages/ThoughtRecordPage';
import AffirmationsPage from './pages/AffirmationsPage';
import ResourcesPage from './pages/ResourcesPage';
import ProfilePage from './pages/ProfilePage';

import { HomeIcon } from './components/icons/HomeIcon';
import { BookOpenCheckIcon } from './components/icons/BookOpenCheckIcon';
import { CalendarDaysIcon } from './components/icons/CalendarDaysIcon';
import { PillIcon } from './components/icons/PillIcon';
import { LightbulbIcon } from './components/icons/LightbulbIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { LifeBuoyIcon } from './components/icons/LifeBuoyIcon';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { PlusCircleIcon } from './components/icons/PlusCircleIcon';
import { ClipboardListIcon } from './components/icons/ClipboardListIcon';


export interface RouteDefinition {
  path: string;
  name: string;
  component: React.FC;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const routes: RouteDefinition[] = [
  { path: '#/dashboard', name: 'Dashboard', component: DashboardPage, icon: HomeIcon },
  { path: '#/journal', name: 'Journal', component: JournalPage, icon: BookOpenCheckIcon },
  { path: '#/planner', name: 'Daily Planner', component: DailyPlannerPage, icon: ClipboardListIcon },
  { path: '#/calendar', name: 'Calendar', component: CalendarPage, icon: CalendarDaysIcon },
  { path: '#/medication', name: 'Medication', component: MedicationPage, icon: PillIcon },
  { path: '#/thoughts', name: 'Thought Record', component: ThoughtRecordPage, icon: LightbulbIcon },
  { path: '#/affirmations', name: 'Affirmations', component: AffirmationsPage, icon: SparklesIcon },
  { path: '#/resources', name: 'Resources', component: ResourcesPage, icon: LifeBuoyIcon },
  { path: '#/profile', name: 'Profile', component: ProfilePage, icon: SettingsIcon },
];