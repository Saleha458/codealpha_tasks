import { useState, useCallback, useEffect } from 'react';
import { evaluate } from 'mathjs';

export const useCalculator = () => {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState('');
  const [memory, setMemory] = useState(null);
  const [history, setHistory] = useState([]);
  const [isScientific, setIsScientific] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = useCallback((expression, result) => {
    const newHistory = [...history, { expression, result, timestamp: Date.now() }].slice(-10);
    setHistory(newHistory);
    localStorage.setItem('calculatorHistory', JSON.stringify(newHistory));
  }, [history]);

  const calculate = useCallback((expr) => {
    try {
      if (!expr) return '0';
      
      let sanitized = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'pi')
        .replace(/e/g, '2.718281828459045');
      
      const calculated = evaluate(sanitized);
      
      if (isNaN(calculated) || !isFinite(calculated)) {
        return 'Error';
      }
      
      saveToHistory(expr, calculated);
      return calculated.toString();
    } catch (error) {
      return 'Error';
    }
  }, [saveToHistory]);

  const scientificFunctions = useCallback((func, value) => {
    try {
      const num = parseFloat(value) || 0;
      let result;

      switch(func) {
        case 'sin': result = Math.sin(num * Math.PI / 180); break;
        case 'cos': result = Math.cos(num * Math.PI / 180); break;
        case 'tan': result = Math.tan(num * Math.PI / 180); break;
        case 'asin': result = Math.asin(num) * 180 / Math.PI; break;
        case 'acos': result = Math.acos(num) * 180 / Math.PI; break;
        case 'atan': result = Math.atan(num) * 180 / Math.PI; break;
        case 'log': result = Math.log10(num); break;
        case 'ln': result = Math.log(num); break;
        case 'sqrt': result = Math.sqrt(num); break;
        case 'cbrt': result = Math.cbrt(num); break;
        case 'square': result = Math.pow(num, 2); break;
        case 'cube': result = Math.pow(num, 3); break;
        case 'factorial':
          if (num < 0) return 'Error';
          let fact = 1;
          for(let i = 2; i <= num; i++) fact *= i;
          result = fact;
          break;
        default: return null;
      }
      return result.toString();
    } catch (error) {
      return 'Error';
    }
  }, []);

  const memoryAdd = useCallback((value) => {
    const num = parseFloat(value) || 0;
    setMemory(prev => (prev || 0) + num);
  }, []);

  const memorySubtract = useCallback((value) => {
    const num = parseFloat(value) || 0;
    setMemory(prev => (prev || 0) - num);
  }, []);

  const memoryRecall = useCallback(() => {
    return memory ? memory.toString() : '0';
  }, [memory]);

  const memoryClear = useCallback(() => {
    setMemory(null);
  }, []);

  return {
    display, setDisplay,
    result, setResult,
    memory,
    history,
    isScientific, setIsScientific,
    calculate,
    scientificFunctions,
    memoryAdd, memorySubtract, memoryRecall, memoryClear
  };
};