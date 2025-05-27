import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
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
  const waveformRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

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
      startWaveformAnimation();
    };

    recognition.onend = () => {
      setIsListening(false);
      onRecognitionStateChange(false);
      stopWaveformAnimation();
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
      stopWaveformAnimation();
    };

    return () => {
      stopWaveformAnimation();
    };
  }, [onResult, onRecognitionStateChange]);

  const startWaveformAnimation = () => {
    const canvas = waveformRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw multiple sine waves with different phases and amplitudes
      const waves = [
        { amplitude: 20, frequency: 0.02, speed: 0.05, color: '#00e0ff' },
        { amplitude: 15, frequency: 0.03, speed: 0.03, color: '#00ffb7' },
        { amplitude: 10, frequency: 0.04, speed: 0.04, color: '#a370f7' }
      ];

      waves.forEach(wave => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;

        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + 
                    Math.sin(x * wave.frequency + time * wave.speed) * 
                    wave.amplitude * (isListening ? 1 : 0.5);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      });

      time += 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    animate();
  };

  const stopWaveformAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

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
    <div className="flex flex-col items-center space-y-8">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center gradient-text"
      >
        Cukup ucapkan, biar kami yang hitung
      </motion.h2>

      <div className="relative w-full max-w-2xl mx-auto h-32">
        <canvas
          ref={waveformRef}
          className="absolute inset-0 w-full h-full opacity-30"
        />
        
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center h-full"
          whileHover={{ scale: 1.02 }}
        >
          <motion.button
            onClick={toggleListening}
            className={`
              w-24 h-24 rounded-full flex items-center justify-center
              bg-gradient-to-r from-neon to-neon-purple
              shadow-neon transition-all duration-300 relative
              ${isListening ? 'animate-pulse-slow' : ''}
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
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
                className="absolute -inset-2 rounded-full border-2 border-neon/30"
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {isListening && !transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 text-text-secondary"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <p>VoiceCart siap mendengarkan...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glassmorphic p-4 w-full max-w-md text-center"
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
        Ucapkan nama barang dan harga, contoh: "Indomie lima ribu"
      </motion.p>
    </div>
  );
};