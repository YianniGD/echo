
import React, { useState, useEffect, useCallback } from 'react';
import { JournalEntry } from '../types';
import JournalList from '../components/JournalList';
import JournalForm from '../components/JournalForm';
import JournalEntryView from '../components/JournalEntryView';
import Header from '../components/Header';
import { useJournal } from '../hooks/useJournal';
import { JOURNAL_NAV_KEY } from '../constants';
import ConfirmationModal from '../components/ui/ConfirmationModal';

type ViewState = 'list' | 'view' | 'form';

const JournalPage: React.FC = () => {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournal();
  const [view, setView] = useState<ViewState>('list');
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>(undefined);

  // State for the confirmation modal
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entryToDeleteId, setEntryToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const navDataRaw = localStorage.getItem(JOURNAL_NAV_KEY);
    if (navDataRaw) {
      localStorage.removeItem(JOURNAL_NAV_KEY);
      try {
        const navData = JSON.parse(navDataRaw);
        if (navData.entryId) {
          const entryToView = entries.find(e => e.id === navData.entryId);
          if (entryToView) {
            setActiveEntry(entryToView);
            setView('view');
          }
        } else if (navData.date) {
          handleNewEntry(navData.date);
        }
      } catch (error) {
        console.error("Failed to parse journal navigation data:", error);
      }
    }
  }, []); // Run only on mount, dependency on `entries` could cause loops

  const handleNewEntry = (date?: string) => {
    setActiveEntry(null);
    setDefaultDate(date || new Date().toISOString());
    setView('form');
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setActiveEntry(entry);
    setView('view');
  };
  
  const handleEditEntry = () => {
    setView('form');
  };

  const handleSaveEntry = (entryData: Pick<JournalEntry, 'title' | 'content' | 'mood' | 'date'>) => {
    if (activeEntry) {
      updateEntry({ ...activeEntry, ...entryData });
    } else {
      addEntry(entryData);
    }
    setView('list');
    setActiveEntry(null);
    setDefaultDate(undefined);
  };
  
  const handleCancelForm = () => {
    // If we were editing, go back to the view screen, otherwise to the list
    setView(activeEntry ? 'view' : 'list');
  };

  const handleBackToList = () => {
    setView('list');
    setActiveEntry(null);
  };

  // Step 1: User clicks delete, this function is called
  const requestDeleteEntry = useCallback((id: string) => {
    setEntryToDeleteId(id);
    setDeleteModalOpen(true);
  }, []);

  // Step 2: User confirms in the modal, this function is called
  const confirmDeleteEntry = useCallback(() => {
    if (entryToDeleteId) {
      deleteEntry(entryToDeleteId);
      setView('list');
      setActiveEntry(null);
    }
    // Step 3: Clean up modal state
    setDeleteModalOpen(false);
    setEntryToDeleteId(null);
  }, [entryToDeleteId, deleteEntry]);

  // Step 3 (alternative): User cancels
  const cancelDeleteEntry = useCallback(() => {
    setDeleteModalOpen(false);
    setEntryToDeleteId(null);
  }, []);
  
  const renderContent = () => {
      if (view === 'view' && activeEntry) {
        return (
            <JournalEntryView
                entry={activeEntry}
                onEdit={handleEditEntry}
                onBack={handleBackToList}
                onDelete={() => requestDeleteEntry(activeEntry.id)}
            />
        );
      }
      
      if (view === 'form') {
        return (
            <JournalForm 
                onSave={handleSaveEntry} 
                onCancel={handleCancelForm}
                entry={activeEntry}
                defaultDate={defaultDate}
            />
        );
      }
      
      return (
          <JournalList
            entries={entries}
            onSelect={handleSelectEntry}
            onNewEntry={() => handleNewEntry()}
            onDelete={requestDeleteEntry}
          />
      );
  }

  return (
    <>
      <Header onNewEntry={() => handleNewEntry()} />
      <main className="mt-8">
        {renderContent()}
      </main>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDeleteEntry}
        onConfirm={confirmDeleteEntry}
        title="Delete Journal Entry"
      >
        Are you sure you want to delete this entry? This action cannot be undone.
      </ConfirmationModal>
    </>
  );
};

export default JournalPage;
