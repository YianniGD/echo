import { JournalEntry, DailyPlan, WeeklyPlannerData, Medication, MedicationLogEntry, MedicationGroup, CalendarEvent, ProfileData, Palette, ThoughtRecord } from '@/lib/types';
import { 
  LOCAL_STORAGE_KEY_JOURNAL_ENTRIES,
  LOCAL_STORAGE_KEY_THOUGHT_RECORDS,
  LOCAL_STORAGE_KEY_DAILY_PLANS,
  LOCAL_STORAGE_KEY_WEEKLY_PLANS,
  LOCAL_STORAGE_KEY_MEDICATIONS,
  LOCAL_STORAGE_KEY_MEDICATION_LOGS,
  LOCAL_STORAGE_KEY_MEDICATION_GROUPS,
  LOCAL_STORAGE_KEY_CALENDAR_EVENTS,
  LOCAL_STORAGE_KEY_PROFILE_DATA,
  LOCAL_STORAGE_KEY_PALETTE
} from '@/lib/constants';

// Journal Entries
export const saveEntries = (entries: JournalEntry[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_JOURNAL_ENTRIES, JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving journal entries to localStorage:", error);
  }
};

export const loadEntries = (): JournalEntry[] => {
  try {
    const storedEntries = localStorage.getItem(LOCAL_STORAGE_KEY_JOURNAL_ENTRIES);
    return storedEntries ? JSON.parse(storedEntries) : [];
  } catch (error) {
    console.error("Error loading journal entries from localStorage:", error);
    return [];
  }
};

export const downloadJournalData = (entries: JournalEntry[]): void => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `echo_journal_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

// Thought Records
export const saveThoughtRecords = (records: ThoughtRecord[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_THOUGHT_RECORDS, JSON.stringify(records));
  } catch (error) {
    console.error("Error saving thought records to localStorage:", error);
  }
};

export const loadThoughtRecords = (): ThoughtRecord[] => {
  try {
    const storedRecords = localStorage.getItem(LOCAL_STORAGE_KEY_THOUGHT_RECORDS);
    return storedRecords ? JSON.parse(storedRecords) : [];
  } catch (error) {
    console.error("Error loading thought records from localStorage:", error);
    return [];
  }
};

// Daily Plans
export const saveDailyPlans = (dailyPlans: Record<string, DailyPlan>): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_DAILY_PLANS, JSON.stringify(dailyPlans));
  } catch (error) {
    console.error("Error saving daily plans to localStorage:", error);
  }
};

export const loadDailyPlans = (): Record<string, DailyPlan> => {
  try {
    const storedDailyPlans = localStorage.getItem(LOCAL_STORAGE_KEY_DAILY_PLANS);
    return storedDailyPlans ? JSON.parse(storedDailyPlans) : {};
  } catch (error) {
    console.error("Error loading daily plans from localStorage:", error);
    return {};
  }
};

// Weekly Plans (plural)
export const saveWeeklyPlans = (weeklyPlans: Record<string, WeeklyPlannerData>): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_WEEKLY_PLANS, JSON.stringify(weeklyPlans));
  } catch (error) {
    console.error("Error saving weekly plans to localStorage:", error);
  }
};

export const loadWeeklyPlans = (): Record<string, WeeklyPlannerData> => {
  try {
    const storedWeeklyPlans = localStorage.getItem(LOCAL_STORAGE_KEY_WEEKLY_PLANS);
    return storedWeeklyPlans ? JSON.parse(storedWeeklyPlans) : {};
  } catch (error) {
    console.error("Error loading weekly plans from localStorage:", error);
    return {};
  }
};

// Medications
export const saveMedications = (medications: Medication[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_MEDICATIONS, JSON.stringify(medications));
  } catch (error) {
    console.error("Error saving medications to localStorage:", error);
  }
};

export const loadMedications = (): Medication[] => {
  try {
    const storedMedications = localStorage.getItem(LOCAL_STORAGE_KEY_MEDICATIONS);
    return storedMedications ? JSON.parse(storedMedications) : [];
  } catch (error) {
    console.error("Error loading medications from localStorage:", error);
    return [];
  }
};

// Medication Logs
export const saveMedicationLogs = (logs: MedicationLogEntry[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_MEDICATION_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error("Error saving medication logs to localStorage:", error);
  }
};

export const loadMedicationLogs = (): MedicationLogEntry[] => {
  try {
    const storedLogs = localStorage.getItem(LOCAL_STORAGE_KEY_MEDICATION_LOGS);
    return storedLogs ? JSON.parse(storedLogs) : [];
  } catch (error) {
    console.error("Error loading medication logs from localStorage:", error);
    return [];
  }
};

// Medication Groups (Bundles)
export const saveMedicationGroups = (groups: MedicationGroup[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_MEDICATION_GROUPS, JSON.stringify(groups));
  } catch (error) {
    console.error("Error saving medication groups to localStorage:", error);
  }
};

export const loadMedicationGroups = (): MedicationGroup[] => {
  try {
    const storedGroups = localStorage.getItem(LOCAL_STORAGE_KEY_MEDICATION_GROUPS);
    return storedGroups ? JSON.parse(storedGroups) : [];
  } catch (error) {
    console.error("Error loading medication groups from localStorage:", error);
    return [];
  }
};

// Calendar Events
export const saveCalendarEvents = (events: CalendarEvent[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_CALENDAR_EVENTS, JSON.stringify(events));
  } catch (error) {
    console.error("Error saving calendar events to localStorage:", error);
  }
};

export const loadCalendarEvents = (): CalendarEvent[] => {
  try {
    const storedEvents = localStorage.getItem(LOCAL_STORAGE_KEY_CALENDAR_EVENTS);
    return storedEvents ? JSON.parse(storedEvents) : [];
  } catch (error) {
    console.error("Error loading calendar events from localStorage:", error);
    return [];
  }
};

// Profile Data
export const saveProfileData = (profile: ProfileData): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE_DATA, JSON.stringify(profile));
  } catch (error) {
    console.error("Error saving profile data to localStorage:", error);
  }
};

export const loadProfileData = (): ProfileData => {
  const defaultWidgets = {
    planner: true,
    medication: true,
    copingMechanisms: true,
    affirmations: true,
  };

  try {
    const storedProfile = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE_DATA);
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      // Ensure dashboardWidgets exists and has all keys, providing defaults for any missing ones.
      parsedProfile.dashboardWidgets = {
        ...defaultWidgets,
        ...(parsedProfile.dashboardWidgets || {}),
      };
      parsedProfile.strengths = parsedProfile.strengths || [];
      parsedProfile.favoriteAffirmations = parsedProfile.favoriteAffirmations || [];
      return parsedProfile;
    }
  } catch (error) {
    console.error("Error loading profile data from localStorage:", error);
  }
  // Return a default structure if nothing is stored or an error occurs
  return { 
    name: '', 
    strengths: [],
    copingMechanisms: [],
    dashboardWidgets: defaultWidgets,
    favoriteAffirmations: [],
  };
};


// Palette Theme
export const saveTheme = (palette: Palette): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PALETTE, palette);
  } catch (error) {
    console.error("Error saving palette to localStorage:", error);
  }
};

export const loadTheme = (): Palette => {
  try {
    let storedPalette = localStorage.getItem(LOCAL_STORAGE_KEY_PALETTE);
    // This handles migrating users from the old 'ocean' theme
    if (storedPalette === 'ocean') {
      storedPalette = 'buttercup';
      saveTheme('buttercup');
    }
    return (storedPalette as Palette) || 'echo'; // default to 'echo'
  } catch (error) {
    console.error("Error loading palette from localStorage:", error);
    return 'echo';
  }
};
