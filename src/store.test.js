import { describe, it, expect, vi, beforeEach } from 'vitest';
import { state, setState } from './store.js';

describe('store.js', () => {
  beforeEach(() => {
    // Reset state before each test
    state.footprint = null;
    state.activeActions = {};
    
    // Mock localStorage
    const store = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => { store[key] = value.toString(); })
    });
  });

  it('should initialize with default state', () => {
    expect(state.currentSection).toBe('hero');
    expect(state.companionMood).toBe('happy');
    expect(state.marketplaceSort).toBe('impact');
  });

  it('should update state and save to localStorage for footprint', () => {
    setState('footprint', 5.5);
    expect(state.footprint).toBe(5.5);
    expect(localStorage.setItem).toHaveBeenCalledWith('earthpulse_footprint', '5.5');
  });

  it('should update state and save activeActions with modified key', () => {
    setState('activeActions', { test: true });
    expect(state.activeActions.test).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('earthpulse_activeActions', JSON.stringify({ test: true }));
  });

  it('should update state without saving to localStorage for volatile keys', () => {
    setState('currentSection', 'dashboard');
    expect(state.currentSection).toBe('dashboard');
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
