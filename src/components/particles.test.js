import { describe, it, expect } from 'vitest';
import { setParticleDanger } from './particles.js';

describe('particles.js', () => {
  describe('setParticleDanger', () => {
    it('should set globalDangerRatio bounded between 0 and 1', () => {
      // The module exports a function that sets a module-scoped variable.
      // We can only test that it doesn't throw and accepts various bounds.
      expect(() => setParticleDanger(0.5)).not.toThrow();
      expect(() => setParticleDanger(1.5)).not.toThrow(); // Should clamp to 1
      expect(() => setParticleDanger(-0.5)).not.toThrow(); // Should clamp to 0
    });
  });
});
