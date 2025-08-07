
import React, { useState } from 'react';
import { useMedications } from '../hooks/useMedications';
import { Medication, MedicationBundle } from '../types';
import AddEditMedicationModal from '../components/medication/AddEditMedicationModal';
import MedicationGroupModal from '../components/medication/MedicationGroupModal';
import MedicationCard from '../components/medication/MedicationCard';
import MedicationGroupCard from '../components/medication/MedicationGroupCard';
import MedicationLogView from '../components/medication/MedicationLogView';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';
import { LayersIcon } from '../components/icons/LayersIcon';
import { PillIcon } from '../components/icons/PillIcon';
import ConfirmationModal from '../components/ui/ConfirmationModal';

type ModalState = 
    | { type: 'add_med' }
    | { type: 'edit_med', data: Medication }
    | { type: 'add_bundle' }
    | { type: 'edit_bundle', data: MedicationBundle }
    | null;


const MedicationPage: React.FC = () => {
    const {
        medications,
        addMedication,
        updateMedication,
        deleteMedication,
        bundles,
        addBundle,
        updateBundle,
        deleteBundle,
        logTaken,
        todaysLogs,
        unbundledMedications,
        isLoggedToday,
        clearTodaysLogs,
    } = useMedications();

    const [modal, setModal] = useState<ModalState>(null);
    const [isClearLogModalOpen, setClearLogModalOpen] = useState(false);
    
    const handleSaveMedication = (medData: Omit<Medication, 'id'>) => {
        if (modal?.type === 'edit_med') {
            updateMedication({ ...modal.data, ...medData });
        } else {
            addMedication(medData);
        }
        setModal(null);
    };

    const handleDeleteMedication = (id: string) => {
      if (window.confirm('Are you sure you want to delete this medication? This will also remove it from any bundles.')) {
        deleteMedication(id);
        setModal(null);
      }
    };
    
    const handleSaveBundle = (bundleData: Omit<MedicationBundle, 'id'>) => {
        if (modal?.type === 'edit_bundle') {
            updateBundle({ ...modal.data, ...bundleData });
        } else {
            addBundle(bundleData);
        }
        setModal(null);
    };

    const handleDeleteBundle = (id: string) => {
        if (window.confirm('Are you sure you want to delete this bundle?')) {
            deleteBundle(id);
            setModal(null);
        }
    };

    const handleConfirmClearLog = () => {
        clearTodaysLogs();
        setClearLogModalOpen(false);
    };


    return (
        <div className="space-y-8">
            <ConfirmationModal
                isOpen={isClearLogModalOpen}
                onClose={() => setClearLogModalOpen(false)}
                onConfirm={handleConfirmClearLog}
                title="Clear Today's Log"
            >
                Are you sure you want to clear all medication logs for today? This action cannot be undone.
            </ConfirmationModal>
            
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
                        Medication
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Track your medications and log your intake.
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                     <button onClick={() => setModal({type: 'add_bundle'})} className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <LayersIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Create Bundle</span>
                    </button>
                    <button onClick={() => setModal({type: 'add_med'})} className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <PlusCircleIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Add Medication</span>
                    </button>
                </div>
            </header>

            {/* Modals */}
            {(modal?.type === 'add_med' || modal?.type === 'edit_med') && (
                <AddEditMedicationModal
                    isOpen={true}
                    onClose={() => setModal(null)}
                    onSave={handleSaveMedication}
                    onDelete={modal.type === 'edit_med' ? () => handleDeleteMedication(modal.data.id) : undefined}
                    medication={modal.type === 'edit_med' ? modal.data : null}
                />
            )}
             {(modal?.type === 'add_bundle' || modal?.type === 'edit_bundle') && (
                <MedicationGroupModal
                    isOpen={true}
                    onClose={() => setModal(null)}
                    onSave={handleSaveBundle}
                    onDelete={modal.type === 'edit_bundle' ? () => handleDeleteBundle(modal.data.id) : undefined}
                    bundle={modal.type === 'edit_bundle' ? modal.data : null}
                    allMedications={medications}
                />
            )}

            {medications.length === 0 && bundles.length === 0 ? (
                 <div className="text-center py-20 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <PillIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
                    <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">No Medications Added Yet</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Add a medication or create a bundle to get started.</p>
                </div>
            ) : (
                <main className="space-y-10">
                    {/* Medication Bundles */}
                    {bundles.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
                                <LayersIcon className="w-7 h-7 text-primary-500" />
                                Medication Bundles
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {bundles.map(bundle => (
                                    <MedicationGroupCard
                                        key={bundle.id}
                                        bundle={bundle}
                                        medications={medications}
                                        onLog={() => logTaken(bundle.id, 'bundle')}
                                        onEdit={() => setModal({ type: 'edit_bundle', data: bundle })}
                                        isLogged={isLoggedToday(bundle.id)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Individual Medications */}
                     {unbundledMedications.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
                                <PillIcon className="w-7 h-7 text-primary-500" />
                                Individual Medications
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {unbundledMedications.map(med => (
                                    <MedicationCard
                                        key={med.id}
                                        medication={med}
                                        onLog={() => logTaken(med.id, 'medication')}
                                        onEdit={() => setModal({ type: 'edit_med', data: med })}
                                        isLogged={isLoggedToday(med.id)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                    
                    {/* Todays Log */}
                    <MedicationLogView logs={todaysLogs} onClearLog={() => setClearLogModalOpen(true)} />
                </main>
            )}

        </div>
    );
};

export default MedicationPage;