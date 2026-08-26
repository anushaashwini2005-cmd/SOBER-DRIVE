import { useCallback, useEffect, useRef, useState } from 'react';

const COMMAND_PATTERNS = [
  { key: 'get_me_home', phrases: ['get me home', 'take me home', 'go home'], label: 'Get me home' },
  { key: 'im_safe', phrases: ["i'm safe", 'im safe', 'i am safe'], label: "I'm safe" },
  { key: 'share_location', phrases: ['share my location', 'share location'], label: 'Share my location' },
  { key: 'request_ride', phrases: ['request my ride', 'request a ride', 'get my ride'], label: 'Request my ride' },
];

function matchCommand(transcript) {
  const lower = transcript.toLowerCase();
  return COMMAND_PATTERNS.find((cmd) => cmd.phrases.some((p) => lower.includes(p))) || null;
}

/**
 * Wraps the Web Speech API (SpeechRecognition). Falls back gracefully
 * with `supported: false` on browsers without it (e.g. Firefox).
 */
export function useVoiceAssistant({ onCommand } = {}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognizedCommand, setRecognizedCommand] = useState(null);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);
  const onCommandRef = useRef(onCommand);
  onCommandRef.current = onCommand;

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const text = Array.from(event.results).map((r) => r[0].transcript).join(' ');
      setTranscript(text);
      const isFinal = event.results[event.results.length - 1].isFinal;
      if (isFinal) {
        const cmd = matchCommand(text);
        setRecognizedCommand(cmd);
        if (cmd) onCommandRef.current?.(cmd);
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setTranscript('');
    setRecognizedCommand(null);
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      /* already started */
    }
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  // Demo fallback: simulate a recognized command without mic access.
  const simulateCommand = useCallback((key) => {
    const cmd = COMMAND_PATTERNS.find((c) => c.key === key);
    if (!cmd) return;
    setTranscript(cmd.phrases[0]);
    setRecognizedCommand(cmd);
    onCommandRef.current?.(cmd);
  }, []);

  return { listening, transcript, recognizedCommand, supported, startListening, stopListening, simulateCommand, commands: COMMAND_PATTERNS };
}
