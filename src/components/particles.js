import { debounce } from '../utils.js';

let globalDangerRatio = 0;

export function setParticleDanger(ratio) {
  // ratio between 0 and 1
  globalDangerRatio = Math.max(0, Math.min(1, ratio));
}

// Lightweight particle system (no external dependency needed)
export function initParticles(container) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  container.appendChild(canvas);

  let w, h;
  const particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', debounce(resize, 200));

  // Create particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      baseHue: Math.random() > 0.5 ? 152 : 210, // green or blue
      pulse: Math.random() * Math.PI * 2,
    });
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, w, h);

    const speedMultiplier = 1 + (globalDangerRatio * 4); // up to 5x speed
    const targetHue = 15; // Orange/Red

    for (const p of particles) {
      p.x += p.vx * speedMultiplier;
      p.y += p.vy * speedMultiplier;
      p.pulse += 0.01 * speedMultiplier;

      // Wrap around
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      const opacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
      const currentHue = p.baseHue * (1 - globalDangerRatio) + targetHue * globalDangerRatio;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${currentHue}, 70%, 60%, ${opacity})`;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${currentHue}, 70%, 60%, ${opacity * 0.15})`;
      ctx.fill();
    }

    // Draw connections between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          
          const currentHue = particles[i].baseHue * (1 - globalDangerRatio) + targetHue * globalDangerRatio;
          ctx.strokeStyle = `hsla(${currentHue}, 50%, 50%, ${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  animate();
}
