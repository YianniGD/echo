'use client';
import React, { useState, useEffect } from 'react';
import { DailyPlan, PlannerTask, Medication, MedicationGroup, View, ProfileData } from '@/lib/types';
import DashboardWelcomeWidget from '@/components/echo/dashboard/DashboardWelcomeWidget';
import PlannerWidget from '@/components/echo/dashboard/PlannerWidget';
import MedicationWidget from '@/components/echo/dashboard/MedicationWidget';
import CopingMechanismWidget from '@/components/echo/dashboard/CopingMechanismWidget';
import AffirmationsWidget from '@/components/echo/dashboard/AffirmationsWidget';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardPageProps {
  dailyPlans: Record<string, DailyPlan>;
  medications: Medication[];
  medicationGroups: MedicationGroup[];
  profileData: ProfileData;
  onNavigateToView: (view: View) => void;
}

const formatDateToYYYYMMDD = (date: Date): string => date.toISOString().split('T')[0];

const DashboardPage: React.FC<DashboardPageProps> = ({
  dailyPlans,
  medications,
  medicationGroups,
  profileData,
  onNavigateToView,
}) => {
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    // Set the date only on the client-side to avoid hydration mismatch.
    setToday(new Date());
  }, []);

  // Render a loading state or skeletons until the date is set on the client.
  if (!today) {
    return (
      <div className="space-y-8 lg:space-y-10 animate-in fade-in-0 duration-750">
        <Skeleton className="h-[168px] w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          <Skeleton className="h-[230px] w-full rounded-xl" />
          <Skeleton className="h-[230px] w-full rounded-xl" />
          <Skeleton className="h-[180px] w-full rounded-xl" />
          <Skeleton className="h-[180px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const { copingMechanisms, dashboardWidgets, favoriteAffirmations } = profileData;
  const formattedToday = formatDateToYYYYMMDD(today);
  const todaysPlan = dailyPlans[formattedToday];
  
  const todaysGoals: PlannerTask[] = todaysPlan?.goals?.filter(goal => !goal.completed).slice(0, 3) || [];
  const totalGoalsToday = todaysPlan?.goals?.length || 0;
  const completedGoalsToday = todaysPlan?.goals?.filter(g => g.completed).length || 0;

  return (
    <div className="space-y-8 lg:space-y-10 animate-in fade-in-0 duration-750">
      <DashboardWelcomeWidget />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {dashboardWidgets?.planner && (
          <PlannerWidget
            todaysGoals={todaysGoals}
            selectedDate={today}
            onNavigate={onNavigateToView}
            totalGoalsToday={totalGoalsToday}
            completedGoalsToday={completedGoalsToday}
          />
        )}
        {dashboardWidgets?.affirmations && (
          <AffirmationsWidget
            favoriteAffirmations={favoriteAffirmations}
            onNavigate={onNavigateToView}
          />
        )}
        {dashboardWidgets?.medication && (
          <MedicationWidget
            medicationsCount={medications.length}
            medicationGroupsCount={medicationGroups.length}
            onNavigate={onNavigateToView}
          />
        )}
        {dashboardWidgets?.copingMechanisms && (
          <CopingMechanismWidget
              copingMechanisms={copingMechanisms}
              onNavigate={onNavigateToView}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
