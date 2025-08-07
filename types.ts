
export enum Mood {
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  CALM = 'CALM',
  EXCITED = 'EXCITED',
  NEUTRAL = 'NEUTRAL',
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  date: string;
}

export interface Medication {
  id:string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
}

export interface MedicationBundle {
  id: string;
  name: string;
  medicationIds: string[];
}

export interface MedicationLog {
  id: string;
  timestamp: string;
  refId: string; // medicationId or bundleId
  type: 'medication' | 'bundle';
}

// A derived type for display purposes
export interface MedicationTakenLog {
    id: string;
    refId: string;
    name: string;
    timestamp: string;
    type: 'medication' | 'bundle';
}

export interface PlannerTask {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  isCompleted: boolean;
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

export interface ThoughtRecord extends ThoughtRecordData {
    id: string;
    date: string;
}

export interface CopingMechanism {
    id: string;
    title: string;
    description: string;
}
