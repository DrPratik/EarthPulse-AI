/**
 * Utility helpers
 * Animates a numerical counter in the DOM from 0 to a target value.
 *
 * @param {HTMLElement} el - The DOM element to update.
 * @param {number} target - The final target number to animate to.
 * @param {number} [duration=1500] - The animation duration in milliseconds.
 * @param {number} [decimals=0] - The number of decimal places to format the output.
 */
export function animateCount(el, target, duration = 1500, decimals = 0) {
  const start = 0;
  const startTime = performance.now();
  const format = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toFixed(decimals);
  };
  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = format(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/**
 * Generates a random float between the specified min and max bounds.
 *
 * @param {number} min - The minimum bound (inclusive).
 * @param {number} max - The maximum bound (exclusive).
 * @returns {number} A random float within the bounds.
 */
export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Halts execution for a specified duration using Promises.
 *
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>} A promise that resolves after the timeout.
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Saves a key-value pair to the browser's localStorage, wrapped in a namespace.
 *
 * @param {string} key - The lookup key.
 * @param {*} value - The serializable object or primitive to save.
 */
export function saveData(key, value) {
  try { localStorage.setItem(`earthpulse_${key}`, JSON.stringify(value)); } catch(e) {}
}

/**
 * Retrieves a parsed value from localStorage. Returns a fallback if parsing fails.
 *
 * @param {string} key - The lookup key.
 * @param {*} [fallback=null] - The default value to return if the key doesn't exist.
 * @returns {*} The parsed object or the fallback value.
 */
export function loadData(key, fallback = null) {
  try {
    const v = localStorage.getItem(`earthpulse_${key}`);
    return v ? JSON.parse(v) : fallback;
  } catch(e) { return fallback; }
}

/**
 * Escapes unsafe HTML characters to prevent DOM-based XSS attacks.
 *
 * @param {string} str - The raw user or API string.
 * @returns {string} The HTML-escaped safe string.
 */
export function sanitizeHTML(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>"']/g, function (match) {
    const escape = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return escape[match];
  });
}

/**
 * Debounces a high-frequency event handler to optimize performance (e.g. window resizing).
 *
 * @param {Function} func - The callback function to execute.
 * @param {number} [wait=100] - The delay in milliseconds to wait before invoking.
 * @returns {Function} A debounced wrapper function.
 */
export function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
