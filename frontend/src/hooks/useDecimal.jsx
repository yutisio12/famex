// hooks/useDecimal.js
import { useCallback } from 'react';

export const useDecimal = () => {
  const cleanDecimal = useCallback((value) => {
    if (value === null || value === undefined) return 0;
    
    const stringValue = value.toString().trim();
    const cleanValue = stringValue.replace(/[^\d.]/g, '');
    
    const parts = cleanValue.split('.');
    let formattedValue = parts[0];
    
    if (parts.length > 1) {
      formattedValue += '.' + parts.slice(1).join('').substring(0, 2);
    }
    
    const result = parseFloat(formattedValue);
    return isNaN(result) ? 0 : result;
  }, []);

  const sumDecimals = useCallback((numbers) => {
    return numbers.reduce((total, num) => {
      return total + cleanDecimal(num);
    }, 0);
  }, [cleanDecimal]);

  const formatDisplay = useCallback((value, precision = 2) => {
    const cleaned = cleanDecimal(value);
    return cleaned.toFixed(precision);
  }, [cleanDecimal]);

  return {
    cleanDecimal,
    sumDecimals,
    formatDisplay
  };
};