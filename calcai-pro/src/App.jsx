import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sun, Moon, History as HistoryIcon, Mic, Calculator, X, Copy, Undo, RotateCcw, Clipboard, ClipboardList } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { useCalculator } from './hooks/useCalculator';
import { useNaturalLanguage } from './hooks/useNaturalLanguage';
import HistoryPanel from './components/HistoryPanel';
import VoiceInput from './components/VoiceInput';

function App() {
  const { isDark, toggleTheme } = useTheme();
  const {
    display, setDisplay, result, setResult, memory,
    history, isScientific, setIsScientific,
    calculate, scientificFunctions,
    memoryAdd, memorySubtract, memoryRecall, memoryClear
  } = useCalculator();

  const { calculateNatural } = useNaturalLanguage();
  const [showHistory, setShowHistory] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [showClipboard, setShowClipboard] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  
  // Clipboard History
  const [clipboardHistory, setClipboardHistory] = useState(() => {
    const saved = localStorage.getItem('clipboardHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('clipboardHistory', JSON.stringify(clipboardHistory));
  }, [clipboardHistory]);

  const displayRef = useRef(null);

  // Save state for undo
  const saveToUndo = useCallback(() => {
    setUndoStack(prev => [...prev, { display, result }]);
    setRedoStack([]);
  }, [display, result]);

  // Undo function (Ctrl+Z)
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    const lastState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, { display, result }]);
    setDisplay(lastState.display);
    setResult(lastState.result);
    setUndoStack(prev => prev.slice(0, -1));
  }, [undoStack, display, result]);

  // Redo function (Ctrl+Y)
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, { display, result }]);
    setDisplay(nextState.display);
    setResult(nextState.result);
    setRedoStack(prev => prev.slice(0, -1));
  }, [redoStack, display, result]);

  // Copy function with history (Ctrl+C)
  const handleCopy = useCallback(() => {
    const textToCopy = result || display || '0';
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setClipboardHistory(prev => {
        const newHistory = [textToCopy, ...prev.filter(item => item !== textToCopy)].slice(0, 10);
        return newHistory;
      });
      
      setShowCopyMessage(true);
      setTimeout(() => setShowCopyMessage(false), 2000);
    });
  }, [result, display]);

  // Paste function
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      saveToUndo();
      setDisplay(prev => prev + text);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  }, [saveToUndo]);

  // Paste from history
  const handlePasteFromHistory = useCallback((text) => {
    saveToUndo();
    setDisplay(prev => prev + text);
    setShowClipboard(false);
  }, [saveToUndo]);

  // Clear clipboard history
  const clearClipboardHistory = useCallback(() => {
    setClipboardHistory([]);
    localStorage.removeItem('clipboardHistory');
  }, []);

  // Select All (Ctrl+A)
  const handleSelectAll = useCallback(() => {
    if (displayRef.current) {
      displayRef.current.select();
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
          case 'c': e.preventDefault(); handleCopy(); break;
          case 'v': e.preventDefault(); handlePaste(); break;
          case 'z': e.preventDefault(); handleUndo(); break;
          case 'y': e.preventDefault(); handleRedo(); break;
          case 'a': e.preventDefault(); handleSelectAll(); break;
          default: break;
        }
        return;
      }

      const key = e.key;
      if (/[0-9\.\+\-\*\/\(\)]/.test(key)) {
        e.preventDefault();
        saveToUndo();
        setDisplay(prev => prev + key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        saveToUndo();
        const calcResult = calculate(display);
        setResult(calcResult);
      } else if (key === 'Backspace') {
        e.preventDefault();
        saveToUndo();
        setDisplay(prev => prev.slice(0, -1));
      } else if (key === 'Escape') {
        e.preventDefault();
        saveToUndo();
        setDisplay('');
        setResult('');
      } else if (key === 'h' || key === 'H') {
        setShowHistory(prev => !prev);
      } else if (key === 'v' || key === 'V') {
        setShowVoice(prev => !prev);
      } else if (key === 'b' || key === 'B') {
        setShowClipboard(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display, calculate, handleCopy, handlePaste, handleUndo, handleRedo, handleSelectAll, saveToUndo]);

  const handleButtonClick = (value) => {
    saveToUndo();
    setDisplay(prev => prev + value);
  };

  const calculateResult = () => {
    saveToUndo();
    const calcResult = calculate(display);
    setResult(calcResult);
  };

  const clearAll = () => {
    saveToUndo();
    setDisplay('');
    setResult('');
  };

  const clearEntry = () => {
    saveToUndo();
    setDisplay('');
  };

  const handleBackspace = () => {
    saveToUndo();
    setDisplay(prev => prev.slice(0, -1));
  };

  // ✅ FIXED: Scientific function handler
  const handleScientific = (func) => {
    saveToUndo();
    const currentNum = result || display || '0';
    const calcResult = scientificFunctions(func, currentNum);
    if (calcResult && calcResult !== 'Error') {
      setResult(calcResult);
      setDisplay(`${func}(${currentNum})`);
    } else {
      setResult('Error');
    }
  };

  // ✅ FIXED: Constants handler
  const handleConstant = (constant) => {
    saveToUndo();
    if (constant === 'π') {
      setDisplay(prev => prev + Math.PI.toFixed(6));
    } else if (constant === 'e') {
      setDisplay(prev => prev + Math.E.toFixed(6));
    }
  };

  const handleVoiceResult = (text) => {
    const { expression, result } = calculateNatural(text);
    saveToUndo();
    setDisplay(expression);
    setResult(result);
    setShowVoice(false);
  };

  const Button = ({ children, onClick, className = '', span = false }) => (
    <button onClick={onClick} className={`${span ? 'col-span-2' : ''} p-3 sm:p-4 text-base sm:text-xl font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-md ${className}`}>
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-3xl shadow-2xl p-4 sm:p-6 w-full max-w-md border border-white/20 dark:border-gray-700">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="text-indigo-600 dark:text-indigo-400" size={24} />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">AI Calc</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">v4.0 • Scientific Fixed</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleUndo} disabled={undoStack.length === 0} className={`p-2 rounded-full ${undoStack.length > 0 ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} title="Undo (Ctrl+Z)"><Undo size={18} /></button>
            <button onClick={handleRedo} disabled={redoStack.length === 0} className={`p-2 rounded-full ${redoStack.length > 0 ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} title="Redo (Ctrl+Y)"><RotateCcw size={18} /></button>
            <button onClick={handleCopy} className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300" title="Copy (Ctrl+C)"><Copy size={18} /></button>
            <button onClick={handlePaste} className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300" title="Paste (Ctrl+V)"><Clipboard size={18} /></button>
            <button onClick={() => setShowClipboard(!showClipboard)} className={`p-2 rounded-full ${showClipboard ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'}`} title="Clipboard History (B)"><ClipboardList size={18} /></button>
            <button onClick={() => setShowVoice(!showVoice)} className="p-2 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300" title="Voice (V)"><Mic size={18} /></button>
            <button onClick={() => setShowHistory(!showHistory)} className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300" title="History (H)"><HistoryIcon size={18} /></button>
            <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300">{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
          </div>
        </div>

        {/* Copy success message */}
        {showCopyMessage && (
          <div className="mb-2 p-2 bg-green-100 text-green-700 rounded-lg text-sm text-center animate-pulse">
            ✓ Copied to clipboard & history!
          </div>
        )}

        {/* Clipboard History Panel */}
        {showClipboard && (
          <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <ClipboardList size={16} />
                Clipboard History (Last 10)
              </h3>
              {clipboardHistory.length > 0 && (
                <button onClick={clearClipboardHistory} className="text-xs text-red-500 hover:text-red-600">Clear All</button>
              )}
            </div>
            
            {clipboardHistory.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-2">No copies yet. Press Ctrl+C to copy</p>
            ) : (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {clipboardHistory.map((item, index) => (
                  <div key={index} onClick={() => handlePasteFromHistory(item)} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/30 group">
                    <span className="text-sm font-mono truncate flex-1">{item}</span>
                    <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(item); setShowCopyMessage(true); setTimeout(() => setShowCopyMessage(false), 2000); }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="Copy again"><Copy size={12} /></button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">💡 Click any item to paste | B key to toggle</p>
          </div>
        )}

        {showVoice && (
          <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Voice Input</span>
              <button onClick={() => setShowVoice(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
            <VoiceInput onResult={handleVoiceResult} />
          </div>
        )}

        {showHistory && (
          <div className="mb-4">
            <HistoryPanel history={history} onSelect={(expr) => { saveToUndo(); setDisplay(expr); }} onClear={() => { localStorage.removeItem('calculatorHistory'); window.location.reload(); }} />
          </div>
        )}

        {/* Display */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 mb-4 border-2 border-gray-200 dark:border-gray-700 shadow-inner">
          <input ref={displayRef} type="text" value={display} readOnly className="w-full text-right text-gray-500 dark:text-gray-400 text-sm h-6 font-mono bg-transparent outline-none overflow-x-auto" placeholder=" " />
          <div className="text-right text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 font-mono overflow-x-auto break-all">{result || '0'}</div>
        </div>

        {memory !== null && (
          <div className="flex items-center gap-2 mb-2 text-sm">
            <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full font-semibold">M = {memory}</span>
          </div>
        )}

        <div className="flex justify-end mb-2">
          <button onClick={() => setIsScientific(!isScientific)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-md ${isScientific ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
            {isScientific ? '🔬 Scientific' : '📱 Basic'}
          </button>
        </div>

        {/* ✅ FIXED: Scientific Panel */}
        {isScientific && (
          <div className="grid grid-cols-5 gap-1 sm:gap-2 mb-2">
            {/* Trigonometry */}
            <button onClick={() => handleScientific('sin')} className="btn-scientific">sin</button>
            <button onClick={() => handleScientific('cos')} className="btn-scientific">cos</button>
            <button onClick={() => handleScientific('tan')} className="btn-scientific">tan</button>
            <button onClick={() => handleScientific('asin')} className="btn-scientific">sin⁻¹</button>
            <button onClick={() => handleScientific('acos')} className="btn-scientific">cos⁻¹</button>
            
            <button onClick={() => handleScientific('atan')} className="btn-scientific">tan⁻¹</button>
            <button onClick={() => handleScientific('log')} className="btn-scientific">log</button>
            <button onClick={() => handleScientific('ln')} className="btn-scientific">ln</button>
            <button onClick={() => handleScientific('sqrt')} className="btn-scientific">√</button>
            <button onClick={() => handleScientific('cbrt')} className="btn-scientific">∛</button>
            
            <button onClick={() => handleScientific('square')} className="btn-scientific">x²</button>
            <button onClick={() => handleScientific('cube')} className="btn-scientific">x³</button>
            <button onClick={() => handleScientific('factorial')} className="btn-scientific">n!</button>
            <button onClick={() => handleConstant('π')} className="btn-scientific">π</button>
            <button onClick={() => handleConstant('e')} className="btn-scientific">e</button>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 mb-2">
          <button onClick={() => memoryAdd(result)} className="btn-memory">M+</button>
          <button onClick={() => memorySubtract(result)} className="btn-memory">M-</button>
          <button onClick={() => { const val = memoryRecall(); if (val !== '0') handleButtonClick(val); }} className="btn-memory">MR</button>
          <button onClick={memoryClear} className="btn-memory">MC</button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Button onClick={clearAll} className="btn-primary">AC</Button>
          <Button onClick={clearEntry} className="btn-operator">C</Button>
          <Button onClick={handleBackspace} className="btn-operator">⌫</Button>
          <Button onClick={() => handleButtonClick('÷')} className="btn-operator">÷</Button>
          
          <Button onClick={() => handleButtonClick('7')} className="btn-secondary">7</Button>
          <Button onClick={() => handleButtonClick('8')} className="btn-secondary">8</Button>
          <Button onClick={() => handleButtonClick('9')} className="btn-secondary">9</Button>
          <Button onClick={() => handleButtonClick('×')} className="btn-operator">×</Button>
          
          <Button onClick={() => handleButtonClick('4')} className="btn-secondary">4</Button>
          <Button onClick={() => handleButtonClick('5')} className="btn-secondary">5</Button>
          <Button onClick={() => handleButtonClick('6')} className="btn-secondary">6</Button>
          <Button onClick={() => handleButtonClick('-')} className="btn-operator">-</Button>
          
          <Button onClick={() => handleButtonClick('1')} className="btn-secondary">1</Button>
          <Button onClick={() => handleButtonClick('2')} className="btn-secondary">2</Button>
          <Button onClick={() => handleButtonClick('3')} className="btn-secondary">3</Button>
          <Button onClick={() => handleButtonClick('+')} className="btn-operator">+</Button>
          
          <Button onClick={() => handleButtonClick('0')} span={true} className="btn-secondary">0</Button>
          <Button onClick={() => handleButtonClick('.')} className="btn-secondary">.</Button>
          <Button onClick={() => handleButtonClick('(')} className="btn-secondary">(</Button>
          <Button onClick={() => handleButtonClick(')')} className="btn-secondary">)</Button>
          
          <Button onClick={calculateResult} span={true} className="bg-green-500 text-white hover:bg-green-600 col-span-4">= Calculate</Button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg">
            ⌨️ H:History • V:Voice • B:Clipboard
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg">
            Ctrl+C:Copy • Ctrl+V:Paste • Ctrl+Z:Undo
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;