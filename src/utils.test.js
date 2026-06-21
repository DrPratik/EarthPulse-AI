import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sanitizeHTML, randomBetween, sleep, saveData, loadData } from './utils.js';

describe('utils.js', () => {
  
  describe('sanitizeHTML', () => {
    it('should escape malicious HTML characters to prevent XSS', () => {
      const input = '<script>alert("XSS")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
      expect(sanitizeHTML(input)).toBe(expected);
    });

    it('should return non-strings as is', () => {
      expect(sanitizeHTML(123)).toBe(123);
      expect(sanitizeHTML(null)).toBe(null);
    });

    it('should handle standard text without modifying it', () => {
      const input = 'Normal string with spaces';
      expect(sanitizeHTML(input)).toBe(input);
    });

    it('should escape single quotes properly', () => {
      const input = "User's data";
      const expected = 'User&#39;s data';
      expect(sanitizeHTML(input)).toBe(expected);
    });
  });

  describe('randomBetween', () => {
    it('should return a number between min and max', () => {
      for (let i = 0; i < 100; i++) {
        const val = randomBetween(5, 10);
        expect(val).toBeGreaterThanOrEqual(5);
        expect(val).toBeLessThanOrEqual(10);
      }
    });
    
    it('should handle negative numbers', () => {
      const val = randomBetween(-10, -5);
      expect(val).toBeGreaterThanOrEqual(-10);
      expect(val).toBeLessThanOrEqual(-5);
    });
  });

  describe('sleep', () => {
    it('should return a Promise', () => {
      const result = sleep(10);
      expect(result).toBeInstanceOf(Promise);
    });
    
    it('should resolve after roughly the specified time', async () => {
      const start = Date.now();
      await sleep(50);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(40); // Allow slight timing variations
    });
  });

  describe('localStorage Utilities', () => {
    beforeEach(() => {
      // Setup a simple mock for localStorage before each test
      const store = {};
      vi.stubGlobal('localStorage', {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
        clear: vi.fn(() => { Object.keys(store).forEach(key => delete store[key]); })
      });
    });

    describe('saveData', () => {
      it('should save data to localStorage with earthpulse_ prefix', () => {
        saveData('testKey', { a: 1 });
        expect(localStorage.setItem).toHaveBeenCalledWith('earthpulse_testKey', '{"a":1}');
      });

      it('should handle string values', () => {
        saveData('testString', 'hello');
        expect(localStorage.setItem).toHaveBeenCalledWith('earthpulse_testString', '"hello"');
      });
    });

    describe('loadData', () => {
      it('should load and parse data from localStorage', () => {
        saveData('testKey', { b: 2 });
        const result = loadData('testKey');
        expect(result).toEqual({ b: 2 });
        expect(localStorage.getItem).toHaveBeenCalledWith('earthpulse_testKey');
      });

      it('should return fallback if key does not exist', () => {
        const result = loadData('missingKey', 'defaultFallback');
        expect(result).toBe('defaultFallback');
      });

      it('should return fallback if JSON parsing fails', () => {
        // Manually set invalid JSON
        localStorage.setItem('earthpulse_badJson', '{bad: json}');
        const result = loadData('badJson', 'fallbackValue');
        expect(result).toBe('fallbackValue');
      });
    });
  });
});
