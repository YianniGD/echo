"use client";

import { useState, useRef, useCallback, useEffect } from 'react';

// Speech API Type Definitions
interface SpeechRecognitionAlternative { readonly transcript: string; readonly confidence: number; }
interface SpeechRecognitionResult { readonly isFinal: boolean; readonly length: number; item(index: number): SpeechRecognitionAlternative; [index: number]: SpeechRecognitionAlternative; }
interface SpeechRecognitionResultList { readonly length: number; item(index: number): SpeechRecognitionResult; [index: number]: SpeechRecognitionResult; }
interface SpeechRecognitionEvent extends Event { readonly resultIndex: number; readonly results: SpeechRecognitionResultList; readonly interpretation?: any; readonly emma?: any; }
type SpeechRecognitionErrorCode = | 'no-speech' | 'aborted' | 'audio-capture' | 'network' | 'not-allowed' | 'service-not-allowed' | 'bad-grammar' | 'language-not-supported';
interface SpeechRecognitionErrorEvent extends Event { readonly error: SpeechRecognitionErrorCode; readonly message: string; }
interface SpeechRecognitionStatic { new (): SpeechRecognition; }
interface SpeechRecognition extends EventTarget { grammars: any; lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number; serviceURI?: string; onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null; onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null; onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null; onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null; onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null; onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null; onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null; onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null; onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null; onstart: ((this: SpeechRecognition, ev: Event) => any) | null; onend: ((this: SpeechRecognition, ev: Event) => any) | null; abort(): void; start(): void; stop(): void; }

declare global {
    interface Window {
        SpeechRecognition: SpeechRecognitionStatic;
        webkitSpeechRecognition: SpeechRecognitionStatic;
    }
}

const SpeechRecognitionAPI = (typeof window !== 'undefined') ? (window.SpeechRecognition || window.webkitSpeechRecognition) : undefined;

interface UseSpeechRecognitionProps {
  onTranscriptUpdate: (transcript: string, isFinal: boolean) => void;
  onAudioRecorded?: (audioDataUrl: string) => void;
  lang?: string;
}

interface UseSpeechRecognitionReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  cancelProcessing: () => void;
  speechError: string | null;
  isSpeechSupported: boolean;
}

const useSpeechRecognition = ({
  onTranscriptUpdate,
  onAudioRecorded,
  lang = 'en-US',
}: UseSpeechRecognitionProps): UseSpeechRecognitionReturn => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const readerRef = useRef<FileReader | null>(null);

  const isSpeechSupported = !!SpeechRecognitionAPI && !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;

  const cleanupMedia = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch(e) {/* ignore */}
    }
    mediaRecorderRef.current = null;
    if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {/* ignore */}
    }
    recognitionRef.current = null;
    audioChunksRef.current = [];
    if (readerRef.current) {
        readerRef.current.abort();
        readerRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      cleanupMedia();
    };
  }, [cleanupMedia]);


  const initializeRecognition = () => {
    if (!SpeechRecognitionAPI) return;
    recognitionRef.current = new SpeechRecognitionAPI();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = lang;

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) onTranscriptUpdate(finalTranscript, true);
      if (interimTranscript) onTranscriptUpdate(interimTranscript, false);
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error, event.message);
      setSpeechError(`Speech error: ${event.error}. ${event.message || 'Check console.'}`);
    };
  };

  const initializeMediaRecorder = (stream: MediaStream) => {
    let options = { mimeType: 'audio/webm' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'audio/ogg; codecs=opus' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options = { mimeType: '' };
        }
    }

    mediaRecorderRef.current = new MediaRecorder(stream, options.mimeType ? options : undefined);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      if (audioChunksRef.current.length > 0 && onAudioRecorded) {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' });
        const reader = new FileReader();
        readerRef.current = reader;

        reader.onloadend = () => {
          if (readerRef.current === reader) { // It hasn't been aborted
            if (onAudioRecorded) {
               onAudioRecorded(reader.result as string);
            }
            readerRef.current = null;
          }
        };
        reader.onerror = (err) => {
            console.error("FileReader error:", err);
            setSpeechError("Failed to process recorded audio.");
            readerRef.current = null;
        }
        reader.onabort = () => {
            console.log("Audio processing cancelled.");
            setSpeechError(null);
            readerRef.current = null;
        }
        reader.readAsDataURL(audioBlob);
      }
      audioChunksRef.current = [];
    };
    
    mediaRecorderRef.current.onerror = (event: Event) => {
        console.error('MediaRecorder error:', event);
        setSpeechError('Audio recording error. Check console.');
    };
  };

  const startRecording = useCallback(async () => {
    cleanupMedia(); // Ensure any previous instances are cleared before starting

    if (!isSpeechSupported) {
      setSpeechError('Speech or media recording is not supported.');
      return;
    }
    if (isRecording) return;

    setSpeechError(null);
    try {
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      initializeRecognition();
      if(onAudioRecorded) initializeMediaRecorder(mediaStreamRef.current);

      if (recognitionRef.current) recognitionRef.current.start();
      if (mediaRecorderRef.current) mediaRecorderRef.current.start();
      
      setIsRecording(true);
    } catch (err: any) {
      console.error('Error starting recording:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setSpeechError('Microphone access denied. Please allow permissions.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError'){
        setSpeechError('No microphone found. Please connect a microphone.');
      } else {
        setSpeechError(`Mic/Setup error: ${err.message || 'Unknown error'}`);
      }
      cleanupMedia();
      setIsRecording(false);
    }
  }, [isRecording, isSpeechSupported, lang, onTranscriptUpdate, onAudioRecorded, cleanupMedia]);

  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    cleanupMedia();
    setIsRecording(false);
  }, [isRecording, cleanupMedia]);

  const cancelProcessing = useCallback(() => {
    if (readerRef.current) {
        readerRef.current.abort();
    }
  }, []);

  return { isRecording, startRecording, stopRecording, cancelProcessing, speechError, isSpeechSupported };
};

export default useSpeechRecognition;
