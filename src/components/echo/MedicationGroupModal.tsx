'use client';
import React, { useState, useEffect, useRef } from 'react';
import Modal from '@/components/echo/Modal';
import ActionButton from '@/components/echo/ActionButton';
import { Medication, MedicationGroup } from '@/lib/types';
import { Save, Package } from 'lucide-react';

interface MedicationGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupData: { id?: string; name: string; medicationIds: string[] }) => void;
  existingMedications: Medication[];
  initialData?: MedicationGroup | null;
}

const MedicationGroupModal: React.FC<MedicationGroupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingMedications,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [selectedMedicationIds, setSelectedMedicationIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setSelectedMedicationIds(new Set(initialData.medicationIds));
      } else {
        setName('');
        setSelectedMedicationIds(new Set());
      }
      setError(null);
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [isOpen, initialData]);

  const handleMedicationToggle = (medId: string) => {
    setSelectedMedicationIds(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(medId)) {
        newSelected.delete(medId);
      } else {
        newSelected.add(medId);
      }
      return newSelected;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Bundle name is required.');
      return;
    }
    if (selectedMedicationIds.size === 0) {
      setError('Please select at least one medication for the bundle.');
      return;
    }
    onSave({
      id: initialData?.id,
      name: name.trim(),
      medicationIds: Array.from(selectedMedicationIds),
    });
    onClose();
  };

  const sortedMedications = [...existingMedications].sort((a,b) => a.name.localeCompare(b.name));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Medication Bundle' : 'Create New Medication Bundle'}>
      <form onSubmit={handleSubmit} className="space-y-7 p-6">
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm" role="alert">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="groupName" className="block text-sm font-medium text-surface-on-variant mb-1">
            Bundle Name <span className="text-error">*</span>
          </label>
          <input
            ref={nameInputRef}
            type="text"
            id="groupName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 bg-surface-container-low border border-outline-variant hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-surface-on placeholder-surface-on-variant"
            placeholder="e.g., Morning Pills, Bedtime Routine"
            required
            aria-required="true"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-on-variant mb-2">
            Select Medications for this Bundle <span className="text-error">*</span>
          </label>
          {sortedMedications.length > 0 ? (
            <div className="max-h-60 overflow-y-auto space-y-2 border border-outline-variant p-3 rounded-lg bg-surface">
              {sortedMedications.map(med => (
                <label key={med.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-surface-container cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMedicationIds.has(med.id)}
                    onChange={() => handleMedicationToggle(med.id)}
                    className="h-5 w-5 rounded text-primary focus:ring-primary border-outline-variant"
                  />
                  <span className="text-body-md text-surface-on">{med.name} <span className="text-sm text-surface-on-variant">({med.dosage}, {med.frequency})</span></span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-surface-on-variant italic">No medications available to add to a bundle. Please add medications first.</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <ActionButton type="button" variant="text" onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton type="submit" variant="filled" leadingIcon={<Save />}>
            {initialData ? 'Save Changes' : 'Create Bundle'}
          </ActionButton>
        </div>
      </form>
    </Modal>
  );
};

export default MedicationGroupModal;
