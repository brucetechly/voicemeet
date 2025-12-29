
import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Loader2, Play } from 'lucide-react';

interface VoiceOverlayProps {
  onResult: (text: string) => void;
  onClose: () => void;
  isProcessing: boolean;
}

const VoiceOverlay: React.FC<VoiceOverlayProps> = ({ onResult, onClose, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultTranscript = event.results[current][0].transcript;
        setTranscript(resultTranscript);
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
      
      startListening();
    } else {
      alert("Speech recognition not supported in this browser.");
      onClose();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      if (transcript.trim()) {
        onResult(transcript);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl transition-all duration-300">
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative flex items-center justify-center mb-12">
        {/* Pulsing rings */}
        <div className={`absolute w-48 h-48 rounded-full bg-indigo-500/20 animate-ping ${isListening ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
        <div className={`absolute w-64 h-64 rounded-full bg-purple-500/10 animate-pulse ${isListening ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
        
        {/* Main Mic Button */}
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.5)]">
          {isProcessing ? (
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          ) : isListening ? (
            <div className="flex gap-1 items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="w-1 bg-white rounded-full animate-bounce" 
                  style={{ height: `${12 + Math.random() * 24}px`, animationDelay: `${i * 0.1}s` }} 
                />
              ))}
            </div>
          ) : (
            <Mic className="w-12 h-12 text-white" />
          )}
        </div>
      </div>

      <div className="max-w-2xl px-6 text-center">
        <h2 className="text-3xl font-bold mb-4 tracking-tight">
          {isProcessing ? "Analyzing your request..." : isListening ? "Listening to you..." : "Ready to listen"}
        </h2>
        <p className="text-slate-400 text-lg italic min-h-[1.5em] transition-all">
          {transcript || "Try saying: 'Schedule a lunch with Dave at 1pm tomorrow'"}
        </p>
      </div>

      {isListening && (
        <button 
          onClick={stopListening}
          className="mt-12 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold shadow-lg transition-transform active:scale-95"
        >
          I'm done
        </button>
      )}
    </div>
  );
};

export default VoiceOverlay;
