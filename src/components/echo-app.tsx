
'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { JournalEntry, DailyPlan, WeeklyPlannerData, ThoughtRecord, ThoughtRecordData, Medication, MedicationLogEntry, MedicationGroup, CalendarEvent, ProfileData, View, Theme, Palette, CopingMechanism } from '@/lib/types';
import { LOCAL_STORAGE_KEY_THEME } from '@/lib/constants';
import { 
  loadEntries, 
  saveEntries, 
  downloadJournalData,
  loadThoughtRecords,
  saveThoughtRecords,
  loadDailyPlans,
  saveDailyPlans,
  loadWeeklyPlans, 
  saveWeeklyPlans,
  loadMedications,
  saveMedications,
  loadMedicationLogs,
  saveMedicationLogs,
  loadMedicationGroups,
  saveMedicationGroups,
  loadCalendarEvents,
  saveCalendarEvents,
  loadProfileData,
  saveProfileData,
  loadTheme,
  saveTheme,
} from '@/lib/services/storageService';
import Navbar from '@/components/echo/Navbar';
import SidebarNavDrawer from '@/components/echo/SidebarNavDrawer'; 
import DashboardPage from '@/components/echo/dashboard/DashboardPage';
import JournalInput from '@/components/echo/JournalInput';
import JournalList from '@/components/echo/JournalList';
import JournalEntryViewModal from '@/components/echo/JournalEntryViewModal';
import ThoughtRecordListPage from '@/components/echo/ThoughtRecordPage';
import ThoughtRecordForm from '@/components/echo/ThoughtRecordForm';
import ThoughtRecordViewModal from '@/components/echo/ThoughtRecordViewModal';
import PlannerPage from '@/components/echo/DailyPlannerPage'; 
import MedicationPage from '@/components/echo/MedicationPage';
import AffirmationsPage from '@/components/echo/AffirmationsPage';
import ProfilePage from '@/components/echo/ProfilePage';
import ResourcesPage from '@/components/echo/resources/ResourcesPage';
import DesignSystemPage from '@/components/echo/DesignSystemPage';
import ActionButton from './echo/ActionButton';
import ThemeToggleButton from '@/components/echo/ThemeToggleButton';
import { 
  XCircle,
  Plus,
} from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { cn } from "@/lib/utils"
import UnderstandingCBTPage from './echo/resources/UnderstandingCBTPage';
import CrisisSupportPage from './echo/resources/CrisisSupportPage';
import OnboardingPage from './echo/OnboardingPage';
import { useToast } from '@/hooks/use-toast';

export const EchoApp: React.FC = () => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [thoughtRecords, setThoughtRecords] = useState<ThoughtRecord[]>([]);
  const [dailyPlans, setDailyPlans] = useState<Record<string, DailyPlan>>({});
  const [weeklyPlans, setWeeklyPlans] = useState<Record<string, WeeklyPlannerData>>({}); 
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLogEntry[]>([]);
  const [medicationGroups, setMedicationGroups] = useState<MedicationGroup[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Form State
  const [selectedEntryForView, setSelectedEntryForView] = useState<JournalEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [editingThoughtRecord, setEditingThoughtRecord] = useState<ThoughtRecord | null>(null);
  const [selectedThoughtRecordForView, setSelectedThoughtRecordForView] = useState<ThoughtRecord | null>(null);
  
  // General App State
  const [currentView, setCurrentView] = useState<View>('dashboard'); 
  const [theme, setTheme] = useState<Theme | null>(null);
  const [palette, setPalette] = useState<Palette | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  const allViews: View[] = ['dashboard', 'journal', 'journal-new', 'journal-edit', 'thoughtRecord', 'thoughtRecord-new', 'thoughtRecord-edit', 'planner', 'medication', 'affirmations', 'profile', 'resources', 'designSystem', 'understanding-cbt', 'crisis-support'];
  const isValidView = (view: any): view is View => allViews.includes(view);

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

  const navigateToView = useCallback((view: View) => {
    window.location.hash = view;
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      const view = isValidView(hash) ? hash : 'dashboard';
      setCurrentView(view);
      closeDrawer();
    };

    handleHashChange();
    if (!isValidView(window.location.hash.substring(1))) {
      window.history.replaceState(null, '', `${window.location.pathname}#dashboard`);
    }

    window.addEventListener('hashchange', handleHashChange, false);
    return () => {
      window.removeEventListener('hashchange', handleHashChange, false);
    };
  }, [closeDrawer]);
  
  useEffect(() => {
    setTheme(localStorage.getItem(LOCAL_STORAGE_KEY_THEME) as Theme || 'light');
    setPalette(loadTheme());
    setJournalEntries(loadEntries().sort((a,b) => b.timestamp - a.timestamp));
    setThoughtRecords(loadThoughtRecords().sort((a,b) => b.timestamp - a.timestamp));
    
    setProfileData(loadProfileData());

    setCalendarEvents(loadCalendarEvents());
    setMedications(loadMedications());
    setMedicationGroups(loadMedicationGroups());
    setMedicationLogs(loadMedicationLogs());
    setDailyPlans(loadDailyPlans());
    setWeeklyPlans(loadWeeklyPlans()); 
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (theme === null || palette === null || !mounted) return;
    const root = document.documentElement;
    root.classList.remove('theme-echo', 'theme-forest', 'theme-buttercup', 'theme-sunset');
    root.classList.add(`theme-${palette}`);
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(LOCAL_STORAGE_KEY_THEME, theme);
    saveTheme(palette);
  }, [theme, palette, mounted]);

  useEffect(() => { if (mounted) saveEntries(journalEntries); }, [journalEntries, mounted]);
  useEffect(() => { if (mounted) saveThoughtRecords(thoughtRecords); }, [thoughtRecords, mounted]);
  useEffect(() => { if (mounted) saveDailyPlans(dailyPlans); }, [dailyPlans, mounted]);
  useEffect(() => { if (mounted) saveWeeklyPlans(weeklyPlans); }, [weeklyPlans, mounted]);
  useEffect(() => { if (mounted) saveMedications(medications); }, [medications, mounted]);
  useEffect(() => { if (mounted) saveMedicationLogs(medicationLogs); }, [medicationLogs, mounted]);
  useEffect(() => { if (mounted) saveMedicationGroups(medicationGroups); }, [medicationGroups, mounted]);
  useEffect(() => { if (mounted) saveCalendarEvents(calendarEvents); }, [calendarEvents, mounted]);
  useEffect(() => { if (mounted && profileData) saveProfileData(profileData); }, [profileData, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);
  
  const handleChangePalette = useCallback((newPalette: Palette) => {
    setPalette(newPalette);
  }, []);

  // --- Form Handlers ---
  const handleCloseJournalForm = useCallback(() => {
    setEditingEntry(null);
    navigateToView('journal');
  }, [navigateToView]);

  const handleCloseThoughtRecordForm = useCallback(() => {
    setEditingThoughtRecord(null);
    navigateToView('thoughtRecord');
  }, [navigateToView]);

  // --- Journal Entry Handlers ---
  const handleNewJournalClick = useCallback(() => {
    setEditingEntry(null);
    navigateToView('journal-new');
  }, [navigateToView]);

  const handleEditJournalClick = useCallback((entry: JournalEntry) => {
    setEditingEntry(entry);
    navigateToView('journal-edit');
  }, [navigateToView]);
  
  const handleSaveJournal = useCallback((data: { title: string; text: string; audioBase64DataUrl?: string }) => {
    const timestamp = Date.now();
    if (editingEntry) {
      const updatedEntry: JournalEntry = {
        ...editingEntry,
        title: data.title,
        text: data.text,
        audioBase64DataUrl: data.audioBase64DataUrl,
      };
      setJournalEntries(prev => prev.map(e => e.id === editingEntry.id ? updatedEntry : e));
    } else {
      const newEntry: JournalEntry = {
        id: timestamp.toString(),
        timestamp: timestamp,
        title: data.title,
        text: data.text,
        audioBase64DataUrl: data.audioBase64DataUrl,
      };
      setJournalEntries(prevEntries => [newEntry, ...prevEntries].sort((a,b) => b.timestamp - a.timestamp));
    }
    handleCloseJournalForm();
  }, [editingEntry, handleCloseJournalForm]);

  const handleViewEntry = useCallback((entry: JournalEntry) => {
    setSelectedEntryForView(entry);
  }, []);

  const handleDeleteJournalEntry = useCallback((id: string) => {
    setJournalEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  // --- Thought Record Handlers ---
  const handleNewThoughtRecordClick = useCallback(() => {
    setEditingThoughtRecord(null);
    navigateToView('thoughtRecord-new');
  }, [navigateToView]);
  
  const handleEditThoughtRecordClick = useCallback((record: ThoughtRecord) => {
    setEditingThoughtRecord(record);
    navigateToView('thoughtRecord-edit');
  }, [navigateToView]);

  const handleSaveThoughtRecord = useCallback((id: string | undefined, data: ThoughtRecordData) => {
    const timestamp = Date.now();
    const title = `Thought Record - ${new Date(timestamp).toLocaleDateString()}`;
    if (id) {
        setThoughtRecords(prev => prev.map(r => r.id === id ? { ...r, data, title } : r));
    } else {
        const newRecord: ThoughtRecord = { id: timestamp.toString(), timestamp, title, data };
        setThoughtRecords(prev => [newRecord, ...prev].sort((a,b) => b.timestamp - a.timestamp));
    }
    handleCloseThoughtRecordForm();
  }, [handleCloseThoughtRecordForm]);


  const handleDeleteThoughtRecord = useCallback((id: string) => {
    setThoughtRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  // --- General App Handlers ---
  const handleDownloadJournal = () => downloadJournalData(journalEntries); 
  const handleUpdateProfile = (newProfileData: ProfileData) => setProfileData(newProfileData);
  const handleAddCopingMechanism = useCallback((mechanism: CopingMechanism) => {
    if (!profileData) return;
    setProfileData(prev => {
        if (!prev) return null;
        // Avoid duplicates by checking the ID
        if (prev.copingMechanisms.some(m => m.id === mechanism.id)) {
            toast({ title: "Strategy already added" });
            return prev;
        }
        toast({ title: "Strategy added to your profile!" });
        return {
            ...prev,
            copingMechanisms: [...prev.copingMechanisms, mechanism]
        };
    });
  }, [profileData, toast]);

  const getDailyPlanByDate = useCallback((date: string): DailyPlan | undefined => dailyPlans[date], [dailyPlans]);
  const updateDailyPlan = useCallback((plan: DailyPlan) => { if (mounted) setDailyPlans(prev => ({ ...prev, [plan.date]: plan })); }, [mounted]);
  const getWeeklyPlanByDate = useCallback((date: string): WeeklyPlannerData | undefined => weeklyPlans[date], [weeklyPlans]);
  const updateWeeklyPlan = useCallback((plan: WeeklyPlannerData) => { if (mounted) setWeeklyPlans(prev => ({ ...prev, [plan.weekStartDate]: plan })); }, [mounted]);
  
  const handleAddMedication = useCallback((medData: Omit<Medication, 'id' | 'addedTimestamp'>) => {
    const newMedication: Medication = { ...medData, id: Date.now().toString(), addedTimestamp: Date.now(), frequency: medData.frequency.trim() || 'As needed' };
    setMedications(prevMeds => [newMedication, ...prevMeds].sort((a,b) => b.addedTimestamp - a.addedTimestamp));
  }, []);

  const handleUpdateMedication = useCallback((updatedMed: Medication) => {
    setMedications(prevMeds => prevMeds.map(med => med.id === updatedMed.id ? { ...updatedMed, frequency: updatedMed.frequency.trim() || 'As needed' } : med).sort((a,b) => b.addedTimestamp - a.timestamp));
  }, []);

  const handleDeleteMedication = useCallback((id: string) => {
    setMedications(prevMeds => prevMeds.filter(med => med.id !== id));
    setMedicationGroups(prevGroups => prevGroups.map(group => ({ ...group, medicationIds: group.medicationIds.filter(medId => medId !== id) })));
  }, []);

  const handleLogMedicationIntake = useCallback((medication: Medication) => {
    const newLogEntry: MedicationLogEntry = { id: Date.now().toString(), medicationId: medication.id, medicationName: medication.name, dosage: medication.dosage, timestamp: Date.now() };
    setMedicationLogs(prevLogs => [newLogEntry, ...prevLogs]);
  }, []);

  const handleClearMedicationLog = useCallback(() => { 
    setMedicationLogs([]); 
  }, []);

  const handleAddMedicationGroup = useCallback((name: string, medicationIds: string[]) => {
    const newGroup: MedicationGroup = { id: Date.now().toString(), name, medicationIds };
    setMedicationGroups(prevGroups => [newGroup, ...prevGroups]);
  }, []);

  const handleUpdateMedicationGroup = useCallback((updatedGroup: MedicationGroup) => { setMedicationGroups(prevGroups => prevGroups.map(group => group.id === updatedGroup.id ? updatedGroup : group)); }, []);
  
  const handleDeleteMedicationGroup = useCallback((groupId: string) => { 
    setMedicationGroups(prevGroups => prevGroups.filter(group => group.id !== groupId)); 
  }, []);

  const handleLogMedicationBundle = useCallback((groupId: string) => {
    const groupToLog = medicationGroups.find(g => g.id === groupId);
    if (!groupToLog) return;
    const newLogEntries: MedicationLogEntry[] = groupToLog.medicationIds.map(medId => {
      const medication = medications.find(m => m.id === medId);
      return medication ? { id: `${Date.now()}-${medication.id}`, medicationId: medication.id, medicationName: medication.name, dosage: medication.dosage, timestamp: Date.now() } : null;
    }).filter((e): e is MedicationLogEntry => e !== null);
    if (newLogEntries.length > 0) setMedicationLogs(prevLogs => [...newLogEntries, ...prevLogs]);
  }, [medicationGroups, medications]);

  const handleAddCalendarEvent = useCallback((eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = { ...eventData, id: Date.now().toString() };
    setCalendarEvents(prevEvents => [...prevEvents, newEvent]);
  }, []);

  const handleUpdateCalendarEvent = useCallback((updatedEvent: CalendarEvent) => {
    setCalendarEvents(prevEvents => prevEvents.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  }, []);

  const handleDeleteCalendarEvent = useCallback((eventId: string) => {
    setCalendarEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  }, []);

  const handleClearJournalData = useCallback(() => { 
    setJournalEntries([]); 
    setThoughtRecords([]); 
  }, []);
  const handleClearPlannerData = useCallback(() => { 
    setDailyPlans({}); 
    setWeeklyPlans({}); 
  }, []);
  const handleClearMedicationData = useCallback(() => {
    setMedications([]); 
    setMedicationLogs([]); 
    setMedicationGroups([]); 
  }, []);
  const handleClearAllData = useCallback(() => { 
    setJournalEntries([]); 
    setThoughtRecords([]); 
    setDailyPlans({}); 
    setWeeklyPlans({}); 
    setMedications([]); 
    setMedicationLogs([]); 
    setMedicationGroups([]); 
    setCalendarEvents([]); 
    setProfileData({ name: '', strengths: [], copingMechanisms: [], dashboardWidgets: {}, favoriteAffirmations: [] }); 
  }, []);

  const handleSavePlanToJournal = useCallback((planText: string) => {
    const htmlText = planText.split('\n').map(line => `<p>${line.trim() || '&nbsp;'}</p>`).join('');
    
    const entryTitle = 'My Plan';
    const timestamp = Date.now();
    const newEntry: JournalEntry = {
      id: timestamp.toString(),
      timestamp: timestamp,
      title: entryTitle,
      text: htmlText,
    };
    setJournalEntries(prevEntries => [newEntry, ...prevEntries].sort((a,b) => b.timestamp - a.timestamp));

  }, []);

  const handleOnboardingComplete = (data: ProfileData) => {
    setProfileData(data);
  };

  if (!mounted || !palette || !theme || profileData === null) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex flex-col flex-grow items-center justify-center">
            <Skeleton className="h-24 w-24 rounded-full mb-6" />
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-96" />
        </div>
      </div>
    );
  }

  if (!profileData.name) {
      return <OnboardingPage onOnboardingComplete={handleOnboardingComplete} />;
  }


  const isFormActive = currentView.endsWith('-new') || currentView.endsWith('-edit');

  const renderContent = () => {
    switch (currentView) {
        case 'dashboard': return <DashboardPage 
            dailyPlans={dailyPlans} 
            medications={medications} 
            medicationGroups={medicationGroups} 
            profileData={profileData}
            onUpdateProfile={handleUpdateProfile}
            onNavigateToView={navigateToView} 
          />;
        case 'journal': return <div className="relative flex justify-center"><JournalList entries={journalEntries} onViewEntry={handleViewEntry} onEdit={handleEditJournalClick} onDelete={handleDeleteJournalEntry} /></div>;
        case 'journal-new':
        case 'journal-edit':
            return <JournalInput onSave={handleSaveJournal} onClose={handleCloseJournalForm} initialEntry={editingEntry} />;
        case 'thoughtRecord': return <div className="flex justify-center"><ThoughtRecordListPage thoughtRecords={thoughtRecords} onNew={handleNewThoughtRecordClick} onView={setSelectedThoughtRecordForView} onEdit={handleEditThoughtRecordClick} onDelete={handleDeleteThoughtRecord} /></div>;
        case 'thoughtRecord-new':
        case 'thoughtRecord-edit':
            return <div className="flex justify-center h-full"><div className="max-w-3xl w-full"><ThoughtRecordForm initialData={editingThoughtRecord} onSave={handleSaveThoughtRecord} onClose={handleCloseThoughtRecordForm} isActive={true} /></div></div>;
        case 'planner': return <div className="flex justify-center"><PlannerPage 
            getDailyPlan={getDailyPlanByDate} 
            saveDailyPlan={updateDailyPlan} 
            getWeeklyPlan={getWeeklyPlanByDate} 
            saveWeeklyPlan={updateWeeklyPlan} 
            onSavePlanToJournal={handleSavePlanToJournal}
            events={calendarEvents} 
            journalEntries={journalEntries} 
            thoughtRecords={thoughtRecords}
            onAddEvent={handleAddCalendarEvent} 
            onUpdateEvent={handleUpdateCalendarEvent} 
            onDeleteEvent={handleDeleteCalendarEvent} 
            onViewJournalEntry={handleViewEntry} 
            onViewThoughtRecord={setSelectedThoughtRecordForView}
          /></div>;
        case 'medication': return <div className="flex justify-center"><MedicationPage medications={medications} medicationLogs={medicationLogs} medicationGroups={medicationGroups} onAddMedication={handleAddMedication} onUpdateMedication={handleUpdateMedication} onDeleteMedication={handleDeleteMedication} onLogMedicationIntake={handleLogMedicationIntake} onClearMedicationLog={handleClearMedicationLog} onAddMedicationGroup={handleAddMedicationGroup} onUpdateMedicationGroup={handleUpdateMedicationGroup} onDeleteMedicationGroup={handleDeleteMedicationGroup} onLogMedicationBundle={handleLogMedicationBundle} /></div>;
        case 'affirmations': return <AffirmationsPage profileData={profileData} onUpdateProfile={handleUpdateProfile} />;
        case 'profile': return <div className="flex justify-center"><ProfilePage 
            profileData={profileData} 
            onUpdateProfile={handleUpdateProfile}
            currentTheme={theme} 
            currentPalette={palette} 
            onToggleTheme={toggleTheme} 
            onChangePalette={handleChangePalette} 
            onDownloadJournal={handleDownloadJournal} 
            onClearJournal={handleClearJournalData} 
            onClearPlanner={handleClearPlannerData} 
            onClearMedication={handleClearMedicationData} 
            onClearAllData={handleClearAllData} 
            onNavigateToView={navigateToView}
            onReOnboard={() => setProfileData({ ...profileData, name: '' })}
            /></div>;
        case 'resources': return <div className="flex justify-center"><ResourcesPage onNavigateToView={navigateToView} onAddCopingMechanism={handleAddCopingMechanism} userCopingMechanisms={profileData.copingMechanisms} /></div>;
        case 'understanding-cbt': return <div className="flex justify-center"><UnderstandingCBTPage onNavigateBack={() => navigateToView('resources')} /></div>;
        case 'crisis-support': return <div className="flex justify-center"><CrisisSupportPage onNavigateBack={() => navigateToView('resources')} /></div>;
        case 'designSystem': return <div className="flex justify-center"><DesignSystemPage currentPalette={palette} onChangePalette={handleChangePalette} /></div>;
        default: return null;
    }
  }


  return (
    <div className="min-h-screen flex flex-col bg-surface text-surface-on selection:bg-primary-container selection:text-on-primary-container">
      <Navbar
        onToggleDrawer={toggleDrawer}
        onNavigateToView={navigateToView}
        currentView={currentView}
      />
      <SidebarNavDrawer isOpen={isDrawerOpen} onClose={closeDrawer} onNavigateToView={navigateToView} currentView={currentView} />

      <div className="flex flex-col flex-grow">
        <main className={cn("flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12", isFormActive && "h-full py-0 px-0 sm:px-0 lg:px-0")}>
          {error && (<div className="bg-error-container text-on-error-container p-4 rounded-xl relative mb-6 shadow-md flex items-start" role="alert"><svg className="fill-current h-5 w-5 text-on-error-container mr-3 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/></svg><div><strong className="font-bold text-title-md">Error</strong><p className="text-body-md">{error}</p></div><button onClick={() => setError(null)} className="absolute top-3 right-3 text-on-error-container hover:text-on-error-container/80 p-1 rounded-full hover:bg-black/10" aria-label="Close error message"><XCircle className="w-6 w-6" /></button></div>)}
          
          {renderContent()}

        </main>
        {!isFormActive && <footer className="text-center py-8 text-label-md text-surface-on-variant"></footer>}
      </div>

      {currentView === 'journal' && (<div className="fixed bottom-6 w-full flex justify-center z-20 md:w-auto md:left-1/2 md:right-auto md:transform md:-translate-x-1/2"><ActionButton onClick={handleNewJournalClick} variant="filled" size="lg" className="h-16 w-16 !rounded-full shadow-xl" aria-label="New Journal Entry" isIconOnly leadingIcon={<Plus className="w-8 h-8" />} /></div>)}
      
      <ThemeToggleButton currentTheme={theme} onToggleTheme={toggleTheme} />
      
      <JournalEntryViewModal isOpen={!!selectedEntryForView} onClose={() => setSelectedEntryForView(null)} entry={selectedEntryForView} onEdit={handleEditJournalClick} />
      
      <ThoughtRecordViewModal isOpen={!!selectedThoughtRecordForView} onClose={() => setSelectedThoughtRecordForView(null)} record={selectedThoughtRecordForView} onEdit={(record) => { setSelectedThoughtRecordForView(null); handleEditThoughtRecordClick(record); }} />
      
    </div>
  );
};
