import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceRecognitionProps {
  onResult: (transcript: string) => void;
  onRecognitionStateChange: (isRecognizing: boolean) => void;
}

export const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({
  onResult,
  onRecognitionStateChange
}) => {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Browser tidak mendukung speech recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'id-ID';
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      onRecognitionStateChange(true);
    };

    recognition.onend = () => {
      setIsListening(false);
      onRecognitionStateChange(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const lastResult = event.results[event.results.length - 1];
      const spoken = lastResult[0].transcript;
      setTranscript(spoken);

      if (lastResult.isFinal) {
        onResult(spoken.trim());
        setTranscript('');
      }
    };

    recognition.onerror = (event: any) => {
      setErrorMessage(`Error: ${event.error}`);
      setIsListening(false);
      onRecognitionStateChange(false);
    };
  }, [onResult, onRecognitionStateChange]);

  const toggleListening = () => {
    const recognition = recognitionRef.current;

    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      setErrorMessage(null);
      try {
        recognition.start();
      } catch (e) {
        setErrorMessage('Tidak dapat memulai pengenalan suara.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-center gradient-text"
      >
        Voice Recognition
      </motion.h2>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <motion.button
          onClick={toggleListening}
          className={`
            w-24 h-24 rounded-full flex items-center justify-center
            bg-gradient-to-r from-primary to-secondary
            shadow-glow transition-all duration-300
            ${isListening ? 'animate-pulse-slow' : ''}
          `}
          aria-label="Tombol pengenalan suara"
        >
          <motion.div
            animate={isListening ? {
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {isListening ? (
              <Mic className="w-10 h-10 text-white" />
            ) : (
              <MicOff className="w-10 h-10 text-white" />
            )}
          </motion.div>
        </motion.button>
        
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute -inset-2 rounded-full border-2 border-primary/30"
            />
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isListening && !transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 text-text-secondary"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <p>Mendengarkan...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-space-dark-mid/50 p-4 rounded-lg w-full max-w-md text-center"
          >
            <p className="text-text-primary">{transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {errorMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-red-500 text-center"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-center text-text-secondary max-w-md"
      >
        Ucapkan nama barang dan harga. Contoh: "Indomie lima ribu"
      </motion.p>
    </div>
  );
};