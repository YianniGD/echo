import React, { useState, useCallback, useEffect } from 'react';
import { ThoughtRecord, ThoughtRecordData } from '../types';
import { useThoughtRecords } from '../hooks/useThoughtRecords';
import { LightbulbIcon } from '../components/icons/LightbulbIcon';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { THOUGHT_RECORD_NAV_KEY } from '../constants';

const prompts = [
  { id: 'situation', title: 'Situation / Trigger', prompt: 'What happened? Where? When? Who with? How?', placeholder: 'Describe the event or situation...' },
  { id: 'feelings', title: 'Feelings & Body Sensations', prompt: 'What emotion did I feel? What did I notice in my body? Where?', placeholder: 'e.g., Anxiety, tightness in chest...' },
  { id: 'unhelpfulThoughts', title: 'Unhelpful / Initial Thoughts & Images', prompt: 'What went through my mind? What disturbed me? Meaning? What ‘button’ is this pressing for me? Worst outcome?', placeholder: 'e.g., "I\'m going to fail", image of messing up...' },
  { id: 'evidenceAgainst', title: 'Facts Against Initial Thought', prompt: 'What facts counter the unhelpful thoughts? Is it opinion, not fact? Others\' views?', placeholder: 'e.g., "I\'ve prepared well", "I\'ve succeeded before"...' },
  { id: 'evidenceFor', title: 'Facts Supporting Initial Thought', prompt: 'What facts support the unhelpful thoughts? What makes them seem true?', placeholder: 'e.g., "This is a difficult task", "I made a mistake previously"...' },
  { id: 'alternativePerspective', title: 'Alternative, Balanced Perspective', prompt: 'Breathe. Someone else\'s view? Bigger picture? Reframe? Advice to others? Proportional reaction? Importance?', placeholder: 'e.g., "One mistake doesn\'t define me", "I can ask for help"...' },
  { id: 'outcome', title: 'Outcome', prompt: 'Feeling now? What to do differently/more effectively? Act wisely. Most helpful action? Consequences?', placeholder: 'e.g., Hopeful, plan to practice mindfulness...' },
] as const;

const initialFormData: ThoughtRecordData = {
  situation: '',
  feelings: '',
  feelingsRating: 50,
  unhelpfulThoughts: '',
  evidenceAgainst: '',
  evidenceFor: '',
  alternativePerspective: '',
  outcome: '',
  outcomeRating: 50,
};

type View = 'list' | 'form' | 'view';

const ThoughtRecordPage: React.FC = () => {
    const { records, addRecord, deleteRecord } = useThoughtRecords();
    const [view, setView] = useState<View>('list');
    const [activeRecord, setActiveRecord] = useState<ThoughtRecord | null>(null);
    const [formData, setFormData] = useState<ThoughtRecordData>(initialFormData);
    const [currentStep, setCurrentStep] = useState(0);
    const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

    useEffect(() => {
        const navDataRaw = localStorage.getItem(THOUGHT_RECORD_NAV_KEY);
        if (navDataRaw) {
            localStorage.removeItem(THOUGHT_RECORD_NAV_KEY);
            try {
                const navData = JSON.parse(navDataRaw);
                if (navData.recordId) {
                    const recordToView = records.find(r => r.id === navData.recordId);
                    if (recordToView) {
                        setActiveRecord(recordToView);
                        setView('view');
                    }
                }
            } catch (error) {
                console.error("Failed to parse thought record navigation data:", error);
            }
        }
    }, [records]);


    const handleStartNew = () => {
        setFormData(initialFormData);
        setCurrentStep(0);
        setView('form');
    };
    
    const handleSelectRecord = (record: ThoughtRecord) => {
        setActiveRecord(record);
        setView('view');
    };

    const handleBackToList = () => {
        setActiveRecord(null);
        setView('list');
    };

    const handleSaveRecord = () => {
        const newRecord = addRecord(formData);
        setActiveRecord(newRecord);
        setView('view');
    };

    const requestDelete = (id: string) => {
        setRecordToDelete(id);
    };

    const confirmDelete = () => {
        if (recordToDelete) {
            deleteRecord(recordToDelete);
            setRecordToDelete(null);
            if (activeRecord?.id === recordToDelete) {
                handleBackToList();
            }
        }
    };
    
    const renderContent = () => {
        switch(view) {
            case 'form':
                return <ThoughtRecordForm 
                            currentStep={currentStep} 
                            setCurrentStep={setCurrentStep}
                            formData={formData}
                            setFormData={setFormData}
                            onSave={handleSaveRecord}
                            onCancel={handleBackToList}
                        />;
            case 'view':
                return activeRecord && <ThoughtRecordView 
                                            record={activeRecord} 
                                            onBack={handleBackToList}
                                            onDelete={() => requestDelete(activeRecord.id)}
                                        />;
            case 'list':
            default:
                return <ThoughtRecordList 
                            records={records}
                            onNew={handleStartNew}
                            onSelect={handleSelectRecord}
                            onDelete={requestDelete}
                        />;
        }
    };

    return (
        <div className="space-y-8 printable-container">
            <ConfirmationModal
                isOpen={!!recordToDelete}
                onClose={() => setRecordToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Thought Record"
            >
                Are you sure you want to delete this record? This action cannot be undone.
            </ConfirmationModal>
            {renderContent()}
        </div>
    );
};

const ThoughtRecordList: React.FC<{
    records: ThoughtRecord[],
    onNew: () => void,
    onSelect: (record: ThoughtRecord) => void,
    onDelete: (id: string) => void
}> = ({ records, onNew, onSelect, onDelete }) => {
    return (
        <>
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white tracking-tight flex items-center gap-3">
                        <LightbulbIcon className="w-8 h-8 text-primary-500" />
                        Thought Record
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
                        A CBT tool to identify, challenge, and reframe unhelpful thoughts.
                    </p>
                </div>
                <button onClick={onNew} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>New Record</span>
                </button>
            </header>
            {records.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {records.map(record => (
                        <div key={record.id} className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => onSelect(record)}>
                            <div className="p-5">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                                <p className="mt-2 font-semibold text-gray-700 dark:text-gray-200">Situation:</p>
                                <p className="mt-1 text-gray-600 dark:text-gray-300 line-clamp-3">{record.situation}</p>
                            </div>
                             <button onClick={(e) => { e.stopPropagation(); onDelete(record.id); }} aria-label="Delete record" className="absolute top-3 right-3 p-2 rounded-full bg-white/50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 hover:!opacity-100 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/60 dark:hover:text-red-300 transition-opacity duration-200 no-print">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm no-print">
                    <LightbulbIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
                    <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">No Thought Records Yet</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Start a new record to analyze your thoughts and feelings.</p>
                </div>
            )}
        </>
    );
};


const ThoughtRecordForm: React.FC<{
    currentStep: number,
    setCurrentStep: (step: number) => void,
    formData: ThoughtRecordData,
    setFormData: (data: ThoughtRecordData) => void,
    onSave: () => void,
    onCancel: () => void
}> = ({ currentStep, setCurrentStep, formData, setFormData, onSave, onCancel }) => {
    const currentPrompt = prompts[currentStep];

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, [currentPrompt.id]: e.target.value });
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, key: 'feelingsRating' | 'outcomeRating') => {
        setFormData({ ...formData, [key]: parseInt(e.target.value, 10) });
    };

    const isNextDisabled = () => {
        const value = formData[currentPrompt.id as keyof Omit<ThoughtRecordData, 'feelingsRating' | 'outcomeRating'>];
        return typeof value === 'string' && !value.trim();
    }
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 animate-fade-in-up w-full max-w-3xl mx-auto no-print">
            <div className="mb-8">
                <div className="flex justify-between mb-1">
                    {prompts.map((p, index) => (
                        <div key={p.id} className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-1">
                            <div className={`h-1.5 rounded-full ${index <= currentStep ? 'bg-primary-500' : ''}`} style={{ width: index === currentStep ? '50%' : '100%' }}></div>
                        </div>
                    ))}
                </div>
                <p className="text-right text-sm text-gray-500 dark:text-gray-400">Step {currentStep + 1} of {prompts.length}</p>
            </div>
            
            <div className="min-h-[300px]">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{currentPrompt.title}</h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400">{currentPrompt.prompt}</p>

                <div className="mt-6">
                    <textarea 
                        value={formData[currentPrompt.id as keyof Omit<ThoughtRecordData, 'feelingsRating' | 'outcomeRating'>]}
                        onChange={handleTextChange}
                        placeholder={currentPrompt.placeholder}
                        rows={6}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>

                {currentPrompt.id === 'feelings' && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rate intensity of feeling (0-100): <span className="font-bold">{formData.feelingsRating}</span></label>
                        <input type="range" min="0" max="100" value={formData.feelingsRating} onChange={(e) => handleSliderChange(e, 'feelingsRating')} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                    </div>
                )}
                {currentPrompt.id === 'outcome' && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rate intensity of feeling now (0-100): <span className="font-bold">{formData.outcomeRating}</span></label>
                        <input type="range" min="0" max="100" value={formData.outcomeRating} onChange={(e) => handleSliderChange(e, 'outcomeRating')} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                    </div>
                )}
            </div>

            <div className="mt-8 flex justify-between items-center">
                <button onClick={onCancel} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:underline">Cancel</button>
                <div className="flex gap-4">
                    {currentStep > 0 && <button onClick={() => setCurrentStep(currentStep - 1)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">Previous</button>}
                    {currentStep < prompts.length - 1 ? (
                        <button onClick={() => setCurrentStep(currentStep + 1)} disabled={isNextDisabled()} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400">Next</button>
                    ) : (
                        <button onClick={onSave} disabled={isNextDisabled()} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400">Finish</button>
                    )}
                </div>
            </div>
        </div>
    );
};


const ThoughtRecordView: React.FC<{
    record: ThoughtRecord,
    onBack: () => void,
    onDelete: () => void
}> = ({ record, onBack, onDelete }) => {

    const handleExportText = () => {
        let content = `Thought Record - ${new Date(record.date).toLocaleString()}\n\n`;

        prompts.forEach(prompt => {
            const key = prompt.id as keyof ThoughtRecordData;
            content += `--- ${prompt.title} ---\n`;
            const value = record[key as keyof Omit<ThoughtRecordData, 'feelingsRating'|'outcomeRating'>];
            content += `${value || 'No entry'}\n`;

            if (prompt.id === 'feelings') {
                content += `Initial Intensity: ${record.feelingsRating}/100\n`;
            }
            if (prompt.id === 'outcome') {
                content += `Final Intensity: ${record.outcomeRating}/100\n`;
            }
            content += '\n';
        });

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `thought-record-${new Date(record.date).toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleExportPdf = () => {
        window.print();
    };


    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 animate-fade-in-up w-full max-w-3xl mx-auto printable-content">
            <header className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-grow">
                    <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline mb-4 no-print">
                        <ArrowLeftIcon className="w-5 h-5" />
                        Back to List
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Thought Record</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(record.date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>
                </div>
                <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full transition-colors no-print"><TrashIcon className="w-5 h-5"/></button>
            </header>
            <div className="space-y-6">
                {prompts.map(prompt => (
                    <div key={prompt.id}>
                        <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">{prompt.title}</h3>
                        <p className="mt-1 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{record[prompt.id as keyof Omit<ThoughtRecordData, 'feelingsRating' | 'outcomeRating'>] || "No entry"}</p>
                        {prompt.id === 'feelings' && <p className="text-sm text-primary-600 dark:text-primary-400">Initial Intensity: {record.feelingsRating}/100</p>}
                        {prompt.id === 'outcome' && <p className="text-sm text-green-600 dark:text-green-400">Final Intensity: {record.outcomeRating}/100</p>}
                    </div>
                ))}
            </div>
             <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3 no-print">
                <button
                    onClick={handleExportText}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Export as Text
                </button>
                <button
                    onClick={handleExportPdf}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Export as PDF
                </button>
            </footer>
        </div>
    );
};

export default ThoughtRecordPage;