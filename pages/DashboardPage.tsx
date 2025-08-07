import React from 'react';
import { useJournal } from '../hooks/useJournal';
import { usePlanner } from '../hooks/usePlanner';
import { useMedications } from '../hooks/useMedications';
import { useFavorites } from '../hooks/useFavorites';
import { useThoughtRecords } from '../hooks/useThoughtRecords';
import { useStrengths } from '../hooks/useStrengths';

import DashboardWelcomeWidget from '../components/dashboard/DashboardWelcomeWidget';
import AffirmationsWidget from '../components/dashboard/AffirmationsWidget';
import PlannerWidget from '../components/dashboard/PlannerWidget';
import MedicationWidget from '../components/dashboard/MedicationWidget';
import CopingMechanismWidget from '../components/dashboard/CopingMechanismWidget';
import RecentJournalWidget from '../components/dashboard/RecentJournalWidget';
import RecentThoughtRecordWidget from '../components/dashboard/RecentThoughtRecordWidget';
import StrengthsWidget from '../components/dashboard/StrengthsWidget';

const DashboardPage: React.FC = () => {
  const { entries } = useJournal();
  const { todaysTasks, addTask } = usePlanner();
  const { medications, bundles, logTaken, isLoggedToday } = useMedications();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { records } = useThoughtRecords();
  const { strengths } = useStrengths();

  const mostRecentEntry = entries.length > 0 ? entries[0] : null;
  const mostRecentRecord = records.length > 0 ? records[0] : null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
          Dashboard
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Your daily overview and quick actions.
        </p>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardWelcomeWidget className="lg:col-span-4" />
        <PlannerWidget
          tasks={todaysTasks}
          onAddTask={addTask}
          className="md:col-span-2 lg:col-span-2"
        />
        <MedicationWidget 
          medications={medications}
          bundles={bundles}
          onLogTaken={logTaken}
          isLoggedToday={isLoggedToday}
          className="md:col-span-2 lg:col-span-2"
        />
        <AffirmationsWidget
          favorites={favorites}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          className="md:col-span-1 lg:col-span-2"
        />
        <StrengthsWidget strengths={strengths} className="md:col-span-1 lg:col-span-2" />
        <RecentJournalWidget entry={mostRecentEntry} />
        <RecentThoughtRecordWidget record={mostRecentRecord} />
        <CopingMechanismWidget className="lg:col-span-2" />
      </main>
    </div>
  );
};

export default DashboardPage;
