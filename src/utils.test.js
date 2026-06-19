import { describe, it, expect } from 'vitest';
import { sanitizeHTML } from './utils.js';

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
});
