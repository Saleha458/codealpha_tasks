import React, { useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';

const VoiceInput = ({ onResult }) => {
  const { isListening, transcript, error, startListening } = useVoiceInput();

  useEffect(() => {
    if (transcript) {
      onResult(transcript);
    }
  }, [transcript, onResult]);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={startListening}
        disabled={isListening}
        className={`p-4 rounded-full transition-all ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300'
        }`}
        title="Click and speak"
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </button>
      
      {isListening && (
        <p className="text-sm text-purple-600 dark:text-purple-400 animate-pulse">
          Listening... Speak now
        </p>
      )}
      
      {error && (
        <div className="flex items-center gap-1 text-xs text-red-500 bg-red-50 dark:bg-red-900/30 p-2 rounded">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;