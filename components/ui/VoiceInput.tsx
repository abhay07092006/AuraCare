'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'es-ES', label: 'Español (Spanish)' },
  { code: 'hi-IN', label: 'हिंदी (Hindi)' },
  { code: 'fr-FR', label: 'Français (French)' },
  { code: 'de-DE', label: 'Deutsch (German)' },
  { code: 'zh-CN', label: '中文 (Mandarin)' }
];

// Define browser SpeechRecognition types safely for TypeScript
interface IWindowSpeechRecognition extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [interimText, setInterimText] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const win = typeof window !== 'undefined' ? (window as unknown as IWindowSpeechRecognition) : null;
    const SpeechRecognition = win?.SpeechRecognition || win?.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLang;

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          onTranscript(finalTranscript.trim());
          setInterimText('');
        } else {
          setInterimText(currentInterim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access denied. Please grant permission in your browser.');
        } else if (event.error === 'no-speech') {
          // ignore silent pause
        } else {
          setErrorMsg(`Voice recognition: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('SpeechRecognition init error:', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [selectedLang, onTranscript]);

  const toggleRecording = () => {
    setErrorMsg(null);
    if (!recognitionRef.current) {
      setErrorMsg('Web Speech API is not supported in this browser environment.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = selectedLang;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err: any) {
        console.error('Failed to start speech recognition:', err);
        setErrorMsg('Microphone start error. Ensure no other tab is using the mic.');
      }
    }
  };

  return (
    <div className={`p-3 rounded-xl border border-teal-100 bg-teal-50/50 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleRecording}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              isListening
                ? 'bg-rose-600 text-white ring-2 ring-rose-400 ring-offset-1 animate-pulse'
                : 'bg-teal-700 hover:bg-teal-800 text-white'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5 animate-bounce" />
                <span>Stop Listening</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Voice Dictate Symptoms</span>
              </>
            )}
          </button>

          {isListening && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-rose-200 text-rose-700 text-xs font-medium">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span>Listening live... Speak clearly</span>
            </div>
          )}
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            disabled={isListening}
            className="text-xs bg-white border border-slate-200 rounded-md py-1 px-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {interimText && (
        <div className="mt-2.5 p-2 rounded-lg bg-white/90 border border-teal-200 text-xs text-teal-900 italic font-mono">
          &ldquo;{interimText}&rdquo;
        </div>
      )}

      {errorMsg && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!isSupported && (
        <div className="mt-2 text-[11px] text-slate-500">
          Note: Web Speech API may be restricted in this browser session. You can type directly in the symptom box.
        </div>
      )}
    </div>
  );
};
