import React, { useState, useEffect } from 'react';
import { Medication, MedicationBundle } from '../../types';
import { XIcon } from '../icons/XIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bundle: Omit<MedicationBundle, 'id'>) => void;
  onDelete?: () => void;
  bundle: MedicationBundle | null;
  allMedications: Medication[];
}

const MedicationGroupModal: React.FC<Props> = ({ isOpen, onClose, onSave, onDelete, bundle, allMedications }) => {
  const [name, setName] = useState('');
  const [selectedMedIds, setSelectedMedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (bundle) {
      setName(bundle.name);
      setSelectedMedIds(new Set(bundle.medicationIds));
    } else {
      setName('');
      setSelectedMedIds(new Set());
    }
  }, [bundle]);

  const handleToggleMed = (id: string) => {
    const newSet = new Set(selectedMedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedMedIds(newSet);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      onSave({ name, medicationIds: Array.from(selectedMedIds) });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label="Close modal"><XIcon className="w-6 h-6" /></button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{bundle ? 'Edit Bundle' : 'Create Bundle'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bundle-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bundle Name</label>
            <input id="bundle-name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g., Morning Meds" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Medications</label>
            <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2 space-y-2">
              {allMedications.length > 0 ? (
                allMedications.map(med => (
                  <label key={med.id} className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" checked={selectedMedIds.has(med.id)} onChange={() => handleToggleMed(med.id)} className="h-5 w-5 rounded text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:focus:ring-offset-gray-800" />
                    <span className="ml-3 text-sm text-gray-800 dark:text-gray-200">{med.name}</span>
                  </label>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 p-4">No medications available. Please add a medication first.</p>
              )}
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-between pt-4">
            <button type="button" onClick={onClose} className="w-full sm:w-auto mt-4 sm:mt-0 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none">Cancel</button>
            <div className="flex w-full sm:w-auto items-center gap-4">
              {onDelete && <button type="button" onClick={onDelete} className="flex-grow sm:flex-grow-0 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60 focus:outline-none"><TrashIcon className="w-5 h-5" /></button>}
              <button type="submit" className="flex-grow sm:flex-grow-0 px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400" disabled={!name}>Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicationGroupModal;