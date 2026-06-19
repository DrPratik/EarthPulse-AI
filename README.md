# 🌍 EarthPulse AI

**Live Demo:** [https://DrPratik.github.io/EarthPulse-AI/](https://DrPratik.github.io/EarthPulse-AI/)

EarthPulse AI is a highly interactive, cinematic web platform designed to educate users about their carbon footprint, visualize their environmental impact, and encourage actionable sustainability pledges.

## ✨ Key Features
- **The Living Environment:** The entire website breathes with your carbon footprint. As your emissions rise, the background particle velocity increases and the Aurora gradients shift from calm greens to alarming reds.
- **Local Reality Insight:** Uses the Open-Meteo API to fetch real-time Air Quality Index (AQI) and temperatures for your specific location, overlaying it with climate impact warnings (e.g., Urban Heat Islands, Wildfire Smog).
- **Interactive Carbon Twin:** Uses the World Bank API to fetch real-time per capita CO₂ emission averages for major countries, comparing your lifestyle to global baselines.
- **Actions Lab:** A dynamic pledge system where users can commit to daily lifestyle changes. As pledges are made, the "Living Environment" heals and returns to green in real-time.
- **Cinematic Parallax:** A heavily optimized custom scroll engine that creates a stunning 3D depth effect as you navigate the page.

## 🛠️ Technologies Used
- **Core:** Vanilla JavaScript (ES6 Modules), HTML5, CSS3 (No CSS frameworks)
- **Build Tool:** Vite
- **Visuals:** Three.js (3D Globe), tsParticles (Dynamic background)
- **Data Visualization:** Chart.js
- **Testing:** Vitest
- **APIs:** World Bank Climate Data, Open-Meteo Weather & Air Quality API

## 🚀 Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/DrPratik/EarthPulse-AI.git
   cd EarthPulse-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Run Automated Tests**
   ```bash
   npm run test
   ```

## 📋 Evaluation Highlights (Hackathon Review)

- **Security:** Strict implementation of a custom `sanitizeHTML()` utility to prevent DOM-based XSS when injecting external API data. No PII is sent to external servers; all footprint data is secured via `localStorage`.
- **Accessibility:** Fully keyboard navigable. Implements strict, high-contrast `:focus-visible` states globally. Semantic HTML and `aria-live="polite"` tags are used for screen-reader compatibility.
- **Efficiency:** Utilizes `requestAnimationFrame` for 60fps animations and `IntersectionObserver` to lazy-load elements. The observers explicitly garbage-collect themselves (`.unobserve()`) to save CPU cycles once animations complete.
- **Testing:** Includes automated unit testing via Vitest to validate core security and math algorithms.
