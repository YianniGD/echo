'use client';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DailyPlan, WeeklyPlannerData, PlannerTask, CalendarEvent, JournalEntry, ThoughtRecord } from '@/lib/types';
import ActionButton from '@/components/echo/ActionButton';
import {
  Save, Plus, Trash2, Mic, StopCircle, Smile, Meh, Frown, Zap, Moon, Coffee, Target, Edit3, ChevronLeft, ChevronRight,
  Calendar, BookOpen, Clipboard as ClipboardIcon
} from 'lucide-react';
import useSpeechRecognition from '@/hooks/use-speech-recognition';
import { startOfWeek, addDays, fromISOStringToLocalDate, getMonthName, getYear, formatWeekRangeDisplay, formatDayViewHeader, addMonths } from '@/components/echo/calendar/DateUtils';
import SegmentedControl from './SegmentedControl';

// Calendar imports
import CalendarHeader from '@/components/echo/calendar/CalendarHeader';
import MonthView from '@/components/echo/calendar/MonthView';
import WeekView from '@/components/echo/calendar/WeekView'; 
import DayView from '@/components/echo/calendar/DayView';   
import EventModal from '@/components/echo/calendar/EventModal';
import EventViewModal from '@/components/echo/calendar/EventViewModal';
import RichTextEditor from './RichTextEditor';
import { Editor } from '@tiptap/react';

type PlannerViewMode = 'goals' | 'calendar';
type CalendarViewMode = 'month' | 'week' | 'day';

// --- Planner Helper Functions ---
const getMondayOfWeek = (date: Date): Date => startOfWeek(new Date(date), 1);
const formatDateToYYYYMMDD = (date: Date): string => date.toISOString().split('T')[0];
const formatWeekRange = (startDate: Date): string => {
  const endDate = addDays(startDate, 6);
  const startMonth = startDate.toLocaleString('en-US', { month: 'short' });
  const endMonth = endDate.toLocaleString('en-US', { month: 'short' });
  if (startMonth === endMonth) return `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}, ${startDate.getFullYear()}`;
  return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${startDate.getFullYear()}`;
};

// --- Mood Options ---
const moodOptions: { name: string; icon: React.ReactNode; colorClass: string; darkColorClass: string; }[] = [
  { name: 'Happy', icon: <Smile />, colorClass: 'text-green-500', darkColorClass: 'dark:text-green-400' },
  { name: 'Okay', icon: <Meh />, colorClass: 'text-blue-500', darkColorClass: 'dark:text-blue-400' },
  { name: 'Sad', icon: <Frown />, colorClass: 'text-red-500', darkColorClass: 'dark:text-red-400' },
  { name: 'Productive', icon: <Zap />, colorClass: 'text-purple-500', darkColorClass: 'dark:text-purple-400' },
  { name: 'Tired', icon: <Moon />, colorClass: 'text-gray-500', darkColorClass: 'dark:text-gray-400' },
];

// --- Component ---
interface PlannerPageProps {
  getDailyPlan: (date: string) => DailyPlan | undefined;
  saveDailyPlan: (plan: DailyPlan) => void;
  getWeeklyPlan: (weekStartDate: string) => WeeklyPlannerData | undefined;
  saveWeeklyPlan: (plan: WeeklyPlannerData) => void;
  onSavePlanToJournal: (formattedText: string) => void;
  // Calendar Props
  events: CalendarEvent[];
  journalEntries: JournalEntry[];
  thoughtRecords: ThoughtRecord[];
  onAddEvent: (eventData: Omit<CalendarEvent, 'id'>) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onViewJournalEntry: (entry: JournalEntry) => void;
  onViewThoughtRecord: (record: ThoughtRecord) => void;
}

const PlannerPage: React.FC<PlannerPageProps> = ({
  getDailyPlan, saveDailyPlan, getWeeklyPlan, saveWeeklyPlan, onSavePlanToJournal,
  events, journalEntries, thoughtRecords, onAddEvent, onUpdateEvent, onDeleteEvent, onViewJournalEntry, onViewThoughtRecord
}) => {
  // Shared state
  const [currentView, setCurrentView] = useState<PlannerViewMode>('goals');
  const [today] = useState(new Date());
  
  // Planner State
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(() => getMondayOfWeek(new Date()));
  const formattedToday = formatDateToYYYYMMDD(today);
  const formattedWeekKey = currentWeekStartDate.toISOString().split('T')[0];
  const [currentMood, setCurrentMood] = useState<string | undefined>(undefined);
  const [dailyGoals, setDailyGoals] = useState<PlannerTask[]>([]);
  const [newDailyGoalText, setNewDailyGoalText] = useState<string>('');
  const [dailyNotes, setDailyNotes] = useState<string>('');
  const [weeklyGoals, setWeeklyGoals] = useState<PlannerTask[]>([]);
  const [newWeeklyGoalText, setNewWeeklyGoalText] = useState('');
  const [weeklyNotes, setWeeklyNotes] = useState<string>('');
  const newDailyGoalInputRef = useRef<HTMLInputElement>(null);
  const newWeeklyGoalInputRef = useRef<HTMLInputElement>(null);
  const isInitialLoad = useRef(true);
  const dailyNotesEditorRef = useRef<Editor>(null);

  // Calendar State
  const [currentDisplayDate, setCurrentDisplayDate] = useState(new Date());
  const [calendarViewMode, setCalendarViewMode] = useState<CalendarViewMode>('month');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | undefined>(undefined);
  const [isEventViewModalOpen, setIsEventViewModalOpen] = useState(false);
  const [selectedEventForView, setSelectedEventForView] = useState<CalendarEvent | null>(null);
  const memoizedEvents = useMemo(() => events, [events]);
  const memoizedJournalEntries = useMemo(() => journalEntries, [journalEntries]);
  const memoizedThoughtRecords = useMemo(() => thoughtRecords, [thoughtRecords]);

  // --- Data Loading Effect ---
  useEffect(() => {
    isInitialLoad.current = true;
    const todaysPlan = getDailyPlan(formattedToday);
    setCurrentMood(todaysPlan?.mood);
    setDailyGoals(todaysPlan?.goals || []);
    setDailyNotes(todaysPlan?.notes || '');
    const currentWeeklyPlan = getWeeklyPlan(formattedWeekKey);
    setWeeklyGoals(currentWeeklyPlan?.goals || []);
    setWeeklyNotes(currentWeeklyPlan?.notes || '');
    const timer = setTimeout(() => { isInitialLoad.current = false; }, 0);
    return () => clearTimeout(timer);
  }, [formattedToday, formattedWeekKey, getDailyPlan, getWeeklyPlan]);

  // --- Data Saving Effects ---
  useEffect(() => {
    if (isInitialLoad.current) return;
    saveDailyPlan({ date: formattedToday, mood: currentMood, goals: dailyGoals, notes: dailyNotes });
  }, [currentMood, dailyGoals, dailyNotes, formattedToday, saveDailyPlan]);

  useEffect(() => {
    if (isInitialLoad.current) return;
    saveWeeklyPlan({ weekStartDate: formattedWeekKey, goals: weeklyGoals, notes: weeklyNotes });
  }, [weeklyGoals, weeklyNotes, formattedWeekKey, saveWeeklyPlan]);

  // --- Planner Handlers ---
  const onGeneralTasksTranscriptUpdate = useCallback((transcript: string, isFinal: boolean) => {
    if (isFinal && dailyNotesEditorRef.current) {
        dailyNotesEditorRef.current.chain().focus().insertContent(transcript.trim() + ' ').run();
    }
  }, []);

  const generalTasksSpeech = useSpeechRecognition({ onTranscriptUpdate: onGeneralTasksTranscriptUpdate });

  const handleAddDailyGoal = () => {
    if (newDailyGoalText.trim()) {
      setDailyGoals(prev => [...prev, { id: Date.now().toString(), text: newDailyGoalText.trim(), completed: false }]);
      setNewDailyGoalText('');
      newDailyGoalInputRef.current?.focus();
    }
  };
  const handleAddWeeklyGoal = () => {
    if (newWeeklyGoalText.trim()) {
        setWeeklyGoals(prev => [...prev, { id: Date.now().toString(), text: newWeeklyGoalText.trim(), completed: false }]);
        setNewWeeklyGoalText('');
        newWeeklyGoalInputRef.current?.focus();
    }
  };

  const plainTextFromHtml = (html: string) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || "";
  }

  const handleSaveToJournal = () => {
    let journalText = `<h2>Week of ${formatWeekRange(currentWeekStartDate)}</h2>`;
    if (weeklyGoals.length > 0) {
      journalText += "<h3>Weekly Goals</h3><ul>";
      weeklyGoals.forEach(g => { journalText += `<li>${g.completed ? '[X]' : '[ ]'} ${g.text}</li>`; });
      journalText += "</ul>";
    }
    if (plainTextFromHtml(weeklyNotes).trim()) {
      journalText += "<h3>Weekly Notes</h3>" + weeklyNotes;
    }
    journalText += `<h3>Today's Focus: ${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>`;
    if (currentMood) journalText += `<p><strong>Mood:</strong> ${currentMood}</p>`;
    if (dailyGoals.length > 0) {
       journalText += "<h4>Daily Goals</h4><ul>";
      dailyGoals.forEach(g => { journalText += `<li>${g.completed ? '[X]' : '[ ]'} ${g.text}</li>`; });
      journalText += "</ul>";
    }
    if (plainTextFromHtml(dailyNotes).trim()) {
      journalText += "<h4>Daily Notes & Tasks</h4>" + dailyNotes;
    }
    onSavePlanToJournal(journalText);
  };
  const toggleItem = (id: string, setter: React.Dispatch<React.SetStateAction<PlannerTask[]>>) => {
    setter(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };
  const deleteItem = (id: string, setter: React.Dispatch<React.SetStateAction<PlannerTask[]>>) => {
    setter(prev => prev.filter(item => item.id !== id));
  };

  // --- Calendar Handlers ---
  const handlePrev = useCallback(() => {
    setCurrentDisplayDate(prev => {
      switch (calendarViewMode) {
        case 'month': return addMonths(prev, -1);
        case 'week': return addDays(prev, -7);
        case 'day': return addDays(prev, -1);
        default: return prev;
      }
    });
  }, [calendarViewMode]);
  const handleNext = useCallback(() => {
    setCurrentDisplayDate(prev => {
      switch (calendarViewMode) {
        case 'month': return addMonths(prev, 1);
        case 'week': return addDays(prev, 7);
        case 'day': return addDays(prev, 1);
        default: return prev;
      }
    });
  }, [calendarViewMode]);
  const handleOpenAddEventModal = (date?: Date) => {
    setEventToEdit(null);
    setSelectedDateForModal(date || new Date());
    setIsEventModalOpen(true);
  };
  const handleOpenEditEventModal = (event: CalendarEvent) => {
    setEventToEdit(event);
    setSelectedDateForModal(fromISOStringToLocalDate(event.start));
    setIsEventModalOpen(true);
  };
  const handleOpenViewEventModal = (event: CalendarEvent) => {
    setSelectedEventForView(event);
    setIsEventViewModalOpen(true);
  };
  const handleDateClick = (date: Date) => {
    if (calendarViewMode === 'month' || calendarViewMode === 'week') {
      setCurrentDisplayDate(date);
      setCalendarViewMode('day');
    } else {
      handleOpenAddEventModal(date);
    }
  };
  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'> & { id?: string }) => {
    if (eventData.id) {
      onUpdateEvent(eventData as CalendarEvent);
    } else {
      onAddEvent(eventData as Omit<CalendarEvent, 'id'>);
    }
    setIsEventModalOpen(false);
  };
  const renderDateTitle = () => {
    switch(calendarViewMode) {
      case 'month': return `${getMonthName(currentDisplayDate)} ${getYear(currentDisplayDate)}`;
      case 'week': return formatWeekRangeDisplay(currentDisplayDate, 0);
      case 'day': return formatDayViewHeader(currentDisplayDate);
      default: return '';
    }
  };

  const renderGoalsContent = () => (
    <>
      <section className="bg-surface-container-low p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl" aria-labelledby="daily-planner-heading">
        <h3 id="daily-planner-heading" className="font-serif text-headline-sm text-surface-on mb-1">Today's Focus</h3>
        <p className="text-body-md text-surface-on-variant mb-4">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <div className="mb-8">
            <h4 className="font-serif text-title-lg text-surface-on mb-3">How are you feeling today?</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {moodOptions.map(mood => (<button key={mood.name} onClick={() => setCurrentMood(mood.name)} className={`p-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all transform hover:scale-105 ${currentMood === mood.name ? 'bg-primary-container text-on-primary-container ring-2 ring-primary' : 'bg-surface-container hover:bg-surface-container-high text-surface-on-variant'}`} aria-pressed={currentMood === mood.name}><span className={`w-8 h-8 ${mood.colorClass} ${mood.darkColorClass}`}>{mood.icon}</span><span className="text-label-md font-medium">{mood.name}</span></button>))}
            </div>
        </div>
        <div className="mb-8">
            <div className="flex items-center mb-1"><Target className="w-6 h-6 text-secondary mr-2" /><h4 className="font-serif text-title-lg text-surface-on">Daily Goals</h4></div>
            <div className="flex gap-3 my-3">
              <input ref={newDailyGoalInputRef} type="text" value={newDailyGoalText} onChange={(e) => setNewDailyGoalText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddDailyGoal()} placeholder="Add a daily goal..." className="flex-grow p-3 bg-surface-container border border-outline-variant rounded-xl text-body-lg" aria-label="New daily goal"/>
              <ActionButton onClick={handleAddDailyGoal} variant="tonal" leadingIcon={<Plus />} aria-label="Add daily goal">Add</ActionButton>
            </div>
            {dailyGoals.length > 0 ? (
                <ul className="space-y-2 max-h-48 overflow-y-auto">{dailyGoals.map(g => (<li key={g.id} className="flex items-center justify-between p-2.5 bg-surface rounded-lg"><label className="flex items-center gap-3 cursor-pointer group flex-grow mr-2"><input type="checkbox" checked={g.completed} onChange={() => toggleItem(g.id, setDailyGoals)} className="h-5 w-5 rounded text-secondary focus:ring-secondary" /><span className={`text-body-md group-hover:text-secondary ${g.completed ? 'line-through text-surface-on-variant' : ''}`}>{g.text}</span></label><ActionButton onClick={() => deleteItem(g.id, setDailyGoals)} variant="text" size="sm" isIconOnly title="Delete goal" className="text-error hover:bg-error-container/20"><Trash2 className="w-5 h-5"/></ActionButton></li>))}</ul>
            ) : (<p className="text-center text-sm text-surface-on-variant py-3">No goals set for today.</p>)}
        </div>
        <div>
            <div className="flex items-center mb-2"><Edit3 className="w-6 h-6 text-tertiary mr-2" /><h4 className="font-serif text-title-lg text-surface-on">Daily Notes & Tasks</h4></div>
            <div className="relative">
                <RichTextEditor
                    ref={dailyNotesEditorRef}
                    content={dailyNotes}
                    onChange={setDailyNotes}
                    placeholder="Jot down other thoughts, to-dos..."
                />
                {generalTasksSpeech.isSpeechSupported && (<ActionButton onClick={() => generalTasksSpeech.isRecording ? generalTasksSpeech.stopRecording() : generalTasksSpeech.startRecording()} variant={generalTasksSpeech.isRecording ? "filled" : "tonal"} size="sm" isIconOnly className="absolute top-3 right-3 z-10" title={generalTasksSpeech.isRecording ? "Stop Dictation" : "Start Dictation"} leadingIcon={generalTasksSpeech.isRecording ? <StopCircle /> : <Mic />} />)}
            </div>
            {generalTasksSpeech.speechError && <p className="text-label-md text-error mt-1 px-1">{generalTasksSpeech.speechError}</p>}
        </div>
      </section>
      <section className="bg-surface-container-low p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl" aria-labelledby="weekly-planner-heading">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <h3 id="weekly-planner-heading" className="font-serif text-headline-sm text-surface-on">Weekly Plan</h3>
            <div className="flex items-center gap-1">
                <ActionButton onClick={() => setCurrentWeekStartDate(prev => addDays(prev, -7))} variant="text" size="sm" isIconOnly aria-label="Previous Week"><ChevronLeft /></ActionButton>
                <span className="text-title-sm text-surface-on-variant whitespace-nowrap">{formatWeekRange(currentWeekStartDate)}</span>
                <ActionButton onClick={() => setCurrentWeekStartDate(prev => addDays(prev, 7))} variant="text" size="sm" isIconOnly aria-label="Next Week"><ChevronRight /></ActionButton>
            </div>
        </div>
        <div className="mb-6">
            <div className="flex items-center mb-1"><Target className="w-6 h-6 text-secondary mr-2" /><h4 className="font-serif text-title-lg text-surface-on">Weekly Goals</h4></div>
            <div className="flex gap-3 my-3">
              <input ref={newWeeklyGoalInputRef} type="text" value={newWeeklyGoalText} onChange={(e) => setNewWeeklyGoalText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddWeeklyGoal()} placeholder="Add a weekly goal..." className="flex-grow p-3 bg-surface-container border border-outline-variant rounded-xl text-body-lg" aria-label="New weekly goal"/>
              <ActionButton onClick={handleAddWeeklyGoal} variant="tonal" leadingIcon={<Plus />} aria-label="Add weekly goal">Add</ActionButton>
            </div>
            {weeklyGoals.length > 0 ? (
              <ul className="space-y-2 max-h-48 overflow-y-auto">{weeklyGoals.map(g => (<li key={g.id} className="flex items-center justify-between p-2.5 bg-surface rounded-lg"><label className="flex items-center gap-3 cursor-pointer group flex-grow mr-2"><input type="checkbox" checked={g.completed} onChange={() => toggleItem(g.id, setWeeklyGoals)} className="h-5 w-5 rounded text-secondary focus:ring-secondary" /><span className={`text-body-md group-hover:text-secondary ${g.completed ? 'line-through text-surface-on-variant' : ''}`}>{g.text}</span></label><ActionButton onClick={() => deleteItem(g.id, setWeeklyGoals)} variant="text" size="sm" isIconOnly title="Delete goal" className="text-error hover:bg-error-container/20"><Trash2 className="w-5 h-5"/></ActionButton></li>))}</ul>
            ) : (<p className="text-center text-sm text-surface-on-variant py-3">No goals set for this week.</p>)}
        </div>
        <div>
            <div className="flex items-center mb-2"><Edit3 className="w-6 h-6 text-tertiary mr-2" /><h4 className="font-serif text-title-lg text-surface-on">Weekly Notes</h4></div>
            <RichTextEditor
                content={weeklyNotes}
                onChange={setWeeklyNotes}
                placeholder="General thoughts for the week..."
            />
        </div>
      </section>
      <div className="mt-8 flex justify-center">
        <ActionButton onClick={handleSaveToJournal} variant="filled" size="lg" leadingIcon={<Save />} disabled={!(weeklyGoals.length > 0 || plainTextFromHtml(weeklyNotes).trim() || currentMood || dailyGoals.length > 0 || plainTextFromHtml(dailyNotes).trim())} aria-label="Save current plans to journal">
          Save Plan to Journal
        </ActionButton>
      </div>
    </>
  );

  const renderCalendarContent = () => {
    const commonViewProps = {
      currentDisplayDate: currentDisplayDate,
      events: memoizedEvents,
      journalEntries: memoizedJournalEntries,
      thoughtRecords: memoizedThoughtRecords,
      onPrev: handlePrev,
      onNext: handleNext,
      currentDateTitle: renderDateTitle(),
      onViewJournalEntry,
      onViewThoughtRecord,
    };
    switch(calendarViewMode) {
      case 'month': return <MonthView {...commonViewProps} onDateClick={handleDateClick} onEventClick={handleOpenViewEventModal} />;
      case 'week': return <WeekView {...commonViewProps} onDateClick={handleDateClick} onEventClick={handleOpenViewEventModal} />;
      case 'day': return <DayView {...commonViewProps} onEventClick={handleOpenViewEventModal} onAddEvent={handleOpenAddEventModal} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in-0 duration-1000 max-w-7xl w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-primary" />
            <h2 className="font-serif text-headline-lg text-surface-on">Planner & Calendar</h2>
        </div>
        <SegmentedControl
            value={currentView}
            onChange={(value) => setCurrentView(value as PlannerViewMode)}
            options={[
                { value: 'goals', label: 'Goal Tracker' },
                { value: 'calendar', label: 'Calendar View' },
            ]}
        />
      </div>

      {currentView === 'goals' && (
        <div className="max-w-3xl mx-auto w-full space-y-10">
          {renderGoalsContent()}
        </div>
      )}
      
      {currentView === 'calendar' && (
        <div className="space-y-8">
            <CalendarHeader
                viewMode={calendarViewMode}
                onViewChange={(newView) => setCalendarViewMode(newView)}
                onAddEvent={() => handleOpenAddEventModal()}
            />
            {renderCalendarContent()}
        </div>
      )}

      <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} onSave={handleSaveEvent} eventToEdit={eventToEdit} initialDate={selectedDateForModal}/>
      <EventViewModal isOpen={isEventViewModalOpen} onClose={() => setIsEventViewModalOpen(false)} event={selectedEventForView} onEdit={handleOpenEditEventModal} onDelete={onDeleteEvent}/>
    </div>
  );
};

export default PlannerPage;
