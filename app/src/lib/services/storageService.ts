import { JournalEntry, DailyPlan, WeeklyPlannerData, Medication, MedicationLogEntry, MedicationGroup, CalendarEvent, ProfileData, Palette, ThoughtRecord } from '@/lib/types';
import jsPDF from 'jspdf';
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
  const doc = new jsPDF();
  const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);

  let yPos = 20;
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const usableHeight = pageHeight - margin;
  const lineSpacing = 7;
  const titleSpacing = 10;
  const entrySpacing = 15;

  doc.setFontSize(24);
  doc.text('My Echo Journal', doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
  yPos += titleSpacing * 2;

  sortedEntries.forEach((entry, index) => {
    if (yPos > usableHeight) {
      doc.addPage();
      yPos = margin;
    }

    const entryTitle = entry.title || `Entry from ${new Date(entry.timestamp).toLocaleString()}`;
    const entryDate = new Date(entry.timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const splitTitle = doc.splitTextToSize(entryTitle, 170);
    doc.text(splitTitle, margin, yPos);
    yPos += (splitTitle.length * lineSpacing);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(entryDate, margin, yPos);
    yPos += titleSpacing;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const textLines = doc.splitTextToSize(entry.text, 170);
    
    textLines.forEach((line: string) => {
      if (yPos > usableHeight) {
          doc.addPage();
          yPos = margin;
      }
      doc.text(line, margin, yPos);
      yPos += lineSpacing;
    });

    if (entry.audioBase64DataUrl) {
      if (yPos > usableHeight - 10) {
        doc.addPage();
        yPos = margin;
      }
      doc.setFont('helvetica', 'italic');
      doc.text('[Audio entry included - not playable in PDF]', margin, yPos);
      yPos += lineSpacing;
    }

    yPos += entrySpacing;

    if (index < sortedEntries.length - 1) {
      if (yPos > usableHeight - 5) {
        doc.addPage();
        yPos = margin;
      }
      doc.setDrawColor(220); // light gray
      doc.line(margin, yPos, doc.internal.pageSize.getWidth() - margin, yPos); // horizontal line
      yPos += entrySpacing;
    }
  });

  const exportFileDefaultName = `echo_journal_backup_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(exportFileDefaultName);
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
