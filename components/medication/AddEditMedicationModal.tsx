import React, { useState, useEffect } from 'react';
import { Medication } from '../../types';
import { XIcon } from '../icons/XIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medication: Omit<Medication, 'id'>) => void;
  onDelete?: () => void;
  medication: Medication | null;
}

const AddEditMedicationModal: React.FC<Props> = ({ isOpen, onClose, onSave, onDelete, medication }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (medication) {
      setName(medication.name);
      setDosage(medication.dosage);
      setFrequency(medication.frequency);
      setNotes(medication.notes || '');
    } else {
      setName('');
      setDosage('');
      setFrequency('');
      setNotes('');
    }
  }, [medication]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && dosage && frequency) {
      onSave({ name, dosage, frequency, notes });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close modal"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {medication ? 'Edit Medication' : 'Add Medication'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g., Vitamin D" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dosage</label>
            <input id="dosage" type="text" value={dosage} onChange={e => setDosage(e.target.value)} required placeholder="e.g., 1 tablet, 10mg" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Frequency</label>
            <input id="frequency" type="text" value={frequency} onChange={e => setFrequency(e.target.value)} required placeholder="e.g., Daily, As needed" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
            <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="e.g., Take with food" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
          </div>
          <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-between pt-4">
            <button type="button" onClick={onClose} className="w-full sm:w-auto mt-4 sm:mt-0 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500">
              Cancel
            </button>
            <div className="flex w-full sm:w-auto items-center gap-4">
              {onDelete && (
                <button type="button" onClick={onDelete} className="flex-grow sm:flex-grow-0 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60 focus:outline-none">
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
              <button type="submit" className="flex-grow sm:flex-grow-0 px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400" disabled={!name || !dosage || !frequency}>
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditMedicationModal;