'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ActionButton from '@/components/echo/ActionButton';
import { Save, X, ArrowLeft, ArrowRight, Mic, StopCircle } from 'lucide-react';
import useSpeechRecognition from '@/hooks/use-speech-recognition';
import { Slider } from '@/components/ui/slider';
import { ThoughtRecord, ThoughtRecordData } from '@/lib/types';
import RichTextEditor from './RichTextEditor';
import { Editor } from '@tiptap/react';
import { cn } from '@/lib/utils';

interface ThoughtRecordFormProps {
  onSave: (id: string | undefined, data: ThoughtRecordData) => void;
  initialData: ThoughtRecord | null;
  onClose: () => void;
  isActive: boolean;
}

const sections = [
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

const ThoughtRecordForm: React.FC<ThoughtRecordFormProps> = ({ onSave, initialData: recordToEdit, onClose, isActive }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [data, setData] = useState<ThoughtRecordData>(initialFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const editorRef = useRef<Editor>(null);

  const currentSection = sections[currentStepIndex];

  // Load initial data when the form becomes active.
  useEffect(() => {
    if (isActive) {
      if (recordToEdit) {
        setData(recordToEdit.data);
        setTitle(recordToEdit.title);
      } else {
        setData(initialFormData);
        setTitle(`Thought Record - ${new Date().toLocaleDateString()}`);
      }
      setCurrentStepIndex(0);
      setFormError(null);
    }
  }, [isActive, recordToEdit]);

  // Focus editor and scroll to top when step changes
  useEffect(() => {
    if (isActive) {
        editorRef.current?.commands.focus();
        const formTop = document.getElementById('thought-record-form-top');
        formTop?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStepIndex, isActive]);


  const onTranscriptUpdate = useCallback((transcript: string, isFinal: boolean) => {
    if (isFinal && editorRef.current) {
      editorRef.current.chain().focus().insertContent(transcript.trim() + ' ').run();
    }
  }, []);

  const { isRecording, startRecording, stopRecording, speechError: dictationError, isSpeechSupported } = useSpeechRecognition({ onTranscriptUpdate });
  
  const handleSliderChange = (value: number) => {
    if (currentSection.id === 'feelings') {
      setData(prevData => ({ ...prevData, feelingsRating: value }));
    } else if (currentSection.id === 'outcome') {
      setData(prevData => ({ ...prevData, outcomeRating: value }));
    }
  };
  
  const handleStepClick = (index: number) => {
    if (isRecording) stopRecording();
    setCurrentStepIndex(index);
  };

  const handleNext = () => {
    if (isRecording) stopRecording(); 
    if (isLastStep) {
      handleSave();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (isRecording) stopRecording(); 
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSave = () => {
    if (isRecording) stopRecording();
    
    const isAnyFieldFilled = Object.values(data).some(value => {
        if (typeof value !== 'string') return false; // Ignore numeric ratings
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = value;
        return (tempDiv.textContent || tempDiv.innerText || "").trim() !== '';
    });

    if (!isAnyFieldFilled) {
      setFormError("Please fill in at least one section before saving.");
      return;
    }

    onSave(recordToEdit?.id, data);
    onClose();
  };

  const handleCancel = () => {
    if (isRecording) stopRecording();
    onClose();
  };

  const handleToggleDictation = async () => {
    if (!isSpeechSupported) return;
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
      editorRef.current?.commands.focus();
    }
  };

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === sections.length - 1;
  const currentRatingValue = currentSection.id === 'feelings' ? data.feelingsRating : data.outcomeRating;

  return (
      <div className="flex flex-col h-full bg-surface-container overflow-hidden rounded-t-3xl md:rounded-3xl">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between p-4 pt-6 border-b border-outline-variant">
            <h2 className="font-serif text-headline-md text-surface-on">
                {recordToEdit ? "Edit Thought Record" : "New Thought Record"}
            </h2>
            <ActionButton
                onClick={handleCancel}
                variant="text"
                size="sm"
                isIconOnly={true}
                className="text-surface-on-variant"
                aria-label="Close form"
                title="Close"
            >
            <X className="h-6 w-6" />
            </ActionButton>
        </div>

        {/* Form Content */}
        <div id="thought-record-form-top" className="p-6 space-y-6 flex-grow overflow-y-auto">
            {formError && (
                <p className="text-label-md text-error p-3 bg-error-container/20 rounded-lg">{formError}</p>
            )}

            <div className="space-y-3 pt-2">
                <div>
                    <h3 className="font-serif text-title-lg text-primary">{currentSection.title}</h3>
                    <p className="text-body-md text-surface-on-variant italic mt-1.5">{currentSection.prompt}</p>
                </div>

                {(currentSection.id === 'feelings' || currentSection.id === 'outcome') && (
                    <div className="space-y-3 pt-4">
                        <label htmlFor={`${currentSection.id}-rating`} className="block text-sm font-medium text-surface-on-variant mb-1">
                            {currentSection.id === 'feelings' ? 'Rate Intensity (0-100)' : 'Re-rate Emotion'}: <span className="font-bold text-surface-on">{currentRatingValue}</span>
                        </label>
                        <Slider
                            id={`${currentSection.id}-rating`}
                            min={0}
                            max={100}
                            step={1}
                            value={[currentRatingValue]}
                            onValueChange={(value) => handleSliderChange(value[0])}
                            className="w-full"
                            aria-label={currentSection.id === 'outcome' ? 'Re-rate emotion slider' : 'Intensity rating slider'}
                        />
                    </div>
                )}

                <div className="relative pt-2">
                    <RichTextEditor
                        ref={editorRef}
                        content={data[currentSection.id] || ''}
                        onChange={(newContent) => {
                            setData(prev => ({ ...prev, [currentSection.id]: newContent }));
                            if (formError) setFormError(null);
                        }}
                        placeholder={currentSection.placeholder}
                        editorClassName="min-h-[250px]"
                    />
                     {isSpeechSupported && (
                        <ActionButton
                            onClick={handleToggleDictation}
                            variant={isRecording ? "filled" : "tonal"}
                            size="sm"
                            isIconOnly
                            className="absolute top-5 right-3"
                            aria-label={isRecording ? "Stop Dictation" : "Start Dictation"}
                            title={isRecording ? "Stop Dictation" : "Start Dictation"}
                            leadingIcon={isRecording ? <StopCircle /> : <Mic />}
                        />
                    )}
                </div>
                {dictationError && (
                    <p className="text-label-md text-error mt-1">{dictationError}</p>
                )}
            </div>
        </div>

        {/* Footer */}
        <div className="flex flex-row justify-between items-center gap-3 p-6 border-t border-outline-variant">
            <ActionButton 
                onClick={handlePrevious} 
                variant="outlined" 
                isIconOnly
                leadingIcon={<ArrowLeft />}
                aria-label="Previous step in thought record"
                disabled={isFirstStep}
                className={cn(isFirstStep && 'invisible')}
            />

            <div className="flex justify-center items-center gap-4">
                {sections.map((_, index) => (
                    <button
                        key={`step-${index}`}
                        type="button"
                        onClick={() => handleStepClick(index)}
                        className={cn(
                            'w-3 h-3 rounded-full cursor-pointer transition-all duration-300',
                            index === currentStepIndex 
                                ? 'bg-primary scale-125' 
                                : index < currentStepIndex 
                                    ? 'bg-primary/50' 
                                    : 'bg-outline hover:bg-outline-variant'
                        )}
                        aria-label={`Go to step ${index + 1}`}
                        aria-current={index === currentStepIndex ? "step" : undefined}
                    />
                ))}
            </div>
            
            <ActionButton 
                onClick={handleNext} 
                variant="filled" 
                isIconOnly
                leadingIcon={isLastStep ? <Save /> : <ArrowRight />}
                aria-label={isLastStep ? "Save thought record" : "Next step in thought record"}
            />
        </div>
    </div>
  );
};

export default ThoughtRecordForm;
