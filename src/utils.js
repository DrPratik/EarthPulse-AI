// Utility helpers
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

export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function saveData(key, value) {
  try { localStorage.setItem(`earthpulse_${key}`, JSON.stringify(value)); } catch(e) {}
}

export function loadData(key, fallback = null) {
  try {
    const v = localStorage.getItem(`earthpulse_${key}`);
    return v ? JSON.parse(v) : fallback;
  } catch(e) { return fallback; }
}

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

export function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
