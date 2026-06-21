import './styles/index.css';
import { initParticles, setParticleDanger } from './components/particles.js';
import { createEarthGlobe } from './components/earth-globe.js';
import { animateCount, sleep, saveData, loadData, sanitizeHTML } from './utils.js';
import {
  climateStats, chatFlow, equivalencies, actions,
  timelineProjections, products, knowledgeTopics, myths,
  whatIfScenarios, companionMessages, wowData,
  challenges, marketplaceActions, generationalData
} from './data/climate-data.js';
import { fetchWeatherData, fetchWorldBankEmissions } from './api.js';

// ── App State ──
const state = {
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
// ── Dynamic Environment ──
function getCurrentEffectiveFootprint() {
  const base = state.footprint || 7.2;
  const savings = actions
    .filter(a => state.activeActions[a.id])
    .reduce((sum, a) => sum + (a.dailySave * 365) / 1000, 0);
  return Math.max(0.5, base - savings);
}

function updateEnvironmentAtmosphere() {
  const footprint = getCurrentEffectiveFootprint();
  // Ratio: 0 at <= 2 tonnes (perfect), 1 at >= 15 tonnes (danger)
  let ratio = (footprint - 2) / (15 - 2);
  ratio = Math.max(0, Math.min(1, ratio));
  
  setParticleDanger(ratio);
  
  const root = document.documentElement;
  const h1 = 152 * (1 - ratio) + 15 * ratio;
  const h2 = 270 * (1 - ratio) + 30 * ratio;
  const h3 = 210 * (1 - ratio) + 0 * ratio;
  
  root.style.setProperty('--aurora-1', `hsla(${h1}, 69%, 42%, 0.15)`);
  root.style.setProperty('--aurora-2', `hsla(${h2}, 65%, 55%, 0.12)`);
  root.style.setProperty('--aurora-3', `hsla(${h3}, 78%, 52%, 0.1)`);
}

// ── Initialize App ──
document.addEventListener('DOMContentLoaded', () => {
  initParticles(document.getElementById('particle-canvas'));
  updateEnvironmentAtmosphere();
  initScrollProgress();
  initNavigation();
  initTooltips();
  initEcoMode();
  initIntersectionObserver();
  initCompanion();
  initHero();
  initLivingEarth();
  initCarbonPulse();
  initLocalEnvironment();
  initChat();
  initCarbonTwin();
  initDashboard();
  initCarbonBudget();
  initActionsLab();
  initTimeMachine();
  initGenerationalImpact();
  initConsumption();
  initKnowledge();
  initImpactStories();
  initMythBuster();
  initChallenges();
  initWhatIf();
  initMarketplace();
  initPledgeWall();
  initWrapped();
  initWowMoment();

  // Smooth scroll for hero CTA
  document.getElementById('hero-start-btn')?.addEventListener('click', () => {
    document.getElementById('footprint-chat')?.scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('hero-explore-btn')?.addEventListener('click', () => {
    document.getElementById('living-earth')?.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Scroll Progress Bar ──
function initScrollProgress() {
  const fill = document.getElementById('scroll-progress-fill');
  const aurora = document.getElementById('aurora-bg');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        fill.style.width = `${Math.min(100, progress)}%`;
        
        // Cinematic Parallax
        if (aurora) {
          aurora.style.transform = `translateY(${scrollTop * 0.4}px)`;
        }
        
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ── Navigation ──
function initNavigation() {
  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'carbon-pulse', label: 'Live Pulse' },
    { id: 'living-earth', label: 'Living Earth' },
    { id: 'local-env', label: 'Your Area' },
    { id: 'footprint-chat', label: 'Footprint' },
    { id: 'carbon-twin', label: 'Carbon Twin' },
    { id: 'daily-dashboard', label: 'Dashboard' },
    { id: 'carbon-budget', label: 'Budget' },
    { id: 'actions-lab', label: 'Actions' },
    { id: 'time-machine', label: 'Time Machine' },
    { id: 'generational', label: 'Generations' },
    { id: 'consumption-story', label: 'Stories' },
    { id: 'knowledge-hub', label: 'Knowledge' },
    { id: 'impact-stories', label: 'Impact Stories' },
    { id: 'myth-buster', label: 'Myths' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'what-if', label: 'What If' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'pledge-wall', label: 'Pledge Wall' },
    { id: 'wrapped', label: 'Wrapped' },
    { id: 'wow-moment', label: '2050' },
  ];

  const dotsContainer = document.getElementById('nav-dots');
  sections.forEach(s => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.dataset.section = s.id;
    dot.dataset.label = s.label;
    dot.setAttribute('aria-label', `Go to ${s.label}`);
    dot.addEventListener('click', () => {
      document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
    });
    dotsContainer.appendChild(dot);
  });
}

// ── Intersection Observer ──
function initIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const sectionId = entry.target.dataset.section;
        if (sectionId) {
          state.currentSection = sectionId;
          updateActiveNav(sectionId);
          updateCompanionForSection(sectionId);
        }
      }
    });
  }, { threshold: 0.15, rootMargin: '-5% 0px' });

  document.querySelectorAll('.section').forEach(s => observer.observe(s));
}

function updateActiveNav(sectionId) {
  document.querySelectorAll('.nav-dot').forEach(d => {
    d.classList.toggle('active', d.dataset.section === sectionId);
  });
}

// ── Earth Companion ──
function initCompanion() {
  const companion = document.getElementById('earth-companion');

  companion.querySelector('.companion-body').addEventListener('click', () => {
    const key = getSectionCompanionKey(state.currentSection);
    const msgs = companionMessages[key] || companionMessages.neutral;
    showCompanionMessage(msgs[Math.floor(Math.random() * msgs.length)]);
  });

  setTimeout(() => {
    showCompanionMessage(companionMessages.welcome[0]);
  }, 2000);

  // Scroll velocity tracking for 'dizzy' effect
  let lastScrollTop = window.scrollY;
  let lastScrollTime = Date.now();
  let scrollTimeout;

  window.addEventListener('scroll', () => {
    const st = window.scrollY;
    const time = Date.now();
    const velocity = Math.abs(st - lastScrollTop) / (time - lastScrollTime);
    lastScrollTop = st;
    lastScrollTime = time;

    if (velocity > 3) {
      setCompanionMood('dizzy');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setCompanionMood('neutral');
        updateCompanionForSection(state.currentSection); // restore proper mood
      }, 500);
    }
  });
}

function showCompanionMessage(text) {
  const speechBubble = document.getElementById('companion-speech');
  speechBubble.textContent = text;
  speechBubble.classList.add('visible');
  clearTimeout(speechBubble._hideTimeout);
  speechBubble._hideTimeout = setTimeout(() => speechBubble.classList.remove('visible'), 5000);
}

function setCompanionMood(mood) {
  const companion = document.getElementById('earth-companion');
  companion.className = `earth-companion ${mood}`;
  state.companionMood = mood;
}

function getSectionCompanionKey(sectionId) {
  const map = {
    'hero': 'welcome', 'carbon-pulse': 'livingEarth', 'living-earth': 'livingEarth', 'local-env': 'livingEarth',
    'footprint-chat': 'chat', 'carbon-twin': 'dashboard', 'daily-dashboard': 'dashboard', 'carbon-budget': 'livingEarth',
    'actions-lab': 'actionsLab', 'time-machine': 'timeMachine', 'generational': 'timeMachine',
    'consumption-story': 'consumption', 'knowledge-hub': 'knowledge', 'impact-stories': 'timeMachine',
    'myth-buster': 'myths', 'challenges': 'actionsLab', 'what-if': 'whatIf', 'marketplace': 'actionsLab',
    'pledge-wall': 'actionsLab', 'wrapped': 'wrapped', 'wow-moment': 'wow',
  };
  return map[sectionId] || 'neutral';
}

function updateCompanionForSection(sectionId) {
  const key = getSectionCompanionKey(sectionId);
  const msgs = companionMessages[key] || companionMessages.neutral;
  if (!state.initialized.has('companion_' + sectionId)) {
    state.initialized.add('companion_' + sectionId);
    setTimeout(() => showCompanionMessage(msgs[0]), 800);
  }
}

// ── HERO ──
function initHero() {
  const earthContainer = document.getElementById('hero-earth-container');
  if (earthContainer) {
    try {
      createEarthGlobe(earthContainer);
    } catch (e) {
      console.warn('WebGL not available, showing fallback earth');
      earthContainer.innerHTML = '<div style="font-size:10rem;text-align:center;line-height:1;">🌍</div>';
    }
  }

  const statsContainer = document.getElementById('hero-stats');
  const heroStats = [
    { value: 424.8, label: 'CO₂ (ppm)', decimals: 1 },
    { value: 1.48, label: '°C Warming', decimals: 2 },
    { value: 32.7, label: 'TWh Renewable Today', decimals: 1 },
  ];

  heroStats.forEach(stat => {
    const el = document.createElement('div');
    el.className = 'hero-stat';
    el.innerHTML = `
      <div class="hero-stat-value" data-target="${stat.value}">0</div>
      <div class="hero-stat-label">${stat.label}</div>
    `;
    statsContainer.appendChild(el);
  });

  setTimeout(() => {
    statsContainer.querySelectorAll('.hero-stat-value').forEach(el => {
      animateCount(el, parseFloat(el.dataset.target), 2000, el.dataset.target.includes('.') ? 1 : 0);
    });
  }, 1200);
}

// ── SECTION: LIVING EARTH ──
function initLivingEarth() {
  const grid = document.getElementById('living-earth-grid');
  climateStats.forEach(stat => {
    const card = document.createElement('div');
    card.className = `glass-card stat-card ${stat.color}`;
    card.innerHTML = `
      <span class="stat-icon">${stat.icon}</span>
      <div class="stat-value" data-target="${stat.value}">0</div>
      <div class="stat-label">${stat.label}</div>
      <div class="stat-sub">${stat.unit}</div>
      <div class="stat-sub" style="color: var(--solar-gold); margin-top:4px;">📈 ${stat.trend}</div>
    `;
    card.title = stat.desc;
    grid.appendChild(card);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !state.initialized.has('living-earth')) {
        state.initialized.add('living-earth');
        grid.querySelectorAll('.stat-value').forEach(el => {
          const target = parseFloat(el.dataset.target);
          const decimals = target < 10 ? 2 : target < 100 ? 1 : 0;
          animateCount(el, target, 1800, decimals);
        });
        observer.unobserve(entry.target); // Efficiency optimization
      }
    });
  }, { threshold: 0.3 });
  observer.observe(grid);
}

// ── SECTION: LOCAL ENVIRONMENT ──
function initLocalEnvironment() {
  const enableBtn = document.getElementById('enable-location-btn');
  const skipBtn = document.getElementById('skip-location-btn');

  enableBtn?.addEventListener('click', () => {
    if ('geolocation' in navigator) {
      enableBtn.textContent = '⏳ Getting location...';
      enableBtn.disabled = true;
      navigator.geolocation.getCurrentPosition(
        pos => fetchLocalEnvData(pos.coords.latitude, pos.coords.longitude),
        () => fetchLocalEnvData(28.6139, 77.2090), // Default: New Delhi
        { timeout: 10000 }
      );
    } else {
      fetchLocalEnvData(28.6139, 77.2090);
    }
  });

  skipBtn?.addEventListener('click', () => {
    fetchLocalEnvData(28.6139, 77.2090); // Default: New Delhi
  });
}

async function fetchLocalEnvData(lat, lon) {
  const prompt = document.getElementById('local-env-prompt');
  const dataDiv = document.getElementById('local-env-data');

  prompt.style.display = 'none';
  dataDiv.style.display = 'block';

  // Show loading state
  dataDiv.innerHTML = '<div class="glass-card" style="padding:3rem;text-align:center;"><div style="font-size:2rem;">⏳</div><p style="color:var(--text-secondary);margin-top:1rem;">Fetching environmental data...</p></div>';

  try {
    const { weatherRes, aqiRes } = await fetchWeatherData(lat, lon);

    const w = weatherRes.current;
    const aqi = aqiRes.current;
    const daily = weatherRes.daily;

    const aqiLevel = aqi.european_aqi < 20 ? 'Good 🟢' :
                     aqi.european_aqi < 40 ? 'Fair 🟡' :
                     aqi.european_aqi < 60 ? 'Moderate 🟠' :
                     aqi.european_aqi < 80 ? 'Poor 🔴' : 'Very Poor 🟣';

    const uvRisk = w.uv_index < 3 ? 'Low' : w.uv_index < 6 ? 'Moderate' : w.uv_index < 8 ? 'High' : 'Very High';

    const isHot = w.temperature_2m > 30;
    const isBadAir = aqi.european_aqi >= 60;
    
    let insightHtml = '';
    if (isBadAir) {
      insightHtml = `<div style="margin-bottom: 1.5rem; padding: 1rem; border-left: 4px solid var(--earth-red); background: hsla(15, 80%, 50%, 0.1); border-radius: 0 8px 8px 0;">⚠️ <strong>Action Required:</strong> Local Air Quality is poor today due to elevated particulate matter. This is becoming more frequent globally due to climate-driven wildfires and stagnant weather patterns. Limit intense outdoor activity.</div>`;
    } else if (isHot) {
      insightHtml = `<div style="margin-bottom: 1.5rem; padding: 1rem; border-left: 4px solid var(--earth-orange); background: hsla(30, 80%, 50%, 0.1); border-radius: 0 8px 8px 0;">🌡️ <strong>Extreme Heat:</strong> High local temperatures today. Urban heat islands can amplify these extreme heat events, which are 5x more likely now than in pre-industrial times.</div>`;
    } else {
      insightHtml = `<div style="margin-bottom: 1.5rem; padding: 1rem; border-left: 4px solid var(--earth-green); background: hsla(152, 69%, 42%, 0.1); border-radius: 0 8px 8px 0;">🌿 <strong>Stable Conditions:</strong> Local conditions are relatively stable today. Reducing global emissions helps maintain this delicate balance for future generations.</div>`;
    }

    dataDiv.innerHTML = `
      ${insightHtml}
      <div class="local-env-grid">
        <div class="local-env-hero">
          <div style="font-size:3.5rem;">📍</div>
          <div>
            <div class="env-location">${sanitizeHTML(weatherRes.timezone?.replace('/', ' / ')) || 'Your Location'}</div>
            <div class="env-coords">${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E · Elevation: ${weatherRes.elevation || 0}m</div>
          </div>
          <div style="margin-left:auto;text-align:right;">
            <div style="font-family:var(--font-mono);font-size:2.5rem;font-weight:700;color:var(--earth-green-glow);">${w.temperature_2m}°C</div>
            <div style="font-size:0.8rem;color:var(--text-secondary);">Feels like ${w.apparent_temperature}°C</div>
          </div>
        </div>

        <div class="local-env-card">
          <div class="env-card-icon">🌬️</div>
          <div class="env-card-value">${aqi.european_aqi}</div>
          <div class="env-card-label">Air Quality Index (EU)</div>
          <div class="env-card-sub">${aqiLevel}</div>
        </div>

        <div class="local-env-card">
          <div class="env-card-icon">🫁</div>
          <div class="env-card-value">${aqi.pm2_5?.toFixed(1) || '—'}</div>
          <div class="env-card-label">PM2.5 (µg/m³)</div>
          <div class="env-card-sub">${aqi.pm2_5 < 12 ? 'Good' : aqi.pm2_5 < 35 ? 'Moderate' : 'Unhealthy'}</div>
        </div>

        <div class="local-env-card">
          <div class="env-card-icon">☁️</div>
          <div class="env-card-value">${w.cloud_cover}%</div>
          <div class="env-card-label">Cloud Cover</div>
          <div class="env-card-sub">${w.cloud_cover < 25 ? 'Clear skies ☀️' : w.cloud_cover < 50 ? 'Partly cloudy' : w.cloud_cover < 75 ? 'Mostly cloudy' : 'Overcast'}</div>
        </div>

        <div class="local-env-card">
          <div class="env-card-icon">💧</div>
          <div class="env-card-value">${w.relative_humidity_2m}%</div>
          <div class="env-card-label">Humidity</div>
          <div class="env-card-sub">${w.relative_humidity_2m < 30 ? 'Dry' : w.relative_humidity_2m < 60 ? 'Comfortable' : 'Humid'}</div>
        </div>

        <div class="local-env-card">
          <div class="env-card-icon">💨</div>
          <div class="env-card-value">${w.wind_speed_10m}</div>
          <div class="env-card-label">Wind Speed (km/h)</div>
          <div class="env-card-sub">${w.wind_speed_10m < 12 ? 'Calm breeze' : w.wind_speed_10m < 30 ? 'Moderate wind' : 'Strong wind'}</div>
        </div>

        <div class="local-env-card">
          <div class="env-card-icon">☀️</div>
          <div class="env-card-value">${w.uv_index}</div>
          <div class="env-card-label">UV Index</div>
          <div class="env-card-sub">${uvRisk} Risk</div>
        </div>

        <div class="local-env-card">
          <div class="env-card-icon">🌡️</div>
          <div class="env-card-value">${daily?.temperature_2m_max?.[0]}°</div>
          <div class="env-card-label">Today's High</div>
          <div class="env-card-sub">Low: ${daily?.temperature_2m_min?.[0]}°C</div>
        </div>

        <div class="local-env-card">
          <div class="env-card-icon">🏭</div>
          <div class="env-card-value">${aqi.nitrogen_dioxide?.toFixed(0) || '—'}</div>
          <div class="env-card-label">NO₂ (µg/m³)</div>
          <div class="env-card-sub">Traffic pollution indicator</div>
        </div>
      </div>
    `;

    showCompanionMessage(`Your local AQI is ${aqi.european_aqi} — ${aqiLevel.split(' ')[0]}!`);
  } catch (err) {
    dataDiv.innerHTML = `
      <div class="glass-card" style="padding:3rem;text-align:center;">
        <div style="font-size:2rem;">🌐</div>
        <p style="color:var(--text-secondary);margin-top:1rem;">Couldn't fetch live data. Check your internet connection.</p>
        <button class="btn btn-glass" style="margin-top:1rem;" onclick="location.reload()">Try Again</button>
      </div>
    `;
  }
}

// ── SECTION: CHAT ──
function initChat() {
  setTimeout(() => addChatMessage('welcome'), 500);
}

async function addChatMessage(stepId) {
  const messages = document.getElementById('chat-messages');
  const step = chatFlow.find(s => s.id === stepId);
  if (!step) {
    showChatResult();
    return;
  }
  state.chatStep = stepId;

  const typing = document.createElement('div');
  typing.className = 'chat-bubble ai';
  typing.innerHTML = `<div class="chat-typing"><span></span><span></span><span></span></div>`;
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  await sleep(800 + Math.random() * 600);

  typing.innerHTML = `
    <span class="bubble-label">🌍 EarthPulse</span>
    ${sanitizeHTML(step.message)}
    ${step.options ? `
      <div class="chat-options">
        ${step.options.map(opt => `
          <button class="btn-option" data-next="${opt.next}" data-impact='${JSON.stringify(opt.impact || {})}'>${sanitizeHTML(opt.text)}</button>
        `).join('')}
      </div>
    ` : ''}
  `;

  typing.querySelectorAll('.btn-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const impact = JSON.parse(btn.dataset.impact || '{}');
      Object.assign(state.chatImpact, impact);

      const userBubble = document.createElement('div');
      userBubble.className = 'chat-bubble user';
      userBubble.innerHTML = `<span class="bubble-label">You</span>${sanitizeHTML(btn.textContent)}`;
      messages.appendChild(userBubble);

      typing.querySelectorAll('.btn-option').forEach(b => {
        b.disabled = true;
        b.style.opacity = b === btn ? '1' : '0.4';
        if (b === btn) b.classList.add('selected');
      });

      messages.scrollTop = messages.scrollHeight;

      if (Object.keys(impact).length > 0) {
        const impactDiv = document.createElement('div');
        impactDiv.className = 'chat-impact';
        const totalSoFar = calcTotalFootprint();
        impactDiv.innerHTML = `<div style="font-size:0.8rem;color:var(--text-dim);">Running footprint estimate</div>
          <div class="impact-value">${totalSoFar.toFixed(1)} tonnes CO₂/year</div>`;
        messages.appendChild(impactDiv);
      }

      messages.scrollTop = messages.scrollHeight;
      addChatMessage(btn.dataset.next);
    });
  });

  messages.scrollTop = messages.scrollHeight;
}

function calcTotalFootprint() {
  const i = state.chatImpact;
  return (i.transport || 0) * (i.transportMult || 1) + (i.food || 0) + (i.energy || 0) + (i.shopping || 0) + (i.flying || 0) + (i.waste || 0);
}

function showChatResult() {
  const messages = document.getElementById('chat-messages');
  const total = calcTotalFootprint();
  state.footprint = total;
  saveData('footprint', total);
  updateEnvironmentAtmosphere();

  const globalAvg = 4.7;
  const comparison = total > globalAvg ? 'above' : 'below';
  const emoji = total > globalAvg ? '📊' : '🌟';

  const resultBubble = document.createElement('div');
  resultBubble.className = 'chat-bubble ai';
  resultBubble.innerHTML = `
    <span class="bubble-label">🌍 EarthPulse — Your Result</span>
    <div style="text-align:center;margin:1rem 0;">
      <div style="font-family:var(--font-mono);font-size:2.5rem;font-weight:700;background:linear-gradient(135deg,var(--earth-green-glow),var(--aurora-cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
        ${total.toFixed(1)}
      </div>
      <div style="font-size:1.1rem;color:var(--text-secondary);margin-top:0.25rem;">tonnes CO₂ per year</div>
    </div>
    <p>${emoji} Your footprint is <strong>${comparison}</strong> the global average of ${globalAvg} tonnes/year.</p>
    <p style="margin-top:0.75rem;font-size:0.9rem;color:var(--text-secondary);">
      ${total > 6 ? "Don't worry — awareness is the first step! Scroll down to discover how small changes can make a huge difference." :
        total > 3 ? "You're doing okay, but there's room to improve. Let's explore actions you can take!" :
        "Amazing! You're already living more sustainably than most people on Earth. Keep inspiring others! 🌱"}
    </p>
    <a href="https://twitter.com/intent/tweet?text=I%20just%20calculated%20my%20carbon%20footprint%20(${total.toFixed(1)}%20tonnes)%20on%20EarthPulse%20AI!%20%F0%9F%8C%8D%20Join%20me%20in%20taking%20climate%20action%3A&url=https%3A%2F%2FDrPratik.github.io%2FEarthPulse-AI%2F" 
       target="_blank" 
       rel="noopener" 
       class="btn btn-primary btn-glow" 
       style="display:inline-block; margin-top:1rem; text-decoration:none; width:100%; text-align:center;">
       🐦 Share My Pledge
    </a>
  `;
  messages.appendChild(resultBubble);
  messages.scrollTop = messages.scrollHeight;

  renderDashboard(total);
  renderWrapped(total);
  renderGenerational(total);
  renderCarbonTwin(total);
  renderCarbonBudget(total);

  if (total < 3) setCompanionMood('happy');
  else if (total > 7) setCompanionMood('worried');
  else setCompanionMood('happy');
}

// ── SECTION: DASHBOARD ──
function initDashboard() {
  renderDashboard(state.footprint || 7.2);
}

function renderDashboard(yearlyTotal) {
  const grid = document.getElementById('dashboard-grid');
  const chartArea = document.getElementById('dashboard-chart-area');
  const daily = yearlyTotal / 365;
  grid.innerHTML = '';

  const mainCard = document.createElement('div');
  mainCard.className = 'glass-card stat-card dashboard-main-stat card-green';
  mainCard.innerHTML = `
    <span class="stat-icon">🌍</span>
    <div class="stat-value">${daily.toFixed(1)}</div>
    <div class="stat-label">kg CO₂ generated today</div>
    <div class="stat-sub">${yearlyTotal.toFixed(1)} tonnes per year</div>
  `;
  grid.appendChild(mainCard);

  equivalencies.forEach(eq => {
    const val = daily * eq.factor;
    const card = document.createElement('div');
    card.className = 'glass-card equiv-card';
    card.innerHTML = `
      <span class="equiv-icon">${eq.icon}</span>
      <div>
        <div class="equiv-value">${val >= 100 ? Math.round(val) : val.toFixed(1)}</div>
        <div class="equiv-label">${eq.unit}</div>
        <div style="font-size:0.7rem;color:var(--text-dim);">${eq.label}</div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Chart area - breakdown visualization
  if (chartArea) {
    const i = state.chatImpact;
    const categories = [
      { name: 'Transport', val: (i.transport || 0) * (i.transportMult || 1), color: '#3b82f6' },
      { name: 'Food', val: i.food || 0, color: '#22c55e' },
      { name: 'Energy', val: i.energy || 0, color: '#eab308' },
      { name: 'Shopping', val: i.shopping || 0, color: '#a855f7' },
      { name: 'Flying', val: i.flying || 0, color: '#06b6d4' },
      { name: 'Waste', val: i.waste || 0, color: '#ef4444' },
    ].filter(c => c.val > 0);

    if (categories.length > 0) {
      const maxVal = Math.max(...categories.map(c => c.val));
      chartArea.innerHTML = `
        <h3>📊 Your Footprint Breakdown</h3>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          ${categories.map(c => `
            <div style="display:flex;align-items:center;gap:1rem;">
              <div style="width:80px;font-size:0.85rem;color:var(--text-secondary);text-align:right;">${c.name}</div>
              <div style="flex:1;height:28px;border-radius:var(--radius-sm);background:hsla(0,0%,100%,0.05);overflow:hidden;position:relative;">
                <div style="height:100%;width:${(c.val / maxVal) * 100}%;background:${c.color};border-radius:var(--radius-sm);transition:width 1s var(--ease-smooth);display:flex;align-items:center;padding-left:0.5rem;">
                  <span style="font-family:var(--font-mono);font-size:0.75rem;color:white;font-weight:600;">${c.val.toFixed(1)}t</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:1rem;text-align:center;font-size:0.8rem;color:var(--text-dim);">
          Total: ${yearlyTotal.toFixed(1)} tonnes CO₂/year · Global average: 4.7t
        </div>
      `;
    } else {
      chartArea.innerHTML = `
        <h3>📊 Your Footprint Breakdown</h3>
        <p style="color:var(--text-dim);text-align:center;padding:2rem;">Complete the chat above to see your personalized breakdown</p>
      `;
    }
  }
}

// ── SECTION: ACTIONS LAB ──
function initActionsLab() {
  const container = document.getElementById('actions-lab-content');
  const togglesDiv = document.createElement('div');
  togglesDiv.className = 'actions-toggles';

  const resultDiv = document.createElement('div');
  resultDiv.className = 'actions-result';

  actions.forEach(action => {
    const item = document.createElement('div');
    item.className = `action-toggle-item ${state.activeActions[action.id] ? 'active' : ''}`;
    item.innerHTML = `
      <span class="action-icon">${action.icon}</span>
      <div class="action-info">
        <div class="action-name">${action.name}</div>
        <div class="action-save">Saves ${action.dailySave} kg CO₂/day</div>
      </div>
      <input type="checkbox" class="toggle-switch" id="action-${action.id}" ${state.activeActions[action.id] ? 'checked' : ''} />
    `;

    const toggle = item.querySelector('.toggle-switch');
    toggle.addEventListener('change', () => {
      state.activeActions[action.id] = toggle.checked;
      item.classList.toggle('active', toggle.checked);
      saveData('activeActions', state.activeActions);
      updateActionsResult(resultDiv);
      updateEnvironmentAtmosphere();
      if (toggle.checked) {
        setCompanionMood('happy');
        showToast(`Awesome! You just pledged to ${action.name.toLowerCase()}. Your carbon twin & budget are updating...`, '🌱');
      } else {
        showToast(`Action removed. Every small step matters when you're ready!`, '🌍');
      }
    });

    togglesDiv.appendChild(item);
  });

  container.appendChild(togglesDiv);
  container.appendChild(resultDiv);
  updateActionsResult(resultDiv);
}

function updateActionsResult(resultDiv) {
  const dailySavings = actions
    .filter(a => state.activeActions[a.id])
    .reduce((sum, a) => sum + a.dailySave, 0);

  const periods = [
    { label: 'Today', multiplier: 1 },
    { label: '1 Week', multiplier: 7 },
    { label: '1 Month', multiplier: 30 },
    { label: '1 Year', multiplier: 365 },
    { label: '10 Years', multiplier: 3650 },
    { label: 'Lifetime', multiplier: 25550 },
  ];

  resultDiv.innerHTML = `
    <div class="glass-card stat-card card-green" style="margin-bottom:1rem;">
      <span class="stat-icon">🌿</span>
      <div class="stat-value">${dailySavings.toFixed(1)}</div>
      <div class="stat-label">kg CO₂ saved daily</div>
      <div class="stat-sub">${(dailySavings * 365).toFixed(0)} kg per year · ${Math.ceil(dailySavings * 365 / 22)} trees equivalent</div>
    </div>
    <div class="impact-timeline">
      ${periods.map(p => `
        <div class="impact-period">
          <div class="period-label">${p.label}</div>
          <div class="period-value">${formatWeight(dailySavings * p.multiplier)}</div>
          <div class="period-unit">CO₂ saved</div>
        </div>
      `).join('')}
    </div>
  `;
}

function formatWeight(kg) {
  if (kg >= 1000000) return (kg / 1000000).toFixed(1) + ' kt';
  if (kg >= 1000) return (kg / 1000).toFixed(1) + ' t';
  return kg.toFixed(1) + ' kg';
}

// ── SECTION: TIME MACHINE ──
function initTimeMachine() {
  const container = document.getElementById('time-machine-content');
  container.innerHTML = `
    <div class="timeline-slider-container">
      <div class="timeline-year-display">
        <div class="timeline-year" id="tm-year">2025</div>
      </div>
      <input type="range" class="timeline-slider" id="tm-slider" min="2025" max="2100" value="2025" step="1" />
      <div style="display:flex;justify-content:space-between;margin-top:0.5rem;font-size:0.75rem;color:var(--text-dim);">
        <span>2025</span><span>2050</span><span>2075</span><span>2100</span>
      </div>
    </div>
    <div class="timeline-metrics" id="tm-metrics"></div>
  `;

  const slider = document.getElementById('tm-slider');
  const yearDisplay = document.getElementById('tm-year');
  slider.addEventListener('input', () => {
    yearDisplay.textContent = slider.value;
    updateTimelineMetrics(parseInt(slider.value));
    const yearsSince = parseInt(slider.value) - 2025;
    const temp = timelineProjections.temperature.base + yearsSince * timelineProjections.temperature.ratePerYear;
    const grad = temp > 2.5 ? 'var(--danger-ember), var(--solar-gold)' :
                 temp > 2.0 ? 'var(--solar-gold), var(--danger-ember)' :
                 'var(--earth-green-glow), var(--aurora-cyan)';
    yearDisplay.style.cssText = `background:linear-gradient(135deg,${grad});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;`;
  });

  updateTimelineMetrics(2025);
}

function updateTimelineMetrics(year) {
  const container = document.getElementById('tm-metrics');
  const yearsSince = year - 2025;
  const metrics = [
    { icon: '🌡️', label: 'Temperature Rise', value: (timelineProjections.temperature.base + yearsSince * timelineProjections.temperature.ratePerYear).toFixed(2) + '°C', severity: yearsSince > 30 ? 'danger' : yearsSince > 15 ? 'warning' : 'good' },
    { icon: '🌊', label: 'Sea Level Rise', value: (yearsSince * timelineProjections.seaLevel.ratePerYear).toFixed(0) + ' mm', severity: yearsSince > 40 ? 'danger' : yearsSince > 20 ? 'warning' : 'good' },
    { icon: '🌳', label: 'Forest Cover', value: Math.max(20, timelineProjections.forestCover.base + yearsSince * timelineProjections.forestCover.ratePerYear).toFixed(1) + '%', severity: yearsSince > 40 ? 'danger' : yearsSince > 20 ? 'warning' : 'good' },
    { icon: '🦋', label: 'Biodiversity Index', value: Math.max(40, timelineProjections.biodiversity.base + yearsSince * timelineProjections.biodiversity.ratePerYear).toFixed(0) + '%', severity: yearsSince > 30 ? 'danger' : yearsSince > 15 ? 'warning' : 'good' },
    { icon: '💨', label: 'Air Quality (AQI)', value: Math.round(timelineProjections.airQuality.base + yearsSince * timelineProjections.airQuality.ratePerYear), severity: yearsSince > 35 ? 'danger' : yearsSince > 15 ? 'warning' : 'good' },
    { icon: '💧', label: 'Water-Stressed', value: (timelineProjections.waterStress.base + yearsSince * timelineProjections.waterStress.ratePerYear).toFixed(1) + 'B', severity: yearsSince > 30 ? 'danger' : yearsSince > 15 ? 'warning' : 'good' },
  ];

  container.innerHTML = metrics.map(m => `
    <div class="timeline-metric">
      <div class="metric-icon">${m.icon}</div>
      <div class="metric-label">${m.label}</div>
      <div class="metric-value metric-${m.severity}">${m.value}</div>
    </div>
  `).join('');
}

// ── SECTION: GENERATIONAL IMPACT ──
function initGenerationalImpact() {
  renderGenerational(state.footprint || 7.2);
}

function renderGenerational(yearlyTotal) {
  const container = document.getElementById('generational-content');
  const gens = generationalData.generations;

  container.innerHTML = `
    <div class="generational-timeline">
      ${gens.map((gen, i) => `
        <div class="gen-card">
          <div class="gen-avatar">${gen.avatar}</div>
          <div class="gen-label">${gen.label}</div>
          <div class="gen-years">${gen.years}</div>
          <div class="gen-metrics">
            ${gen.inherited ? gen.metrics.map(m => `
              <div class="gen-metric">
                <span>${m.label}</span>
                <span class="gen-metric-value metric-${m.severity}">${m.value}</span>
              </div>
            `).join('') : gen.metrics.map(m => {
              let val;
              if (m.multiplier) val = `${(yearlyTotal * m.multiplier).toFixed(0)} tonnes`;
              else if (m.treeMult) val = `${Math.ceil(yearlyTotal * 40 / 0.022).toLocaleString()} trees`;
              else if (m.waterMult) val = `${(yearlyTotal * m.waterMult * 2500).toLocaleString()} m³`;
              return `
                <div class="gen-metric">
                  <span>${m.label}</span>
                  <span class="gen-metric-value metric-${m.severity}">${val}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    <div style="text-align:center;margin-top:2rem;padding:1.5rem;border-radius:var(--radius-lg);background:var(--bg-glass);border:1px solid var(--border-glass);">
      <p style="font-family:var(--font-display);font-size:1.1rem;font-weight:600;color:var(--earth-green-glow);">
        Your choices today echo through generations.
      </p>
      <p style="color:var(--text-secondary);margin-top:0.5rem;font-size:0.9rem;">
        Reducing your footprint by just 1 tonne/year saves ${(1 * 40).toFixed(0)} tonnes over your lifetime.
      </p>
    </div>
  `;
}

// ── SECTION: CONSUMPTION STORIES ──
function initConsumption() {
  const grid = document.getElementById('consumption-grid');
  const detail = document.getElementById('consumption-detail');

  products.forEach(product => {
    const item = document.createElement('div');
    item.className = 'consumption-item';
    item.innerHTML = `
      <span class="item-emoji">${product.emoji}</span>
      <div class="item-name">${product.name}</div>
    `;
    item.addEventListener('click', () => {
      grid.querySelectorAll('.consumption-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      showProductDetail(product, detail);
    });
    grid.appendChild(item);
  });
}

function showProductDetail(product, container) {
  container.innerHTML = `
    <div class="consumption-detail-card">
      <h3 style="font-family:var(--font-display);font-size:1.5rem;margin-bottom:0.25rem;">${product.emoji} The Journey of a ${product.name}</h3>
      <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:1rem;">Total: ${product.co2} kg CO₂ · ${product.water > 0 ? product.water + 'L water' : 'No direct water use'}</p>
      <div class="consumption-journey">
        ${product.journey.map(step => `
          <div class="journey-step">
            <div class="step-icon">${step.icon}</div>
            <div class="step-label">${step.label}</div>
            <div class="step-impact">${step.impact}</div>
          </div>
        `).join('')}
      </div>
      <div class="consumption-stats">
        ${product.facts.map(fact => `
          <div class="glass-card" style="padding:1rem;text-align:center;">
            <div style="font-size:0.85rem;color:var(--text-secondary);">${fact}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ── SECTION: KNOWLEDGE HUB ──
function initKnowledge() {
  const grid = document.getElementById('knowledge-grid');
  knowledgeTopics.forEach(topic => {
    const card = document.createElement('div');
    card.className = `knowledge-card ${topic.color}`;
    card.innerHTML = `
      <div class="card-emoji">${topic.emoji}</div>
      <div class="card-title">${topic.title}</div>
      <div class="card-desc">${topic.desc}</div>
      <span class="card-tag">${topic.tag}</span>
    `;
    grid.appendChild(card);
  });
}

// ── SECTION: MYTH BUSTER ──
function initMythBuster() {
  state.mythIndex = 0;
  state.mythScore = { correct: 0, total: 0 };
  renderMyth();
}

function renderMyth() {
  const container = document.getElementById('myth-game');
  if (state.mythIndex >= myths.length) {
    container.innerHTML = `
      <div class="myth-card">
        <div style="font-size:3rem;margin-bottom:1rem;">🎉</div>
        <div class="myth-statement" style="font-size:1.5rem;">Quiz Complete!</div>
        <div style="font-family:var(--font-mono);font-size:2rem;color:var(--earth-green-glow);margin:1rem 0;">
          ${state.mythScore.correct} / ${state.mythScore.total}
        </div>
        <p style="color:var(--text-secondary);margin-bottom:1.5rem;">
          ${state.mythScore.correct >= 8 ? 'Incredible! You really know your climate facts! 🌟' :
            state.mythScore.correct >= 5 ? 'Good job! You know more than most people! 💚' :
            'Great learning opportunity! Knowledge is power! 📚'}
        </p>
        <button class="btn btn-primary" id="myth-restart-btn">Play Again</button>
      </div>
    `;
    document.getElementById('myth-restart-btn')?.addEventListener('click', () => {
      state.mythIndex = 0;
      state.mythScore = { correct: 0, total: 0 };
      renderMyth();
    });
    return;
  }

  const myth = myths[state.mythIndex];
  container.innerHTML = `
    <div class="myth-card">
      <div class="myth-score">
        <span>Score: ${state.mythScore.correct}/${state.mythScore.total}</span>
        <span>Question ${state.mythIndex + 1}/${myths.length}</span>
      </div>
      <div class="myth-progress">
        <div class="myth-progress-fill" style="width:${(state.mythIndex / myths.length) * 100}%"></div>
      </div>
      <div class="myth-statement">${myth.statement}</div>
      <div class="myth-buttons">
        <button class="myth-btn fact" data-answer="false">✅ Fact</button>
        <button class="myth-btn myth" data-answer="true">❌ Myth</button>
      </div>
      <div id="myth-explanation-slot"></div>
    </div>
  `;

  container.querySelectorAll('.myth-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isMyth = btn.dataset.answer === 'true';
      const correct = isMyth === myth.isMyth;
      state.mythScore.total++;
      if (correct) state.mythScore.correct++;

      container.querySelectorAll('.myth-btn').forEach(b => {
        b.disabled = true;
        b.classList.add(b.dataset.answer === String(myth.isMyth) ? 'correct' : 'wrong');
      });

      document.getElementById('myth-explanation-slot').innerHTML = `
        <div class="myth-explanation">
          <strong style="color:${correct ? 'var(--earth-green-glow)' : 'var(--danger-ember)'};">
            ${correct ? '✅ Correct!' : '❌ Not quite!'}
          </strong>
          <span style="display:inline-block;margin-left:0.5rem;padding:2px 8px;border-radius:var(--radius-full);background:${myth.isMyth ? 'hsla(12,85%,55%,0.2)' : 'hsla(152,69%,42%,0.2)'};font-size:0.8rem;font-weight:600;">
            This is a ${myth.isMyth ? 'MYTH' : 'FACT'}
          </span>
          <p style="margin-top:0.75rem;">${myth.explanation}</p>
        </div>
      `;

      setTimeout(() => {
        state.mythIndex++;
        renderMyth();
      }, 4000);
    });
  });
}

// ── SECTION: CLIMATE CHALLENGES ──
function initChallenges() {
  renderChallenges();
}

function renderChallenges() {
  const container = document.getElementById('challenges-content');
  const tabs = ['daily', 'weekly', 'monthly'];

  container.innerHTML = `
    <div class="challenges-tabs">
      ${tabs.map(tab => `
        <button class="challenge-tab ${state.challengeTab === tab ? 'active' : ''}" data-tab="${tab}">
          ${tab === 'daily' ? '📅 Daily' : tab === 'weekly' ? '📆 Weekly' : '🗓️ Monthly'}
        </button>
      `).join('')}
    </div>
    <div class="challenges-grid" id="challenges-grid"></div>
  `;

  container.querySelectorAll('.challenge-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.challengeTab = btn.dataset.tab;
      container.querySelectorAll('.challenge-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === state.challengeTab));
      renderChallengeCards();
    });
  });

  renderChallengeCards();
}

function renderChallengeCards() {
  const grid = document.getElementById('challenges-grid');
  const items = challenges[state.challengeTab] || [];

  grid.innerHTML = items.map(ch => {
    const joined = state.joinedChallenges[ch.id];
    const progress = joined ? Math.min(100, Math.floor(Math.random() * 60 + 40)) : 0;
    return `
      <div class="challenge-card ${joined ? 'joined' : ''}" data-id="${ch.id}">
        <div class="ch-header">
          <div class="ch-icon">${ch.icon}</div>
          <div>
            <div class="ch-title">${ch.title}</div>
            <div class="ch-duration">${ch.difficulty === 'easy' ? '⭐ Easy' : ch.difficulty === 'medium' ? '⭐⭐ Medium' : '⭐⭐⭐ Hard'}</div>
          </div>
        </div>
        <div class="ch-desc">${ch.desc}</div>
        <div class="ch-reward">${ch.reward}</div>
        <div class="ch-progress"><div class="ch-progress-fill" style="width:${progress}%"></div></div>
        <button class="ch-join-btn" data-id="${ch.id}">${joined ? '✅ Joined — In Progress' : '🌱 Join Challenge'}</button>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.ch-join-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      state.joinedChallenges[id] = !state.joinedChallenges[id];
      saveData('joinedChallenges', state.joinedChallenges);
      renderChallengeCards();
      if (state.joinedChallenges[id]) {
        setCompanionMood('happy');
        showCompanionMessage('Amazing! You joined a new challenge! 🌱💪');
      }
    });
  });
}

// ── SECTION: WHAT IF EVERYONE ──
function initWhatIf() {
  const container = document.getElementById('what-if-content');
  const scenariosDiv = document.createElement('div');
  scenariosDiv.className = 'what-if-scenarios';

  const resultDiv = document.createElement('div');
  resultDiv.id = 'what-if-result';

  whatIfScenarios.forEach(scenario => {
    const card = document.createElement('div');
    card.className = 'what-if-card';
    card.innerHTML = `
      <div class="wif-icon">${scenario.icon}</div>
      <div class="wif-title">${scenario.title}</div>
      <div class="wif-desc">${scenario.desc}</div>
    `;
    card.addEventListener('click', () => {
      scenariosDiv.querySelectorAll('.what-if-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      showWhatIfResult(scenario, resultDiv);
    });
    scenariosDiv.appendChild(card);
  });

  container.appendChild(scenariosDiv);
  container.appendChild(resultDiv);
}

function showWhatIfResult(scenario, container) {
  const impact = scenario.globalImpact;
  container.innerHTML = `
    <div class="what-if-result">
      <div class="result-title">${scenario.icon} If All 8 Billion People ${scenario.title}...</div>
      <div class="what-if-stats">
        <div class="what-if-stat glass-card card-green">
          <div style="font-size:1.5rem;margin-bottom:0.5rem;">🌿</div>
          <div class="stat-value" style="font-size:1.1rem;">${impact.co2Saved}</div>
          <div class="stat-label">CO₂ Saved</div>
        </div>
        <div class="what-if-stat glass-card card-blue">
          <div style="font-size:1.5rem;margin-bottom:0.5rem;">♻️</div>
          <div class="stat-value" style="font-size:1.1rem;">${impact.plasticReduced}</div>
          <div class="stat-label">Resources Saved</div>
        </div>
        <div class="what-if-stat glass-card card-cyan">
          <div style="font-size:1.5rem;margin-bottom:0.5rem;">💧</div>
          <div class="stat-value" style="font-size:1.1rem;">${impact.waterSaved}</div>
          <div class="stat-label">Water Saved</div>
        </div>
      </div>
      <div class="glass-card" style="margin-top:1.5rem;padding:1.5rem;text-align:center;">
        <div style="font-size:1.5rem;margin-bottom:0.5rem;">🌍</div>
        <div style="font-family:var(--font-display);font-size:1.1rem;font-weight:600;color:var(--earth-green-glow);">${impact.equivalent}</div>
      </div>
    </div>
  `;
}

// ── SECTION: CARBON MARKETPLACE ──
function initMarketplace() {
  renderMarketplace();
}

function renderMarketplace() {
  const container = document.getElementById('marketplace-content');
  const sortOptions = [
    { key: 'impact', label: '🔥 Highest Impact' },
    { key: 'effort', label: '⚡ Easiest First' },
    { key: 'cost', label: '💰 Cheapest First' },
  ];

  let sorted = [...marketplaceActions];
  if (state.marketplaceSort === 'impact') sorted.sort((a, b) => b.co2PerYear - a.co2PerYear);
  else if (state.marketplaceSort === 'effort') {
    const effortMap = { low: 0, medium: 1, high: 2 };
    sorted.sort((a, b) => effortMap[a.effort] - effortMap[b.effort]);
  } else if (state.marketplaceSort === 'cost') {
    const costMap = { free: 0, low: 1, medium: 2, high: 3 };
    sorted.sort((a, b) => costMap[a.cost] - costMap[b.cost]);
  }

  container.innerHTML = `
    <div class="marketplace-sort">
      ${sortOptions.map(opt => `
        <button class="sort-btn ${state.marketplaceSort === opt.key ? 'active' : ''}" data-sort="${opt.key}">${opt.label}</button>
      `).join('')}
    </div>
    <div class="marketplace-list">
      ${sorted.map((item, i) => `
        <div class="marketplace-item">
          <div class="mp-rank">#${i + 1}</div>
          <div class="mp-icon">${item.icon}</div>
          <div class="mp-info">
            <div class="mp-name">${item.name}</div>
            <div class="mp-desc">${item.desc}</div>
          </div>
          <div class="mp-badge effort-${item.effort}">${item.effort === 'low' ? '⚡ Easy' : item.effort === 'medium' ? '💪 Medium' : '🏋️ Hard'}</div>
          <div class="mp-badge cost-${item.cost}">${item.cost === 'free' ? '🆓 Free' : item.cost === 'low' ? '💲 Low' : item.cost === 'medium' ? '💲💲 Med' : '💲💲💲 High'}</div>
          <div class="mp-co2">${item.co2PerYear >= 1000 ? (item.co2PerYear / 1000).toFixed(1) + 't' : item.co2PerYear + 'kg'} <span class="mp-co2-unit">/year</span></div>
        </div>
      `).join('')}
    </div>
    <div style="text-align:center;margin-top:1.5rem;padding:1rem;border-radius:var(--radius-md);background:var(--bg-glass);border:1px solid var(--border-glass);">
      <span style="font-family:var(--font-mono);font-weight:600;color:var(--earth-green-glow);">
        Total potential savings: ${(sorted.reduce((s, a) => s + a.co2PerYear, 0) / 1000).toFixed(1)} tonnes CO₂/year
      </span>
    </div>
  `;

  container.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.marketplaceSort = btn.dataset.sort;
      renderMarketplace();
    });
  });
}

// ── SECTION: WRAPPED ──
function initWrapped() {
  renderWrapped(state.footprint || 7.2);
}

function renderWrapped(yearlyTotal) {
  const container = document.getElementById('wrapped-content');

  container.innerHTML = `
    <div class="wrapped-card">
      <div class="wrapped-year">━━ ${new Date().getFullYear()} ━━</div>
      <div class="wrapped-title">Your Climate Story</div>
      
      <div class="wrapped-stats">
        <div class="wrapped-stat-item">
          <div class="ws-label">Your Annual Footprint</div>
          <div class="ws-value">${yearlyTotal.toFixed(1)} tonnes CO₂</div>
          <div class="ws-desc">${yearlyTotal > 4.7 ? 'Above' : 'Below'} the global average of 4.7t</div>
        </div>
        
        <div class="wrapped-stat-item">
          <div class="ws-label">Biggest Impact Area</div>
          <div class="ws-value">${getBiggestImpact()}</div>
          <div class="ws-desc">This is where you can make the most change</div>
        </div>
        
        <div class="wrapped-stat-item">
          <div class="ws-label">Trees Needed</div>
          <div class="ws-value">${Math.ceil(yearlyTotal / 0.022)} trees/year</div>
          <div class="ws-desc">To offset your annual emissions</div>
        </div>
        
        <div class="wrapped-stat-item">
          <div class="ws-label">Sustainability Score</div>
          <div class="ws-value">${Math.max(0, Math.min(100, Math.round(100 - (yearlyTotal / 15) * 100)))}%</div>
          <div class="ws-desc">${yearlyTotal < 3 ? 'Eco Champion! 🏆' : yearlyTotal < 5 ? 'Good Progress! 💚' : yearlyTotal < 8 ? 'Room to Grow 🌱' : 'Let\'s Get Started! 🚀'}</div>
        </div>
        
        <div class="wrapped-stat-item">
          <div class="ws-label">If You Took All Suggested Actions</div>
          <div class="ws-value">${Math.max(0.5, yearlyTotal - actions.reduce((s, a) => s + a.dailySave * 365 / 1000, 0)).toFixed(1)} tonnes</div>
          <div class="ws-desc">Your potential reduced footprint</div>
        </div>
      </div>

      <button class="btn btn-glass wrapped-share-btn" id="share-wrapped-btn">📤 Share Your Story</button>
      <button class="btn btn-primary wrapped-share-btn" id="generate-receipt-btn" style="margin-top: 1rem;">🧾 Print Carbon Receipt</button>
    </div>
  `;

  document.getElementById('share-wrapped-btn')?.addEventListener('click', () => {
    try {
      downloadShareableCard();
      showCompanionMessage('Downloading your shareable impact card! 🌟');
    } catch (err) {
      console.error(err);
      const text = `🌍 My EarthPulse Climate Story ${new Date().getFullYear()}\n\nMy carbon footprint: ${yearlyTotal.toFixed(1)} tonnes CO₂/year\nSustainability Score: ${Math.max(0, Math.min(100, Math.round(100 - (yearlyTotal / 15) * 100)))}%\n\nDiscover yours at EarthPulse AI! 🌱`;
      navigator.clipboard?.writeText(text).then(() => {
        showCompanionMessage('Copied to clipboard! Share your story! 💚');
      }).catch(() => {
        showCompanionMessage('Thanks for sharing awareness! 🌍');
      });
    }
  });

  document.getElementById('generate-receipt-btn')?.addEventListener('click', () => {
    generateReceipt(yearlyTotal);
  });
}

function generateReceipt(yearlyTotal) {
  const modal = document.getElementById('receipt-modal');
  const paper = document.getElementById('receipt-paper-content');
  if (!modal || !paper) return;

  const date = new Date().toLocaleString();
  const footprintImpact = state.chatImpact || {};
  
  // Create some fake line items based on actual data
  const transport = footprintImpact.transport || Math.random() * 2 + 1;
  const food = footprintImpact.food || Math.random() * 2 + 0.5;
  const energy = footprintImpact.energy || Math.random() * 2 + 1;
  const shopping = footprintImpact.shopping || Math.random() * 1.5 + 0.5;
  
  const score = Math.max(0, Math.min(100, Math.round(100 - (yearlyTotal / 15) * 100)));

  paper.innerHTML = `
    <button class="close-receipt-btn" id="close-receipt-btn">×</button>
    <div class="receipt-header">
      <h3>EarthPulse CVS</h3>
      <div>Customer Copy</div>
      <div style="font-size: 0.75rem; margin-top: 0.25rem;">${date}</div>
    </div>
    
    <div style="margin-bottom: 1rem; font-size: 0.85rem; border-bottom: 1px dashed #1a1a1a; padding-bottom: 1rem;">
      <div>CASHIER: Planet Earth</div>
      <div>TERMINAL: 042</div>
    </div>

    <div class="receipt-item">
      <span>1x Transportation</span>
      <span>${transport.toFixed(2)} t</span>
    </div>
    <div class="receipt-item">
      <span>1x Food & Diet</span>
      <span>${food.toFixed(2)} t</span>
    </div>
    <div class="receipt-item">
      <span>1x Home Energy</span>
      <span>${energy.toFixed(2)} t</span>
    </div>
    <div class="receipt-item">
      <span>1x Shopping/Goods</span>
      <span>${shopping.toFixed(2)} t</span>
    </div>

    <div class="receipt-total">
      <span>ANNUAL FOOTPRINT</span>
      <span>${yearlyTotal.toFixed(2)} t</span>
    </div>
    
    <div style="margin-top: 1rem; font-size: 0.85rem;">
      <div style="display: flex; justify-content: space-between;">
        <span>BUDGET LEFT:</span>
        <span>${Math.max(0, 4.7 - yearlyTotal).toFixed(2)} t</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>ECO SCORE:</span>
        <span>${score}%</span>
      </div>
    </div>

    <div style="margin-top: 2rem; text-align: center; font-size: 0.8rem;">
      <div>*** THANK YOU ***</div>
      <div>Please recycle this receipt...</div>
      <div>Actually, it's digital. Good job!</div>
    </div>
    
    <div class="receipt-barcode">
      ||| || |||| | |||
    </div>
  `;

  modal.classList.add('show');
  setCompanionMood('happy');
  showCompanionMessage('Here is your itemized impact receipt! 🧾');

  document.getElementById('close-receipt-btn').addEventListener('click', () => {
    modal.classList.remove('show');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });
}

function getBiggestImpact() {
  const i = state.chatImpact;
  const categories = [
    { name: '🚗 Transportation', val: (i.transport || 0) * (i.transportMult || 1) },
    { name: '🍽️ Food & Diet', val: i.food || 0 },
    { name: '⚡ Home Energy', val: i.energy || 0 },
    { name: '✈️ Flying', val: i.flying || 0 },
    { name: '🛍️ Shopping', val: i.shopping || 0 },
    { name: '♻️ Waste', val: i.waste || 0 },
  ];
  categories.sort((a, b) => b.val - a.val);
  return categories[0]?.val > 0 ? categories[0].name : '🍽️ Food & Diet';
}

// ── SECTION: WOW MOMENT ──
function initWowMoment() {
  const container = document.getElementById('wow-content');
  const d = wowData;

  container.innerHTML = `
    <div class="wow-comparison">
      <div class="wow-scenario bad">
        <div class="scenario-label">⚠️ ${d.currentTrajectory.label}</div>
        <div class="scenario-year">${d.currentTrajectory.year}</div>
        <div class="wow-metrics">
          ${d.currentTrajectory.metrics.map(m => `
            <div class="wow-metric">
              <span class="wm-label">${m.label}</span>
              <span class="wm-value metric-${m.severity}">${m.value}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="wow-scenario good">
        <div class="scenario-label">🌿 ${d.improvedTrajectory.label}</div>
        <div class="scenario-year">${d.improvedTrajectory.year}</div>
        <div class="wow-metrics">
          ${d.improvedTrajectory.metrics.map(m => `
            <div class="wow-metric">
              <span class="wm-label">${m.label}</span>
              <span class="wm-value metric-${m.severity}">${m.value}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="wow-cta">
      <div class="cta-text">
        Even the smallest changes in your lifestyle<br/>can positively impact the future of our planet. 🌍
      </div>
      <p style="color:var(--text-secondary);max-width:600px;margin:0 auto 1.5rem;line-height:1.7;">
        The future isn't written yet. Every reusable bottle, every vegetarian meal, every bike ride — they add up.
        When billions of people make small changes, we move mountains.
      </p>
      <button class="btn btn-primary btn-glow" id="restart-journey-btn">
        Start My Journey Again
      </button>
    </div>
  `;

  document.getElementById('restart-journey-btn')?.addEventListener('click', () => {
    document.getElementById('footprint-chat')?.scrollIntoView({ behavior: 'smooth' });
  });
}

// ── Theme Toggle ──
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const moods = ['happy', 'sad', 'worried', 'happy'];
  const currentIndex = moods.indexOf(state.companionMood);
  const nextMood = moods[(currentIndex + 1) % moods.length];
  setCompanionMood(nextMood);
  showCompanionMessage(
    nextMood === 'happy' ? 'Feeling great today! 🌿💚' :
    nextMood === 'sad' ? 'The climate data worries me... 😟' :
    'We need to act fast! ⚡'
  );
});

// ── SECTION: LIVE CARBON PULSE ──
function initCarbonPulse() {
  const container = document.getElementById('carbon-pulse-content');
  if (!container) return;

  container.innerHTML = `
    <div class="pulse-telemetry-grid">
      <div class="pulse-card danger">
        <div class="pulse-header">
          <span class="pulse-icon">🏭</span>
          <div class="pulse-indicator danger"></div>
        </div>
        <div class="pulse-label">CO₂ Emitted to Atmosphere</div>
        <div class="pulse-value font-mono" id="pulse-co2">0.00</div>
        <div class="pulse-unit">tonnes since page load</div>
      </div>
      <div class="pulse-card danger">
        <div class="pulse-header">
          <span class="pulse-icon">🌡️</span>
          <div class="pulse-indicator danger"></div>
        </div>
        <div class="pulse-label">Excess Heat Trapped in Oceans</div>
        <div class="pulse-value font-mono" id="pulse-heat">0</div>
        <div class="pulse-unit">Joules (J) since page load</div>
      </div>
      <div class="pulse-card danger">
        <div class="pulse-header">
          <span class="pulse-icon">🌳</span>
          <div class="pulse-indicator danger"></div>
        </div>
        <div class="pulse-label">Global Forest Area Cleared</div>
        <div class="pulse-value font-mono" id="pulse-forest">0.0000</div>
        <div class="pulse-unit">hectares since page load</div>
      </div>
      <div class="pulse-card warning">
        <div class="pulse-header">
          <span class="pulse-icon">🥤</span>
          <div class="pulse-indicator warning"></div>
        </div>
        <div class="pulse-label">Plastic Dumped in Oceans</div>
        <div class="pulse-value font-mono" id="pulse-plastic">0.000</div>
        <div class="pulse-unit">tonnes since page load</div>
      </div>
      <div class="pulse-card success">
        <div class="pulse-header">
          <span class="pulse-icon">🌱</span>
          <div class="pulse-indicator success"></div>
        </div>
        <div class="pulse-label">Trees Planted Globally</div>
        <div class="pulse-value font-mono" id="pulse-trees">0.0</div>
        <div class="pulse-unit">trees since page load</div>
      </div>
    </div>
  `;

  const t0 = Date.now();
  const elCo2 = document.getElementById('pulse-co2');
  const elHeat = document.getElementById('pulse-heat');
  const elForest = document.getElementById('pulse-forest');
  const elPlastic = document.getElementById('pulse-plastic');
  const elTrees = document.getElementById('pulse-trees');

  // Rates per second
  const CO2_RATE = 103500000 / 86400; // 103.5M tonnes/day = 1197.917 t/sec
  const HEAT_RATE = 300000000000; // 300 billion Joules/sec
  const FOREST_RATE = 27400 / 86400; // 27.4K hectares/day = 0.31713 ha/sec
  const PLASTIC_RATE = 22000 / 86400; // 22K tonnes/day = 0.25463 t/sec
  const TREES_RATE = 41100 / 86400; // 41.1K trees/day = 0.47569 trees/sec

  let lastUpdate = 0;

  function updatePulse() {
    if (state.currentSection === 'carbon-pulse' || state.currentSection === 'hero' || state.currentSection === 'living-earth') {
      const now = Date.now();
      if (now - lastUpdate >= 3000) {
        lastUpdate = now;
        const elapsed = (now - t0) / 1000;
        if (elCo2) elCo2.textContent = (elapsed * CO2_RATE).toFixed(2);
        if (elHeat) elHeat.textContent = Math.round(elapsed * HEAT_RATE).toLocaleString();
        if (elForest) elForest.textContent = (elapsed * FOREST_RATE).toFixed(4);
        if (elPlastic) elPlastic.textContent = (elapsed * PLASTIC_RATE).toFixed(3);
        if (elTrees) elTrees.textContent = (elapsed * TREES_RATE).toFixed(1);
      }
    }
    requestAnimationFrame(updatePulse);
  }
  updatePulse();
}

// ── SECTION: YOUR CARBON TWIN ──

let worldBankCache = null;

async function initCarbonTwin() {
  const container = document.getElementById('carbon-twin-content');
  if (!container) return;
  
  container.innerHTML = `
    <div class="glass-card" style="text-align:center; padding: 4rem;">
      <div style="font-size: 2rem; margin-bottom: 1rem; animation: pulse 1.5s infinite;">🌍</div>
      <p style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.9rem;">Connecting to World Bank API...</p>
    </div>
  `;
  
  worldBankCache = await fetchWorldBankEmissions();
  renderCarbonTwin(state.footprint || 7.2);
}

function renderCarbonTwin(footprint) {
  const container = document.getElementById('carbon-twin-content');
  if (!container) return;

  const apiMap = worldBankCache || {};

  const countries = [
    { name: 'Qatar', emissions: apiMap['Qatar'] || 35.6, flag: '🇶🇦', color: 'qatar', fact: 'Hyper-urbanized desert living, 100% AC usage, water desalination.' },
    { name: 'United States', emissions: apiMap['United States'] || 14.9, flag: '🇺🇸', color: 'usa', fact: 'Suburban layouts, large homes, high highway car usage.' },
    { name: 'Germany', emissions: apiMap['Germany'] || 7.7, flag: '🇩🇪', color: 'germany', fact: 'Industrial grid, moderate heating, high recycling rates.' },
    { name: 'Global Average', emissions: apiMap['Global Average'] || 4.7, flag: '🌍', color: 'average', fact: 'The average emissions of all 8 billion people today.' },
    { name: 'India', emissions: apiMap['India'] || 1.9, flag: '🇮🇳', color: 'india', fact: 'Agrarian base, low vehicle ownership per capita, solar grid growth.' },
    { name: 'Kenya', emissions: apiMap['Kenya'] || 0.3, flag: '🇰🇪', color: 'kenya', fact: 'Geothermal electricity grid, low-meat diet, minimal car reliance.' }
  ];

  // Find closest
  let twin = countries[0];
  let minDiff = Math.abs(footprint - twin.emissions);
  countries.forEach(c => {
    const diff = Math.abs(footprint - c.emissions);
    if (diff < minDiff) {
      minDiff = diff;
      twin = c;
    }
  });

  const isQuizDone = state.footprint !== null;
  const badgeHtml = isQuizDone 
    ? `<div class="twin-badge success">⚡ Personalized Result</div>`
    : `<div class="twin-badge warning">📝 Showing Default Profile (US/EU Average) - Complete Quiz to update!</div>`;

  container.innerHTML = `
    <div class="carbon-twin-grid">
      <div class="twin-highlight-card glass-card">
        ${badgeHtml}
        <div class="twin-avatar">${twin.flag}</div>
        <h3 class="twin-name">Your Carbon Twin: ${twin.name}</h3>
        <p class="twin-desc">
          Your estimated footprint of <strong>${footprint.toFixed(1)} tonnes CO₂/year</strong> is closest to the average citizen of <strong>${twin.name}</strong> (${twin.emissions} tonnes).
        </p>
        <div class="twin-factbox">
          <strong>Twin Insight:</strong> ${twin.fact}
        </div>
        ${!isQuizDone ? `
          <button class="btn btn-primary btn-glow" style="margin-top: 1rem; width: 100%;" id="twin-chat-cta">
            Take Footprint Quiz 🚀
          </button>
        ` : ''}
      </div>

      <div class="twin-comparison-bars glass-card">
        <h3>🌍 How You Compare</h3>
        <div class="twin-bars-list">
          ${countries.map(c => {
            const isUserTwin = c.name === twin.name;
            const percentage = Math.min(100, (c.emissions / 38) * 100);
            const userPercentage = Math.min(100, (footprint / 38) * 100);
            return `
              <div class="twin-bar-row ${isUserTwin ? 'active' : ''}">
                <div class="twin-bar-info">
                  <span>${c.flag} ${c.name}</span>
                  <span class="font-mono">${c.emissions} t</span>
                </div>
                <div class="twin-bar-track">
                  <div class="twin-bar-fill ${c.color}" style="width: ${percentage}%"></div>
                  ${isUserTwin ? `<div class="twin-marker font-mono" style="left: ${userPercentage}%" title="You are here!">You</div>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('twin-chat-cta')?.addEventListener('click', () => {
    document.getElementById('footprint-chat')?.scrollIntoView({ behavior: 'smooth' });
  });
}

// ── SECTION: YOUR CARBON BUDGET ──
function initCarbonBudget() {
  renderCarbonBudget(state.footprint || 7.2);
}

function renderCarbonBudget(footprint) {
  const container = document.getElementById('carbon-budget-content');
  if (!container) return;

  // As of mid 2026, approx 147 Gt left.
  // Global rate: 40 Gt/yr = 1268.39 tonnes/sec.
  const budgetRefDate = new Date('2026-06-15T00:00:00Z').getTime();
  const baseBudget = 147382921800; // tonnes left on June 15, 2026
  const EMISSIONS_PER_SEC = 40000000000 / (365 * 86400); // 1268.39 t/sec

  // Personal lifetime share is: remaining budget divided by population
  // 147 Gt / 8.2 Billion people = 17.92 tonnes per person remaining for life!
  const personalShare = 17.92; 
  const lifespanYears = personalShare / footprint;

  container.innerHTML = `
    <div class="carbon-budget-grid">
      <div class="budget-clock-card glass-card">
        <h3>🚨 Global Carbon Countdown Clock</h3>
        <p class="budget-clock-desc">Remaining CO₂ budget to keep global warming below <strong>1.5°C</strong>:</p>
        <div class="budget-ticker font-mono" id="budget-tonnes-ticker">0.000000</div>
        <div class="budget-unit">Gigatonnes CO₂ (GtCO₂)</div>
        
        <hr style="border: 0; border-top: 1px solid var(--border-glass); margin: 1.5rem 0;" />

        <div class="budget-time-left">
          <div class="time-block">
            <span id="budget-years" class="font-mono">0</span>
            <label>Years</label>
          </div>
          <div class="time-block">
            <span id="budget-months" class="font-mono">0</span>
            <label>Months</label>
          </div>
          <div class="time-block">
            <span id="budget-days" class="font-mono">0</span>
            <label>Days</label>
          </div>
          <div class="time-block">
            <span id="budget-hours" class="font-mono">0</span>
            <label>Hours</label>
          </div>
          <div class="time-block">
            <span id="budget-mins" class="font-mono">0</span>
            <label>Mins</label>
          </div>
          <div class="time-block">
            <span id="budget-secs" class="font-mono">0</span>
            <label>Secs</label>
          </div>
        </div>
      </div>

      <div class="budget-personal-card glass-card">
        <h3>⚖️ Your Share of the Budget</h3>
        <p class="budget-clock-desc">If we divide the remaining 1.5°C budget equally among all 8.2 billion people:</p>
        <div style="text-align: center; margin: 1.5rem 0;">
          <div style="font-size: 0.9rem; color: var(--text-secondary);">Your Lifetime CO₂ Allowance</div>
          <div class="personal-allowance font-mono">${personalShare.toFixed(2)} tonnes</div>
        </div>

        <div class="budget-gauge-container">
          <div class="budget-gauge-fill" style="width: ${Math.min(100, (lifespanYears / 30) * 100)}%; background: ${lifespanYears > 10 ? 'var(--earth-green-glow)' : lifespanYears > 4 ? 'var(--solar-gold)' : 'var(--danger-ember)'}"></div>
        </div>

        <div class="budget-lifespan-info">
          At your current consumption rate of <strong>${footprint.toFixed(1)} t/year</strong>, your personal budget allowance will last:
          <div class="lifespan-value font-display" style="color: ${lifespanYears > 10 ? 'var(--earth-green-glow)' : lifespanYears > 4 ? 'var(--solar-gold)' : 'var(--danger-ember)'}">
            ${lifespanYears.toFixed(1)} Years
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
            ${lifespanYears >= 10 ? '🌱 Great job! You are living within safe ecological boundaries.' :
              lifespanYears >= 3 ? '⚠️ You are depleting your budget rapidly. Switching to public transit or a lower meat diet will extend it.' :
              '🚨 Critical! You will exhaust your share of the planet\'s capacity in under 3 years.'}
          </p>
        </div>
      </div>
    </div>
  `;

  // Start budget countdown animation
  const elTonnes = document.getElementById('budget-tonnes-ticker');
  const elY = document.getElementById('budget-years');
  const elM = document.getElementById('budget-months');
  const elD = document.getElementById('budget-days');
  const elH = document.getElementById('budget-hours');
  const elMin = document.getElementById('budget-mins');
  const elSec = document.getElementById('budget-secs');

  function updateBudgetClock() {
    if (state.currentSection === 'carbon-budget' || state.currentSection === 'wrapped' || state.currentSection === 'daily-dashboard') {
      const now = Date.now();
      const elapsedMs = now - budgetRefDate;
      const elapsedSec = elapsedMs / 1000;
      
      const currentRemainingTonnes = baseBudget - (elapsedSec * EMISSIONS_PER_SEC);
      if (elTonnes) elTonnes.textContent = (currentRemainingTonnes / 1000000000).toFixed(9);

      // Years remaining
      const secRemaining = currentRemainingTonnes / EMISSIONS_PER_SEC;
      const years = Math.floor(secRemaining / (365 * 86400));
      const months = Math.floor((secRemaining % (365 * 86400)) / (30 * 86400));
      const days = Math.floor((secRemaining % (30 * 86400)) / 86400);
      const hours = Math.floor((secRemaining % 86400) / 3600);
      const minutes = Math.floor((secRemaining % 3600) / 60);
      const seconds = Math.floor(secRemaining % 60);

      if (elY) elY.textContent = years;
      if (elM) elM.textContent = months;
      if (elD) elD.textContent = days;
      if (elH) elH.textContent = hours;
      if (elMin) elMin.textContent = minutes;
      if (elSec) elSec.textContent = seconds;
    }
    requestAnimationFrame(updateBudgetClock);
  }

  updateBudgetClock();
}

// ── SECTION: CLIMATE IMPACT STORIES ──
let activeStoryIndex = 0;
function initImpactStories() {
  const container = document.getElementById('impact-stories-content');
  if (!container) return;

  const stories = [
    {
      title: "Venice, Italy",
      subtitle: "High Tides & Watermark Walls",
      icon: "🛶",
      desc: "Rising sea levels and land subsidence are increasing the frequency of 'Acqua Alta' (high tides) in Venice. The historic city's foundations are eroding under salt water, and floods that once happened once a decade now occur multiple times a year, threatening architectural masterpieces.",
      impact: "🌊 Sea level rise: +4.0mm/year globally. Venice flooded 100+ times in 2023.",
      solution: "The MOSE flood barriers help, but systemic warming must be halted to prevent permanent submersion by 2100."
    },
    {
      title: "Tuvalu",
      subtitle: "Sinking Paradise in the Pacific",
      icon: "🌴",
      desc: "Tuvalu is one of the world's most vulnerable nations. Rising oceans are swallowing its shores. Sea water is seeping into the ground, turning drinking wells salty and destroying root crops, forcing the nation to create a digital duplicate of itself to preserve its heritage.",
      impact: "🏝️ Max elevation: 4.6m. Saltwater intrusion has ruined 60% of arable land.",
      solution: "Reclamation of land, coastal walls, and legal treaties for climate refugees."
    },
    {
      title: "Great Barrier Reef",
      subtitle: "The Ghostly Whitening of Coral",
      icon: "🪸",
      desc: "Marine heatwaves trigger bleaching, where stressed corals expel their colorful algae companions and starve. In 2024, the Reef suffered its worst bleaching event on record, leaving vast stretches white and fragile. Coral reefs support 25% of all marine life.",
      impact: "🌡️ Ocean temperatures: 1.2°C above average. 90% of GBR corals bleached since 1998.",
      solution: "Reducing global emissions to limit warming to 1.5°C is the only way to save remaining reefs."
    },
    {
      title: "Greenland Ice Sheet",
      subtitle: "The Rushing Rivers of Ice",
      icon: "🧊",
      desc: "Greenland's ice sheet is melting at an unprecedented rate, discharging massive torrents of fresh meltwater into the North Atlantic. This threatens to disrupt the Gulf Stream ocean current system, which could drastically alter European and global climates.",
      impact: "💧 Melt rate: 270 billion tonnes of ice lost per year. Contributing 1mm/year to sea rise.",
      solution: "Immediate global decarbonization to stabilize temperatures."
    },
    {
      title: "Sahel Region, Africa",
      subtitle: "The Creeping Edge of the Sahara",
      icon: "🏜️",
      desc: "Rising temperatures and irregular rainfall are accelerating desertification across the Sahel. The Sahara is expanding southward, destroying farmland, creating food insecurity, and sparking resource conflicts for millions of pastoral farmers.",
      impact: "🌾 Land degraded: 80% in Sahel. Temperatures rising 1.5x faster than global average.",
      solution: "The 'Great Green Wall' initiative to plant an 8,000km band of trees across Africa."
    }
  ];

  function renderStoryCard(index) {
    const s = stories[index];
    container.innerHTML = `
      <div class="stories-carousel-wrapper">
        <button class="carousel-control prev-btn" id="story-prev">◀</button>
        
        <div class="story-card glass-card in-view">
          <div class="story-card-header">
            <span class="story-icon">${s.icon}</span>
            <div>
              <h3 class="story-title">${s.title}</h3>
              <div class="story-subtitle">${s.subtitle}</div>
            </div>
          </div>
          
          <p class="story-desc">${s.desc}</p>
          
          <div class="story-stat-box danger">
            <strong>🔴 Impact:</strong> ${s.impact}
          </div>
          
          <div class="story-stat-box success">
            <strong>🟢 Solution:</strong> ${s.solution}
          </div>
        </div>

        <button class="carousel-control next-btn" id="story-next">▶</button>
      </div>
      <div class="carousel-indicators">
        ${stories.map((_, i) => `<span class="carousel-dot ${i === index ? 'active' : ''}" data-index="${i}"></span>`).join('')}
      </div>
    `;

    document.getElementById('story-prev').addEventListener('click', () => {
      activeStoryIndex = (activeStoryIndex - 1 + stories.length) % stories.length;
      renderStoryCard(activeStoryIndex);
    });

    document.getElementById('story-next').addEventListener('click', () => {
      activeStoryIndex = (activeStoryIndex + 1) % stories.length;
      renderStoryCard(activeStoryIndex);
    });

    container.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        activeStoryIndex = parseInt(dot.dataset.index);
        renderStoryCard(activeStoryIndex);
      });
    });
  }

  renderStoryCard(activeStoryIndex);
}

// ── SECTION: COMMUNITY PLEDGE WALL ──
let pledgeInterval = null;
function initPledgeWall() {
  const container = document.getElementById('pledge-wall-content');
  if (!container) return;

  const defaultPledges = [
    { name: "Carlos", location: "Brazil", pledge: "Walk or bike instead of driving", co2: 1000 },
    { name: "Sophia", location: "Germany", pledge: "Eat vegetarian meals 3x/week", co2: 500 },
    { name: "Amina", location: "Kenya", pledge: "Ditch single-use plastic bottles", co2: 30 },
    { name: "Yuki", location: "Japan", pledge: "Unplug standby electronics daily", co2: 100 },
    { name: "Liam", location: "Canada", pledge: "Switch to 100% renewable energy", co2: 2000 },
    { name: "Elena", location: "Spain", pledge: "Plant 5 trees every year", co2: 110 }
  ];

  let pledges = loadData('community_pledges', defaultPledges);
  let totalPledgesCount = loadData('total_pledge_count', 142388);
  let totalSavedCo2 = loadData('total_saved_co2', 52349100); // in kg

  container.innerHTML = `
    <div class="pledge-grid">
      <div class="pledge-form-card glass-card">
        <h3>🌱 Commit to a Change</h3>
        <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:1.5rem;">Join other global citizens. Pledge an action to reduce your carbon footprint today.</p>
        <form id="pledge-form">
          <div class="form-group">
            <label for="pledge-name">First Name</label>
            <input type="text" id="pledge-name" placeholder="Enter your name" required />
          </div>
          <div class="form-group">
            <label for="pledge-location">Your Country/Location</label>
            <input type="text" id="pledge-location" placeholder="e.g. India, USA" required />
          </div>
          <div class="form-group">
            <label for="pledge-select">Select Your Pledge</label>
            <select id="pledge-select" required>
              <option value="" disabled selected>Choose a pledge...</option>
              <option value="Walk or bike instead of driving" data-co2="1000">🚶 Walk/Bike commute (-1,000 kg CO₂/yr)</option>
              <option value="Eat vegetarian meals 3x/week" data-co2="500">🥗 Vegetarian meals 3x/week (-500 kg CO₂/yr)</option>
              <option value="Ditch single-use plastic bottles" data-co2="30">🫗 Ditch plastic bottles (-30 kg CO₂/yr)</option>
              <option value="Unplug standby electronics daily" data-co2="100">🔌 Eliminate standby power (-100 kg CO₂/yr)</option>
              <option value="Switch to 100% renewable energy" data-co2="2500">☀️ Switch to renewable power (-2,500 kg CO₂/yr)</option>
              <option value="Plant 5 trees every year" data-co2="110">🌳 Plant 5 trees/yr (-110 kg CO₂/yr)</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary btn-glow" style="width:100%;margin-top:0.5rem;">⚡ Post My Pledge</button>
        </form>
      </div>

      <div class="pledge-feed-card glass-card">
        <div class="pledge-stats">
          <div class="p-stat">
            <div class="p-stat-val font-mono" id="pledge-total-count">0</div>
            <div class="p-stat-lbl">Global Pledges</div>
          </div>
          <div class="p-stat">
            <div class="p-stat-val font-mono" id="pledge-total-co2">0</div>
            <div class="p-stat-lbl">CO₂ Saved (t/yr)</div>
          </div>
        </div>
        <div class="pledge-feed-container" id="pledge-feed-container"></div>
      </div>
    </div>
  `;

  const feedContainer = document.getElementById('pledge-feed-container');
  const form = document.getElementById('pledge-form');
  const elCount = document.getElementById('pledge-total-count');
  const elCo2 = document.getElementById('pledge-total-co2');

  function renderStats() {
    if (elCount) elCount.textContent = totalPledgesCount.toLocaleString();
    if (elCo2) elCo2.textContent = Math.round(totalSavedCo2 / 1000).toLocaleString();
  }

  function renderFeed() {
    if (!feedContainer) return;
    feedContainer.innerHTML = pledges.map(p => `
      <div class="pledge-item">
        <div class="pledge-item-hdr">
          <span class="pledge-user-icon">👤</span>
          <div>
            <strong>${p.name}</strong> from <span>${p.location}</span>
          </div>
          <span class="pledge-badge">-${p.co2} kg CO₂/yr</span>
        </div>
        <div class="pledge-item-body">Pledged to: <em>${p.pledge}</em></div>
      </div>
    `).join('');
  }

  renderStats();
  renderFeed();

  // Form submission
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('pledge-name').value.trim();
    const location = document.getElementById('pledge-location').value.trim();
    const select = document.getElementById('pledge-select');
    const pledge = select.value;
    const co2 = parseInt(select.options[select.selectedIndex].dataset.co2);

    const newPledge = { name, location, pledge, co2 };
    pledges.unshift(newPledge);
    if (pledges.length > 20) pledges.pop();

    totalPledgesCount++;
    totalSavedCo2 += co2;

    saveData('community_pledges', pledges);
    saveData('total_pledge_count', totalPledgesCount);
    saveData('total_saved_co2', totalSavedCo2);

    renderStats();
    renderFeed();
    form.reset();

    setCompanionMood('happy');
    showCompanionMessage(`Thank you, ${name}! Your pledge is now live on the wall! 🌍🌱`);
  });

  // Background random pledge generator
  if (pledgeInterval) clearInterval(pledgeInterval);
  const randomNames = ["Emma", "Alex", "Luca", "Maya", "Omar", "Anya", "Sanjay", "Zoe", "Fatima", "Chloe", "Mateo", "Anna", "Ji-Woo", "Leo"];
  const randomLocations = ["United Kingdom", "Australia", "United States", "India", "South Africa", "Mexico", "France", "Japan", "South Korea", "Spain", "Singapore", "New Zealand"];
  const pledgesOptions = [
    { text: "Walk or bike instead of driving", co2: 1000 },
    { text: "Eat vegetarian meals 3x/week", co2: 500 },
    { text: "Ditch single-use plastic bottles", co2: 30 },
    { text: "Unplug standby electronics daily", co2: 100 },
    { text: "Switch to 100% renewable energy", co2: 2500 },
    { text: "Plant 5 trees every year", co2: 110 }
  ];

  pledgeInterval = setInterval(() => {
    if (state.currentSection === 'pledge-wall') {
      const name = randomNames[Math.floor(Math.random() * randomNames.length)];
      const loc = randomLocations[Math.floor(Math.random() * randomLocations.length)];
      const opt = pledgesOptions[Math.floor(Math.random() * pledgesOptions.length)];

      const item = { name, location: loc, pledge: opt.text, co2: opt.co2 };
      pledges.unshift(item);
      if (pledges.length > 20) pledges.pop();

      totalPledgesCount++;
      totalSavedCo2 += opt.co2;

      renderStats();
      renderFeed();
    }
  }, 10000);
}

// ── CUSTOM CANVAS WRAPPED CARD DOWNLOADER ──
function downloadShareableCard() {
  const footprint = state.footprint || 7.2;
  const score = Math.max(0, Math.min(100, Math.round(100 - (footprint / 15) * 100)));
  const trees = Math.ceil(footprint / 0.022);
  const twin = getBiggestImpact().split(' ').pop(); // Emoji or category

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1200;
  const ctx = canvas.getContext('2d');

  // Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, '#0a0f1e');
  bgGrad.addColorStop(0.5, '#0c152d');
  bgGrad.addColorStop(1, '#080811');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Background circles for design
  ctx.strokeStyle = 'rgba(74, 144, 226, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(canvas.width / 2, 450, 250, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(canvas.width / 2, 450, 180, 0, Math.PI * 2); ctx.stroke();

  // Draw Header Logo
  ctx.font = 'bold 36px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#22c55e'; // Green
  ctx.textAlign = 'center';
  ctx.fillText('🌍 EarthPulse AI', canvas.width / 2, 100);

  ctx.font = '22px "Inter", sans-serif';
  ctx.fillStyle = '#8a99ad';
  ctx.fillText('MY ANNUAL CLIMATE REPORT', canvas.width / 2, 145);

  // Inner Card container (glassmorphic simulation)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  roundRect(ctx, 80, 220, 640, 780, 24);
  ctx.fill();
  ctx.stroke();

  // Score Progress Circle (Outer)
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 450, 100, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 15;
  ctx.stroke();

  // Score Progress Circle (Value)
  ctx.beginPath();
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (Math.PI * 2 * (score / 100));
  ctx.arc(canvas.width / 2, 450, 100, startAngle, endAngle);
  const circleGrad = ctx.createLinearGradient(300, 350, 500, 550);
  circleGrad.addColorStop(0, '#22c55e'); // Green
  circleGrad.addColorStop(1, '#06b6d4'); // Cyan
  ctx.strokeStyle = circleGrad;
  ctx.lineWidth = 15;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Score text inside
  ctx.font = 'bold 70px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${score}%`, canvas.width / 2, 455);
  
  ctx.font = '16px "Inter", sans-serif';
  ctx.fillStyle = '#8a99ad';
  ctx.fillText('SUSTAINABILITY RATING', canvas.width / 2, 490);

  // Stat 1: Carbon Footprint
  ctx.font = '18px "Inter", sans-serif';
  ctx.fillStyle = '#8a99ad';
  ctx.fillText('Annual Carbon Footprint', canvas.width / 2, 630);
  
  ctx.font = 'bold 50px "Space Grotesk", sans-serif';
  const valGrad = ctx.createLinearGradient(300, 640, 500, 690);
  valGrad.addColorStop(0, '#22c55e');
  valGrad.addColorStop(1, '#a855f7');
  ctx.fillStyle = valGrad;
  ctx.fillText(`${footprint.toFixed(1)} tonnes`, canvas.width / 2, 690);
  
  ctx.font = '16px "Inter", sans-serif';
  ctx.fillStyle = '#8a99ad';
  ctx.fillText(footprint > 4.7 ? 'Above global average of 4.7t' : 'Below global average of 4.7t', canvas.width / 2, 720);

  // Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(150, 770);
  ctx.lineTo(650, 770);
  ctx.stroke();

  // Bottom stats Grid: left offset offset
  // Left: Trees needed
  ctx.textAlign = 'left';
  ctx.fillStyle = '#8a99ad';
  ctx.font = '16px "Inter", sans-serif';
  ctx.fillText('Offset Target:', 140, 830);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px "Space Grotesk", sans-serif';
  ctx.fillText(`🌲 ${trees} trees / yr`, 140, 865);

  // Right: Area
  ctx.textAlign = 'left';
  ctx.fillStyle = '#8a99ad';
  ctx.font = '16px "Inter", sans-serif';
  ctx.fillText('Primary Impact Area:', 430, 830);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px "Space Grotesk", sans-serif';
  ctx.fillText(`${twin}`, 430, 865);

  // Commitment text
  ctx.textAlign = 'center';
  ctx.font = 'italic 18px "Inter", sans-serif';
  ctx.fillStyle = '#8a99ad';
  ctx.fillText('"Every action counts. Shaping the future of Earth today."', canvas.width / 2, 940);

  // Footer Branding
  ctx.font = '15px "Inter", sans-serif';
  ctx.fillStyle = '#51627a';
  ctx.fillText('Explore your climate twin & timeline at: EarthPulse AI', canvas.width / 2, 1070);

  // Helper roundrect function
  function roundRect(c, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  // Trigger download
  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = 'earthpulse-climate-impact.png';
  link.href = image;
  link.click();
}

// ── UX Enhancements ──

// Tooltips
function initTooltips() {
  const tooltip = document.getElementById('global-tooltip');
  if (!tooltip) return;

  document.addEventListener('mouseover', (e) => {
    const trigger = e.target.closest('.tooltip-trigger') || e.target.closest('[data-tooltip]');
    if (trigger && trigger.dataset.tooltip) {
      tooltip.textContent = trigger.dataset.tooltip;
      const rect = trigger.getBoundingClientRect();
      
      // Calculate top position. If there's not enough room above, show it below
      let topPos = rect.top - 10;
      if (topPos < 50) {
        topPos = rect.bottom + 40;
      }
      
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.top = `${topPos}px`;
      tooltip.classList.add('show');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const trigger = e.target.closest('.tooltip-trigger') || e.target.closest('[data-tooltip]');
    if (trigger) {
      tooltip.classList.remove('show');
    }
  });
}

// Toasts
export function showToast(message, icon = '🌍') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4500);
}

// Eco-Mode
function initEcoMode() {
  const btn = document.getElementById('eco-mode-toggle');
  if (!btn) return;
  
  let ecoInterval;
  let gramsSaved = 0;

  btn.addEventListener('click', () => {
    const isActive = document.body.classList.toggle('eco-mode');
    const ticker = document.getElementById('eco-ticker');
    const display = document.getElementById('eco-saved-grams');
    
    if (isActive) {
      ticker.style.display = 'flex';
      btn.style.borderColor = 'var(--earth-green)';
      btn.style.color = 'var(--earth-green)';
      ecoInterval = setInterval(() => {
        gramsSaved += 0.5;
        display.textContent = Math.floor(gramsSaved);
      }, 1000);
      showToast('Eco-Mode Enabled. Animations disabled to save energy.', '🍃');
    } else {
      ticker.style.display = 'none';
      btn.style.borderColor = '';
      btn.style.color = '';
      clearInterval(ecoInterval);
      showToast(`Eco-Mode Disabled. You saved ${Math.floor(gramsSaved)}g of CO₂!`, '🌍');
    }
  });
}
