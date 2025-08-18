
'use client';
import React, { useState } from 'react';
import { Medication, MedicationLogEntry, MedicationGroup } from '@/lib/types';
import ActionButton from '@/components/echo/ActionButton';
import AddEditMedicationModal from '@/components/echo/AddEditMedicationModal';
import MedicationCard from '@/components/echo/MedicationCard';
import MedicationLogView from '@/components/echo/MedicationLogView';
import MedicationGroupModal from '@/components/echo/MedicationGroupModal';
import MedicationGroupCard from '@/components/echo/MedicationGroupCard';
import { PlusCircle, MinusCircle, Trash2, Package } from 'lucide-react';
import SegmentedControl from '@/components/echo/SegmentedControl';

interface MedicationPageProps {
  medications: Medication[];
  medicationLogs: MedicationLogEntry[];
  medicationGroups: MedicationGroup[];
  onAddMedication: (medData: Omit<Medication, 'id' | 'addedTimestamp'>) => void;
  onUpdateMedication: (medData: Medication) => void;
  onDeleteMedication: (id: string) => void;
  onLogMedicationIntake: (medication: Medication) => void;
  onClearMedicationLog: () => void;
  onAddMedicationGroup: (name: string, medicationIds: string[]) => void;
  onUpdateMedicationGroup: (group: MedicationGroup) => void;
  onDeleteMedicationGroup: (groupId: string) => void;
  onLogMedicationBundle: (groupId: string) => void;
}

type MedicationView = 'medications' | 'log';

const MedicationPage: React.FC<MedicationPageProps> = ({
  medications,
  medicationLogs,
  medicationGroups,
  onAddMedication,
  onUpdateMedication,
  onDeleteMedication,
  onLogMedicationIntake,
  onClearMedicationLog,
  onAddMedicationGroup,
  onUpdateMedicationGroup,
  onDeleteMedicationGroup,
  onLogMedicationBundle,
}) => {
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingMedicationGroup, setEditingMedicationGroup] = useState<MedicationGroup | null>(null);

  const [currentMedicationView, setCurrentMedicationView] = useState<MedicationView>('medications');

  const handleOpenAddMedModal = () => {
    setEditingMedication(null);
    setIsMedModalOpen(true);
  };

  const handleOpenEditMedModal = (medication: Medication) => {
    setEditingMedication(medication);
    setIsMedModalOpen(true);
  };

  const handleSaveMedication = (data: Omit<Medication, 'id' | 'addedTimestamp'> & { id?: string }) => {
    if (data.id) { 
      const existingMed = medications.find(m => m.id === data.id);
      if (existingMed) {
        onUpdateMedication({ 
            ...existingMed, 
            name: data.name,
            dosage: data.dosage,
            frequency: data.frequency,
            notes: data.notes,
        });
      }
    } else { 
      onAddMedication(data);
    }
  };

  const handleOpenAddGroupModal = () => {
    setEditingMedicationGroup(null);
    setIsGroupModalOpen(true);
  };

  const handleOpenEditGroupModal = (group: MedicationGroup) => {
    setEditingMedicationGroup(group);
    setIsGroupModalOpen(true);
  };

  const handleSaveMedicationGroup = (data: { id?: string; name: string; medicationIds: string[]}) => {
    if (data.id) {
      const existingGroup = medicationGroups.find(g => g.id === data.id);
      if (existingGroup) {
        onUpdateMedicationGroup({
          ...existingGroup,
          name: data.name,
          medicationIds: data.medicationIds,
        });
      }
    } else {
      onAddMedicationGroup(data.name, data.medicationIds);
    }
  };
  
  const sortedLogs = [...medicationLogs].sort((a,b) => b.timestamp - a.timestamp);
  const sortedMedications = [...medications].sort((a,b) => b.addedTimestamp - a.addedTimestamp);
  const sortedGroups = [...medicationGroups].sort((a,b) => a.name.localeCompare(b.name));


  return (
    <div className="space-y-10 animate-in fade-in-0 duration-750 max-w-3xl w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
            <MinusCircle className="w-8 h-8 text-primary transform rotate-90" />
            <h2 className="font-serif text-headline-lg text-surface-on">Medication Tracker</h2>
        </div>
        <ActionButton
          variant="filled"
          size="md"
          leadingIcon={<PlusCircle />}
          onClick={handleOpenAddMedModal}
          className="w-full sm:w-auto"
          aria-label="Add new medication"
        >
          Add New Medication
        </ActionButton>
      </div>

      <div className="flex justify-start">
        <SegmentedControl
          value={currentMedicationView}
          onChange={(value) => setCurrentMedicationView(value as MedicationView)}
          options={[
            { value: 'medications', label: 'My Medications' },
            { value: 'log', label: 'Log' },
          ]}
        />
      </div>

      {currentMedicationView === 'medications' && (
        <div className="space-y-10">
          <section aria-labelledby="medication-bundles-heading">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div className="flex items-center space-x-2">
                <Package className="w-7 h-7 text-secondary" />
                <h3 id="medication-bundles-heading" className="font-serif text-headline-sm text-surface-on">
                  My Medication Bundles
                </h3>
              </div>
              <ActionButton
                variant="tonal"
                size="md"
                leadingIcon={<PlusCircle />}
                onClick={handleOpenAddGroupModal}
                className="w-full sm:w-auto"
                aria-label="Create new medication bundle"
                disabled={medications.length === 0}
              >
                Create New Bundle
              </ActionButton>
            </div>
            {medications.length === 0 && (
              <p className="text-sm text-center text-surface-on-variant py-4 italic">
                Add medications first to create bundles.
              </p>
            )}
            {medications.length > 0 && sortedGroups.length === 0 && (
              <p className="text-center text-surface-on-variant py-8 text-body-lg">
                No medication bundles created yet. Click "Create New Bundle".
              </p>
            )}
            {sortedGroups.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedGroups.map(group => (
                  <MedicationGroupCard
                    key={group.id}
                    group={group}
                    medications={medications}
                    onLogBundle={onLogMedicationBundle}
                    onEdit={handleOpenEditGroupModal}
                    onDelete={onDeleteMedicationGroup}
                  />
                ))}
              </div>
            )}
          </section>

          <section aria-labelledby="medications-list-heading" className="pt-10 border-t border-outline-variant">
            <h3 id="medications-list-heading" className="font-serif text-headline-sm text-surface-on mb-4">
              All Individual Medications
            </h3>
            {sortedMedications.length === 0 && !isMedModalOpen ? ( // Hide if modal is open to avoid flash
              <p className="text-center text-surface-on-variant py-8 text-body-lg">
                  No medications added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {sortedMedications.map(med => (
                  <MedicationCard
                    key={med.id}
                    medication={med}
                    onLogTaken={onLogMedicationIntake}
                    onEdit={handleOpenEditMedModal}
                    onDelete={onDeleteMedication}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {currentMedicationView === 'log' && (
        <section aria-labelledby="medication-log-heading">
          <div className="flex justify-between items-center mb-4">
            <h3 id="medication-log-heading" className="font-serif text-headline-sm text-surface-on">
              Medication Log
            </h3>
            {medicationLogs.length > 0 && (
              <ActionButton
                variant="outlined"
                size="sm"
                leadingIcon={<Trash2 className="w-4 h-4" />}
                onClick={onClearMedicationLog}
                aria-label="Clear entire medication log"
                className="text-error hover:bg-error-container/20 border-error"
              >
                Clear Log
              </ActionButton>
            )}
          </div>
          <div className="bg-surface-container p-6 rounded-xl shadow">
            <div className="max-h-[600px] overflow-y-auto">
                <MedicationLogView logs={sortedLogs} />
            </div>
          </div>
        </section>
      )}

      <AddEditMedicationModal
        isOpen={isMedModalOpen}
        onClose={() => setIsMedModalOpen(false)}
        onSave={handleSaveMedication}
        initialData={editingMedication}
      />
      <MedicationGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onSave={handleSaveMedicationGroup}
        existingMedications={medications}
        initialData={editingMedicationGroup}
      />
    </div>
  );
};

export default MedicationPage;
