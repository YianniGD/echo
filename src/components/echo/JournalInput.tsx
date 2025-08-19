'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ActionButton from '@/components/echo/ActionButton';
import { Save, X, Mic, StopCircle, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import useSpeechRecognition from '@/hooks/use-speech-recognition';
import { JournalEntry } from '@/lib/types';
import RichTextEditor from './RichTextEditor';
import { Editor } from '@tiptap/react';

interface JournalInputProps {
  onSave: (data: { title: string; text: string; audioBase64DataUrl?: string }) => void;
  onClose: () => void;
  initialEntry?: JournalEntry | null;
}

const JournalInput: React.FC<JournalInputProps> = ({ onSave, onClose, initialEntry }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [audioDataUrl, setAudioDataUrl] = useState<string | undefined>(undefined);
  const [statusText, setStatusText] = useState('Ready to record');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const editorRef = useRef<Editor>(null);

  const handleTranscriptUpdate = useCallback((transcript: string, isFinal: boolean) => {
    if (editorRef.current && isFinal) {
      editorRef.current.chain().focus().insertContent(transcript.trim() + ' ').run();
    }
  }, []);
  
  const { isRecording, startRecording, stopRecording, cancelProcessing, speechError, isSpeechSupported } = useSpeechRecognition({
    onTranscriptUpdate: handleTranscriptUpdate,
    onAudioRecorded: (dataUrl) => {
        setAudioDataUrl(dataUrl);
        setIsProcessing(false);
    },
  });

  useEffect(() => {
    if (initialEntry) {
      setTitle(initialEntry.title || '');
      setText(initialEntry.text || '');
      setAudioDataUrl(initialEntry.audioBase64DataUrl);
    } else {
        setTitle('');
        setText('');
        setAudioDataUrl(undefined);
    }
  }, [initialEntry]);
  
  const handleToggleRecording = () => {
    if (isRecording) {
      setIsProcessing(true);
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleCancelProcessing = () => {
      cancelProcessing();
      setIsProcessing(false);
  };
  
  const handleCenterButtonClick = () => {
    if (isProcessing) {
        handleCancelProcessing();
    } else {
        handleToggleRecording();
    }
  };

  useEffect(() => {
    if (!isSpeechSupported) {
        setStatusText('Speech recognition not supported by your browser.');
    } else if (speechError) {
      setStatusText(speechError);
      setIsProcessing(false);
    } else if (isRecording) {
      setStatusText('Recording... Speak now.');
      setIsProcessing(false);
    } else if (isProcessing) {
      setStatusText('Processing...');
    } else {
      setStatusText('Ready to record');
    }
  }, [isRecording, isProcessing, speechError, isSpeechSupported]);


  const handleSaveClick = () => {
    const finalTitle = title.trim() || `Journal Entry - ${new Date().toLocaleDateString()}`;
    onSave({ title: finalTitle, text: text, audioBase64DataUrl: audioDataUrl });
  };
  
  const handleNewNote = () => {
    setTitle('');
    setText('');
    setAudioDataUrl(undefined);
    if(isRecording) stopRecording();
    setIsProcessing(false);
    setStatusText('Ready to record');
  }

  const getCenterButtonAriaLabel = () => {
    if (isProcessing) return "Cancel Processing";
    if (isRecording) return "Stop Recording";
    return "Start Recording";
  };
  
  return (
    <div className="flex flex-col h-full bg-surface">
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-outline-variant md:max-w-3xl md:mx-auto md:w-full">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Note"
          className="flex-grow bg-transparent text-headline-sm font-serif text-surface-on focus:outline-none"
        />
        <ActionButton onClick={onClose} variant="text" size="sm" isIconOnly aria-label="Close">
          <X className="h-6 w-6" />
        </ActionButton>
      </div>

      <div className="flex-grow flex flex-col min-h-0 md:max-w-3xl md:mx-auto md:w-full">
        <div className="flex-grow p-4 md:p-6 overflow-y-auto min-h-0">
             <RichTextEditor
                ref={editorRef}
                content={text}
                onChange={setText}
                placeholder="Start typing or use the microphone to dictate your thoughts..."
                editorClassName="min-h-full"
            />
        </div>
        
        <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 border-t border-outline-variant space-y-3">
            <div className="text-label-md text-surface-on-variant h-4">{statusText}</div>
            <div className="flex items-center justify-center gap-6">
                 <ActionButton onClick={handleNewNote} variant="tonal" size="md" isIconOnly title="New Note / Clear">
                     <File className="w-5 h-5"/>
                 </ActionButton>

                <button 
                    onClick={handleCenterButtonClick}
                    disabled={!isSpeechSupported}
                    className={cn(
                        "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
                        "bg-surface-container border border-outline-variant shadow-lg hover:scale-105",
                        (isRecording || isProcessing) && "bg-destructive border-transparent",
                        !isSpeechSupported && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label={getCenterButtonAriaLabel()}
                >
                    <div className={cn((isRecording || isProcessing) ? 'text-white' : 'text-surface-on')}>
                        <Mic className={cn("w-8 h-8 transition-opacity duration-300", isRecording || isProcessing ? 'opacity-0' : 'opacity-100')} />
                        <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-300", isRecording ? 'opacity-100' : 'opacity-0')}>
                            <div className="w-6 h-6 bg-white rounded-sm" />
                        </div>
                        <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-300", isProcessing ? 'opacity-100' : 'opacity-0')}>
                            <X className="w-8 h-8" />
                        </div>
                    </div>
                     {isRecording && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <svg className="w-48 h-48" viewBox="0 0 200 200">
                                <circle className="wave animate-wave" cx="100" cy="100" r="40" />
                                <circle className="wave animate-wave [animation-delay:0.4s]" cx="100" cy="100" r="70" />
                                <circle className="wave animate-wave [animation-delay:0.8s]" cx="100" cy="100" r="100" />
                            </svg>
                        </div>
                    )}
                </button>
                
                 <ActionButton onClick={handleSaveClick} variant="filled" size="md" isIconOnly title="Save Note">
                     <Save className="w-5 h-5" />
                 </ActionButton>
            </div>
        </div>
      </div>
    </div>
  );
};

export default JournalInput;
