import { loadData, saveData } from './utils.js';

/**
 * Global application state.
 * Extracts state management from UI logic for better modularity.
 */
export const state = {
  currentSection: 'hero',
  footprint: loadData('footprint', null),
  chatImpact: {},
  chatStep: 'welcome',
  mythIndex: 0,
  mythScore: { correct: 0, total: 0 },
  activeActions: loadData('activeActions', {}),
  joinedChallenges: loadData('joinedChallenges', {}),
  selectedProduct: null,
  selectedWhatIf: null,
  companionMood: 'happy',
  initialized: new Set(),
  marketplaceSort: 'impact',
  challengeTab: 'daily',
};

/**
 * Updates a state value and automatically persists it if needed.
 * @param {string} key - State key
 * @param {*} value - New value
 */
export function setState(key, value) {
  state[key] = value;
  if (['footprint', 'activeActions', 'joinedChallenges'].includes(key)) {
    saveData(key, value);
  }
}
