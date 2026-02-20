import { useCallback } from 'react';
import { evaluate } from 'mathjs';

export const useNaturalLanguage = () => {
  const parseNaturalLanguage = useCallback((text) => {
    const lowerText = text.toLowerCase();
    
    // Basic arithmetic
    if (lowerText.includes('plus') || lowerText.includes('add')) {
      const numbers = lowerText.match(/\d+\.?\d*/g);
      if (numbers && numbers.length === 2) return `${numbers[0]} + ${numbers[1]}`;
    }
    
    if (lowerText.includes('minus') || lowerText.includes('subtract')) {
      const numbers = lowerText.match(/\d+\.?\d*/g);
      if (numbers && numbers.length === 2) return `${numbers[0]} - ${numbers[1]}`;
    }
    
    if (lowerText.includes('times') || lowerText.includes('multiply')) {
      const numbers = lowerText.match(/\d+\.?\d*/g);
      if (numbers && numbers.length === 2) return `${numbers[0]} * ${numbers[1]}`;
    }
    
    if (lowerText.includes('divided by')) {
      const numbers = lowerText.match(/\d+\.?\d*/g);
      if (numbers && numbers.length === 2) return `${numbers[0]} / ${numbers[1]}`;
    }
    
    // Scientific
    if (lowerText.includes('sine of') || lowerText.includes('sin of')) {
      const num = lowerText.match(/\d+\.?\d*/g)?.[0];
      if (num) return `sin(${num} * pi / 180)`;
    }
    
    if (lowerText.includes('cosine of') || lowerText.includes('cos of')) {
      const num = lowerText.match(/\d+\.?\d*/g)?.[0];
      if (num) return `cos(${num} * pi / 180)`;
    }
    
    if (lowerText.includes('tangent of') || lowerText.includes('tan of')) {
      const num = lowerText.match(/\d+\.?\d*/g)?.[0];
      if (num) return `tan(${num} * pi / 180)`;
    }
    
    if (lowerText.includes('square root of') || lowerText.includes('sqrt of')) {
      const num = lowerText.match(/\d+\.?\d*/g)?.[0];
      if (num) return `sqrt(${num})`;
    }
    
    if (lowerText.includes('log of')) {
      const num = lowerText.match(/\d+\.?\d*/g)?.[0];
      if (num) return `log10(${num})`;
    }
    
    return text;
  }, []);

  const calculateNatural = useCallback((text) => {
    try {
      const expression = parseNaturalLanguage(text);
      const result = evaluate(expression);
      return { expression, result: result.toString() };
    } catch (error) {
      return { expression: text, result: 'Error' };
    }
  }, [parseNaturalLanguage]);

  return { parseNaturalLanguage, calculateNatural };
};