import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Loader2, CheckCircle } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscript }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'fr-FR';

    recognitionRef.current.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      onTranscript(transcript);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  if (!isSupported) {
    return (
      <div className="text-xs text-red-500 italic">
        La reconnaissance vocale n'est pas supportée par votre navigateur.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleRecording}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-brand-coral text-white hover:scale-110'
          }`}
        >
          {isRecording ? <Square size={20} /> : <Mic size={20} />}
        </button>
        <div>
          <h4 className="font-bold">{isRecording ? 'Enregistrement...' : 'Note vocale'}</h4>
          <p className="text-sm text-brand-navy/50">
            {isRecording ? 'Parlez, nous transcrivons...' : 'Appuyez pour parler de votre séance.'}
          </p>
        </div>
      </div>

      {transcript && (
        <div className="p-4 bg-white/50 border border-brand-navy/5 rounded-xl text-sm italic text-brand-navy/70 relative">
          <div className="absolute top-2 right-2 text-brand-turquoise">
            <CheckCircle size={14} />
          </div>
          "{transcript}"
        </div>
      )}
    </div>
  );
};
