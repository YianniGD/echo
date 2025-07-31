
export type View = 'dashboard' | 'journal' | 'journal-new' | 'journal-edit' | 'thoughtRecord' | 'thoughtRecord-new' | 'thoughtRecord-edit' | 'planner' | 'medication' | 'affirmations' | 'profile' | 'resources' | 'designSystem' | 'understanding-cbt' | 'mindfulness-techniques' | 'crisis-support';

export type Theme = 'light' | 'dark';
export type Palette = 'echo' | 'forest' | 'buttercup' | 'sunset';

export interface JournalEntry {
  id: string;
  timestamp: number;
  title: string;
  text: string;
  audioBase64DataUrl?: string; // Optional: Base64 data URL for recorded audio
}

export interface ThoughtRecordData {
  situation: string;
  feelings: string; 
  feelingsRating: number;
  unhelpfulThoughts: string;
  evidenceAgainst: string;
  evidenceFor: string;
  alternativePerspective: string;
  outcome: string; 
  outcomeRating: number;
}

export interface ThoughtRecord {
  id: string;
  timestamp: number;
  title: string;
  data: ThoughtRecordData;
}

export interface PlannerTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface DailyPlan {
  date: string; // YYYY-MM-DD
  tasks: PlannerTask[]; // General tasks, potentially from free-form text input
  mood?: string; // e.g., "happy", "sad", "productive"
  goals?: PlannerTask[]; // Specific, checkable goals for the day
}

export interface WeeklyPlannerData {
  weekStartDate: string; // YYYY-MM-DD, typically a Monday
  goals: PlannerTask[]; // Reusing PlannerTask for goals
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string; // e.g., "10mg", "1 pill"
  frequency: string; // e.g., "Daily", "Twice a day", "As needed"
  notes?: string;
  addedTimestamp: number;
}

export interface MedicationLogEntry {
  id: string;
  medicationId: string; 
  medicationName: string; 
  dosage: string; 
  timestamp: number; 
}

export interface MedicationGroup {
  id: string;
  name: string; // User-defined name like "Morning Routine", "Bedtime Pills"
  medicationIds: string[]; // Array of IDs of Medication objects
}

export interface CalendarEvent {
  id:string;
  title: string;
  start: string; // Full ISO string (YYYY-MM-DDTHH:mm:ss.sssZ or YYYY-MM-DD for allDay UTC)
  end: string;   // Full ISO string (YYYY-MM-DDTHH:mm:ss.sssZ or YYYY-M-DD for allDay UTC)
  allDay: boolean;
  description?: string;
  color: string;
}

export interface CopingMechanism {
  id: string;
  text: string;
}

export interface ProfileData {
  name: string;
  copingMechanisms: CopingMechanism[];
  dashboardWidgets: Record<string, boolean>;
  strengths: string[];
  favoriteAffirmations: string[];
}
