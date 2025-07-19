'use client';
import React, { useState, useEffect, useRef } from 'react';
import Modal from '@/components/echo/Modal';
import ActionButton from '@/components/echo/ActionButton';
import { Medication } from '@/lib/types';
import { Save } from 'lucide-react';

interface AddEditMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicationData: Omit<Medication, 'id' | 'addedTimestamp'> & { id?: string }) => void;
  initialData?: Medication | null;
}

const AddEditMedicationModal: React.FC<AddEditMedicationModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setDosage(initialData.dosage);
        setFrequency(initialData.frequency);
        setNotes(initialData.notes || '');
      } else {
        setName('');
        setDosage('');
        setFrequency('');
        setNotes('');
      }
      setError(null);
      setTimeout(() => nameInputRef.current?.focus(), 100); 
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim() || !frequency.trim()) {
      setError('Name, Dosage, and Frequency are required.');
      return;
    }
    onSave({
      id: initialData?.id,
      name: name.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      notes: notes.trim() || undefined,
    });
    onClose(); 
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Medication' : 'Add New Medication'}>
      <form onSubmit={handleSubmit} className="space-y-7 p-6">
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm" role="alert">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="medName" className="block text-sm font-medium text-surface-on-variant mb-1">
            Medication Name <span className="text-error">*</span>
          </label>
          <input
            ref={nameInputRef}
            type="text"
            id="medName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 bg-surface-container-low border border-outline-variant hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-surface-on placeholder-surface-on-variant"
            placeholder="e.g., Ibuprofen"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="medDosage" className="block text-sm font-medium text-surface-on-variant mb-1">
            Dosage <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="medDosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className="w-full p-4 bg-surface-container-low border border-outline-variant hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-surface-on placeholder-surface-on-variant"
            placeholder="e.g., 200mg, 1 tablet"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="medFrequency" className="block text-sm font-medium text-surface-on-variant mb-1">
            Frequency <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="medFrequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full p-4 bg-surface-container-low border border-outline-variant hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-surface-on placeholder-surface-on-variant"
            placeholder="e.g., Daily, Twice a day, As needed"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="medNotes" className="block text-sm font-medium text-surface-on-variant mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="medNotes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full p-4 bg-surface-container-low border border-outline-variant hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-surface-on placeholder-surface-on-variant"
            placeholder="e.g., Take with food, For headaches"
          />
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <ActionButton type="button" variant="text" onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton type="submit" variant="filled" leadingIcon={<Save />}>
            {initialData ? 'Save Changes' : 'Add Medication'}
          </ActionButton>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditMedicationModal;
