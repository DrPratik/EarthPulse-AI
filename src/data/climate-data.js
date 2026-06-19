// Climate data - realistic values based on 2024-2025 measurements
export const climateStats = [
  {
    id: 'co2',
    icon: '💨',
    label: 'Global CO₂',
    value: 424.8,
    unit: 'ppm',
    trend: '+2.4/yr',
    color: 'card-red',
    desc: 'Atmospheric CO₂ concentration (Mauna Loa)',
  },
  {
    id: 'temp',
    icon: '🌡️',
    label: 'Temperature Anomaly',
    value: 1.48,
    unit: '°C above pre-industrial',
    trend: '+0.2/decade',
    color: 'card-red',
    desc: 'Global mean surface temperature deviation',
  },
  {
    id: 'ocean',
    icon: '🌊',
    label: 'Ocean Warming',
    value: 0.88,
    unit: '°C above 20th century avg',
    trend: 'Record high',
    color: 'card-blue',
    desc: 'Sea surface temperature anomaly',
  },
  {
    id: 'ice',
    icon: '🧊',
    label: 'Arctic Sea Ice',
    value: 4.2,
    unit: 'million km² (Sep avg)',
    trend: '-13%/decade',
    color: 'card-cyan',
    desc: 'September minimum sea ice extent',
  },
  {
    id: 'forest',
    icon: '🌳',
    label: 'Forest Loss Today',
    value: 27400,
    unit: 'hectares (daily avg)',
    trend: '10M ha/yr',
    color: 'card-green',
    desc: 'Estimated daily tropical forest loss',
  },
  {
    id: 'trees',
    icon: '🌱',
    label: 'Trees Planted Today',
    value: 41100,
    unit: 'estimated',
    trend: '15B/yr goal',
    color: 'card-green',
    desc: 'Global reforestation daily estimate',
  },
  {
    id: 'renewable',
    icon: '⚡',
    label: 'Renewable Energy Today',
    value: 32.7,
    unit: 'TWh generated',
    trend: '+14%/yr growth',
    color: 'card-gold',
    desc: 'Global renewable electricity generation',
  },
  {
    id: 'emissions',
    icon: '🏭',
    label: 'CO₂ Emitted Today',
    value: 103.5,
    unit: 'million tonnes',
    trend: '37.8 Gt/yr',
    color: 'card-red',
    desc: 'Global daily CO₂ emissions from fossil fuels',
  },
  {
    id: 'aqi',
    icon: '🌬️',
    label: 'Global AQI',
    value: 89,
    unit: 'moderate (avg)',
    trend: 'Varies by region',
    color: 'card-gold',
    desc: 'Average global Air Quality Index',
  },
  {
    id: 'sealevel',
    icon: '📈',
    label: 'Sea Level Rise',
    value: 3.6,
    unit: 'mm/year',
    trend: 'Accelerating',
    color: 'card-blue',
    desc: 'Current rate of global sea level rise',
  },
  {
    id: 'disasters',
    icon: '⚠️',
    label: 'Climate Disasters',
    value: 12,
    unit: 'major events active',
    trend: '+2x since 1980s',
    color: 'card-red',
    desc: 'Ongoing extreme weather events worldwide',
  },
  {
    id: 'plastic',
    icon: '🥤',
    label: 'Plastic in Oceans Today',
    value: 22000,
    unit: 'tonnes added (daily)',
    trend: '8M tonnes/yr',
    color: 'card-purple',
    desc: 'Estimated daily plastic entering oceans',
  },
];

// Chat conversation flow
export const chatFlow = [
  {
    id: 'welcome',
    message: "Hi there! 🌍 I'm your EarthPulse assistant. Let's discover your carbon footprint together — it takes about 2 minutes. Ready to start?",
    options: [
      { text: "Let's go! 🚀", next: 'transport' },
      { text: 'What will I learn?', next: 'explain' },
    ],
  },
  {
    id: 'explain',
    message: "Great question! I'll ask about your daily habits — how you travel, eat, and live. Then I'll show your personal carbon footprint and compare it to the global average. No judgement, just awareness! 💚",
    options: [
      { text: "OK, let's start!", next: 'transport' },
    ],
  },
  {
    id: 'transport',
    message: "🚗 How do you mostly get around on a typical day?",
    options: [
      { text: '🚗 Car (petrol/diesel)', next: 'car_km', impact: { transport: 4.6 } },
      { text: '🚗 Car (electric)', next: 'car_km', impact: { transport: 1.5 } },
      { text: '🚌 Public transport', next: 'food', impact: { transport: 1.2 } },
      { text: '🚲 Bicycle / Walking', next: 'food', impact: { transport: 0.0 } },
      { text: '🏍️ Motorcycle / Scooter', next: 'food', impact: { transport: 2.1 } },
      { text: '🛺 Mix of everything', next: 'food', impact: { transport: 2.5 } },
    ],
  },
  {
    id: 'car_km',
    message: "How far do you typically drive each day?",
    options: [
      { text: '< 10 km', next: 'food', impact: { transportMult: 0.3 } },
      { text: '10-30 km', next: 'food', impact: { transportMult: 0.7 } },
      { text: '30-60 km', next: 'food', impact: { transportMult: 1.0 } },
      { text: '60+ km', next: 'food', impact: { transportMult: 1.5 } },
    ],
  },
  {
    id: 'food',
    message: "🍽️ What best describes your diet?",
    options: [
      { text: '🌱 Vegan', next: 'energy', impact: { food: 1.5 } },
      { text: '🥚 Vegetarian', next: 'energy', impact: { food: 2.0 } },
      { text: '🐟 Pescatarian', next: 'energy', impact: { food: 2.5 } },
      { text: '🥩 Meat 1-2 times/week', next: 'energy', impact: { food: 3.2 } },
      { text: '🥩 Meat daily', next: 'energy', impact: { food: 5.0 } },
    ],
  },
  {
    id: 'energy',
    message: "⚡ How do you power your home?",
    options: [
      { text: '☀️ Solar / Renewable', next: 'shopping', impact: { energy: 0.5 } },
      { text: '⚡ Grid electricity', next: 'shopping', impact: { energy: 3.5 } },
      { text: '🔥 Mix (grid + some renewable)', next: 'shopping', impact: { energy: 2.0 } },
      { text: "🤷 I don't know", next: 'shopping', impact: { energy: 3.0 } },
    ],
  },
  {
    id: 'shopping',
    message: "🛍️ How often do you buy new clothes or gadgets?",
    options: [
      { text: '🛒 Weekly shopper', next: 'flying', impact: { shopping: 3.0 } },
      { text: '🛒 Monthly', next: 'flying', impact: { shopping: 1.5 } },
      { text: '🛒 Only when needed', next: 'flying', impact: { shopping: 0.5 } },
      { text: '♻️ Mostly secondhand', next: 'flying', impact: { shopping: 0.2 } },
    ],
  },
  {
    id: 'flying',
    message: "✈️ How many flights do you take per year?",
    options: [
      { text: '✈️ None', next: 'waste', impact: { flying: 0.0 } },
      { text: '✈️ 1-2 short flights', next: 'waste', impact: { flying: 0.8 } },
      { text: '✈️ 3-5 flights', next: 'waste', impact: { flying: 2.5 } },
      { text: '✈️ 6+ flights', next: 'waste', impact: { flying: 5.0 } },
      { text: '✈️ Frequent flyer', next: 'waste', impact: { flying: 10.0 } },
    ],
  },
  {
    id: 'waste',
    message: "♻️ Last one! How do you handle waste?",
    options: [
      { text: '♻️ Recycle + Compost', next: 'result', impact: { waste: 0.2 } },
      { text: '♻️ Recycle most things', next: 'result', impact: { waste: 0.5 } },
      { text: '🗑️ Basic recycling', next: 'result', impact: { waste: 1.0 } },
      { text: '🗑️ Don\'t really recycle', next: 'result', impact: { waste: 1.8 } },
    ],
  },
];

// Equivalency data for dashboard
export const equivalencies = [
  { icon: '🌳', factor: 0.022, unit: 'trees needed to absorb this', label: 'for one year' },
  { icon: '🚗', factor: 4.1, unit: 'km driven', label: 'in a petrol car' },
  { icon: '📱', factor: 121, unit: 'smartphone charges', label: 'worth of energy' },
  { icon: '💡', factor: 5.2, unit: 'hours of AC', label: 'running non-stop' },
  { icon: '🍔', factor: 1.45, unit: 'beef burgers', label: 'equivalent emissions' },
  { icon: '✈️', factor: 0.0044, unit: 'km of flying', label: 'passenger flight' },
  { icon: '🚿', factor: 18.5, unit: 'hot showers', label: '8-minute showers' },
  { icon: '📺', factor: 14.8, unit: 'hours of Netflix', label: 'streaming at HD' },
];

// Actions for the "Small Actions Big Impact" simulator
export const actions = [
  { id: 'walk', icon: '🚶', name: 'Walk instead of drive', dailySave: 2.6, desc: '5 km commute switch' },
  { id: 'metro', icon: '🚇', name: 'Use public transport', dailySave: 1.8, desc: 'Daily commute by metro' },
  { id: 'veg', icon: '🥗', name: 'Eat vegetarian meals', dailySave: 3.2, desc: 'Switch from meat daily' },
  { id: 'bottle', icon: '🫗', name: 'Carry reusable bottle', dailySave: 0.08, desc: 'Skip 1 plastic bottle/day' },
  { id: 'solar', icon: '☀️', name: 'Use solar energy', dailySave: 5.4, desc: 'Rooftop solar panels' },
  { id: 'ac', icon: '❄️', name: 'Reduce AC by 2°C', dailySave: 1.2, desc: 'Set thermostat higher' },
  { id: 'led', icon: '💡', name: 'Use LED lights', dailySave: 0.45, desc: 'Replace all incandescent' },
  { id: 'local', icon: '🛍️', name: 'Buy local products', dailySave: 0.7, desc: 'Reduce transport emissions' },
];

// Time machine projections (per year, starting from 2025)
export const timelineProjections = {
  temperature: { base: 1.48, ratePerYear: 0.025, unit: '°C above pre-industrial' },
  seaLevel: { base: 0, ratePerYear: 3.8, unit: 'mm rise (cumulative)' },
  forestCover: { base: 31, ratePerYear: -0.12, unit: '% of land area' },
  biodiversity: { base: 100, ratePerYear: -0.8, unit: '% species remaining (index)' },
  airQuality: { base: 89, ratePerYear: 0.5, unit: 'AQI (global avg)' },
  waterStress: { base: 2.3, ratePerYear: 0.04, unit: 'billion people affected' },
};

// Product lifecycle stories
export const products = [
  {
    id: 'hamburger',
    emoji: '🍔',
    name: 'Hamburger',
    co2: 6.6,
    water: 2400,
    journey: [
      { icon: '🌾', label: 'Feed crops grown', impact: '2.5 kg CO₂' },
      { icon: '🐄', label: 'Cattle raised', impact: '3.0 kg CO₂' },
      { icon: '🏭', label: 'Processing plant', impact: '0.5 kg CO₂' },
      { icon: '🚛', label: 'Transportation', impact: '0.3 kg CO₂' },
      { icon: '🍽️', label: 'Cooked & served', impact: '0.3 kg CO₂' },
    ],
    facts: ['Uses 2,400L of water', 'Needs 7m² of land', 'Produces 6.6 kg CO₂'],
  },
  {
    id: 'tshirt',
    emoji: '👕',
    name: 'T-Shirt',
    co2: 8.0,
    water: 2700,
    journey: [
      { icon: '🌿', label: 'Cotton farmed', impact: '2.0 kg CO₂' },
      { icon: '🧵', label: 'Spun into yarn', impact: '1.5 kg CO₂' },
      { icon: '🏭', label: 'Dyed & treated', impact: '2.5 kg CO₂' },
      { icon: '✂️', label: 'Cut & sewn', impact: '1.0 kg CO₂' },
      { icon: '🚢', label: 'Shipped globally', impact: '1.0 kg CO₂' },
    ],
    facts: ['Uses 2,700L of water', 'Often travels 20,000+ km', '85% of textiles end in landfill'],
  },
  {
    id: 'smartphone',
    emoji: '📱',
    name: 'Smartphone',
    co2: 70,
    water: 12000,
    journey: [
      { icon: '⛏️', label: 'Minerals mined', impact: '20 kg CO₂' },
      { icon: '🔬', label: 'Components made', impact: '25 kg CO₂' },
      { icon: '🔧', label: 'Assembly', impact: '10 kg CO₂' },
      { icon: '✈️', label: 'Air-shipped', impact: '10 kg CO₂' },
      { icon: '🔌', label: '2-yr usage', impact: '5 kg CO₂' },
    ],
    facts: ['Contains 30+ elements', 'Uses 12,000L of water', '80% of emissions from manufacturing'],
  },
  {
    id: 'coffee',
    emoji: '☕',
    name: 'Cup of Coffee',
    co2: 0.28,
    water: 140,
    journey: [
      { icon: '🌱', label: 'Beans grown', impact: '0.10 kg CO₂' },
      { icon: '🏭', label: 'Roasted', impact: '0.05 kg CO₂' },
      { icon: '🚛', label: 'Transported', impact: '0.05 kg CO₂' },
      { icon: '☕', label: 'Brewed', impact: '0.03 kg CO₂' },
      { icon: '🥤', label: 'Disposable cup', impact: '0.05 kg CO₂' },
    ],
    facts: ['140L of water per cup', 'Reusable cup saves 0.05 kg', '2.25B cups consumed daily'],
  },
  {
    id: 'flight',
    emoji: '✈️',
    name: 'Flight (1000km)',
    co2: 250,
    water: 0,
    journey: [
      { icon: '⛽', label: 'Jet fuel refined', impact: '30 kg CO₂' },
      { icon: '🛫', label: 'Takeoff', impact: '80 kg CO₂' },
      { icon: '✈️', label: 'Cruise', impact: '110 kg CO₂' },
      { icon: '🛬', label: 'Landing', impact: '20 kg CO₂' },
      { icon: '🏗️', label: 'Airport ops', impact: '10 kg CO₂' },
    ],
    facts: ['250 kg CO₂ per passenger', 'Aviation is 2.5% of global CO₂', 'Contrails double warming effect'],
  },
  {
    id: 'laptop',
    emoji: '💻',
    name: 'Laptop',
    co2: 350,
    water: 50000,
    journey: [
      { icon: '⛏️', label: 'Raw materials', impact: '100 kg CO₂' },
      { icon: '🔬', label: 'Chip fabrication', impact: '120 kg CO₂' },
      { icon: '🔧', label: 'Assembly', impact: '60 kg CO₂' },
      { icon: '🚢', label: 'Shipping', impact: '30 kg CO₂' },
      { icon: '🔌', label: '4-yr usage', impact: '40 kg CO₂' },
    ],
    facts: ['350 kg CO₂ lifetime', '50,000L of water', 'Keep it 1 year longer = 30% less impact'],
  },
  {
    id: 'bottle',
    emoji: '🥤',
    name: 'Plastic Bottle',
    co2: 0.08,
    water: 3,
    journey: [
      { icon: '🛢️', label: 'Oil extracted', impact: '0.02 kg CO₂' },
      { icon: '🏭', label: 'Plastic made', impact: '0.03 kg CO₂' },
      { icon: '🫗', label: 'Bottle molded', impact: '0.01 kg CO₂' },
      { icon: '🚛', label: 'Distributed', impact: '0.01 kg CO₂' },
      { icon: '🗑️', label: 'Disposal', impact: '0.01 kg CO₂' },
    ],
    facts: ['Takes 450 years to decompose', '1M bottles bought per minute globally', 'Only 9% of plastic recycled'],
  },
];

// Knowledge hub topics
export const knowledgeTopics = [
  { emoji: '🌡️', title: 'Climate Change 101', desc: 'Understand the science behind global warming, greenhouse gases, and why 1.5°C matters.', tag: 'Essential', color: 'card-red' },
  { emoji: '👣', title: 'Carbon Footprint', desc: 'What it means, how it\'s measured, and why your personal footprint matters in the big picture.', tag: 'Core', color: 'card-green' },
  { emoji: '⚡', title: 'Renewable Energy', desc: 'Solar, wind, hydro, and beyond — how clean energy is reshaping our world.', tag: 'Solutions', color: 'card-gold' },
  { emoji: '♻️', title: 'Circular Economy', desc: 'Design waste out. Keep materials in use. Regenerate nature. The future of production.', tag: 'Innovation', color: 'card-cyan' },
  { emoji: '🏡', title: 'Sustainable Living', desc: 'Practical tips for reducing your environmental impact at home, at work, and on the go.', tag: 'Lifestyle', color: 'card-green' },
  { emoji: '🌊', title: 'Ocean Conservation', desc: 'Our oceans absorb 30% of CO₂ and produce 50% of oxygen. They need our help.', tag: 'Critical', color: 'card-blue' },
  { emoji: '💧', title: 'Water Conservation', desc: 'Only 0.5% of Earth\'s water is usable freshwater. Every drop counts.', tag: 'Essential', color: 'card-blue' },
  { emoji: '🐘', title: 'Biodiversity', desc: '1 million species face extinction. Why biodiversity is Earth\'s life support system.', tag: 'Crisis', color: 'card-purple' },
  { emoji: '🚗', title: 'Electric Vehicles', desc: 'The EV revolution — myths, facts, and how switching drives change.', tag: 'Transport', color: 'card-cyan' },
  { emoji: '🌾', title: 'Sustainable Agriculture', desc: 'Feeding 8 billion people without destroying the planet. Is it possible?', tag: 'Food', color: 'card-green' },
  { emoji: '🏗️', title: 'Green Buildings', desc: 'Buildings account for 39% of emissions. Smart design can change everything.', tag: 'Architecture', color: 'card-gold' },
  { emoji: '🧴', title: 'Plastic Pollution', desc: '8 million tonnes of plastic enter oceans yearly. What can we actually do?', tag: 'Crisis', color: 'card-red' },
];

// Climate myths
export const myths = [
  {
    statement: "Electric vehicle batteries are worse for the environment than petrol cars.",
    isMyth: true,
    explanation: "While EV battery production has a higher initial carbon footprint, EVs produce significantly less CO₂ over their lifetime. A typical EV pays off its 'carbon debt' within 1-2 years of driving and saves 50-70% emissions over its lifetime compared to a petrol car.",
  },
  {
    statement: "The Earth's climate has always changed, so current warming is natural.",
    isMyth: true,
    explanation: "While climate has naturally varied, current warming is 10x faster than any change in the past 65 million years. 97% of climate scientists agree that human activities, primarily burning fossil fuels, are the dominant cause of warming since the 1950s.",
  },
  {
    statement: "Individual actions don't matter when corporations produce 71% of emissions.",
    isMyth: true,
    explanation: "That 71% figure refers to industrial supply chains producing goods WE consume. Consumer demand drives corporate behavior. Individual choices influence markets, shift norms, and drive policy change. Both systemic change AND individual action are essential.",
  },
  {
    statement: "Renewable energy is now cheaper than fossil fuels in most of the world.",
    isMyth: false,
    explanation: "This is TRUE! Solar and wind are now the cheapest sources of new electricity in countries representing 90% of global power generation. Solar costs have dropped 89% since 2010, making renewables not just green but economically superior.",
  },
  {
    statement: "Recycling plastic is mostly just greenwashing — it doesn't really work.",
    isMyth: true,
    explanation: "While only about 9% of plastic is recycled globally (which IS a problem), recycling aluminum and paper IS highly effective. The issue isn't recycling itself but our plastic production system. Reducing and reusing are even more impactful than recycling.",
  },
  {
    statement: "Planting trees is the single best solution to climate change.",
    isMyth: true,
    explanation: "Trees are helpful but not a silver bullet. We'd need to plant an area the size of the US to offset just current emissions. Trees take decades to mature, can burn in wildfires, and don't address root causes. We need forests AND emissions reduction.",
  },
  {
    statement: "Meat production accounts for 14.5% of all global greenhouse gas emissions.",
    isMyth: false,
    explanation: "This is TRUE! According to the FAO, livestock contributes 14.5% of global GHG emissions — more than all transportation combined. Beef alone generates 60kg CO₂ per kg produced, compared to just 0.3kg for lentils.",
  },
  {
    statement: "One long-haul flight produces more CO₂ than many people create in an entire year.",
    isMyth: false,
    explanation: "TRUE! A round-trip London-New York flight produces about 1.6 tonnes of CO₂ per passenger. The average person in many developing nations produces less than 2 tonnes per YEAR. Aviation is one of the most carbon-intensive activities an individual can do.",
  },
  {
    statement: "Nuclear energy is too dangerous and shouldn't be part of the clean energy mix.",
    isMyth: true,
    explanation: "Nuclear energy has the lowest death rate per unit of energy of ANY power source, including wind and solar. Modern reactor designs are extremely safe, and nuclear produces virtually zero operational emissions. Many experts consider it essential for achieving net-zero.",
  },
  {
    statement: "The fashion industry produces more emissions than aviation and shipping combined.",
    isMyth: false,
    explanation: "TRUE! The fashion industry produces 8-10% of global CO₂ emissions — more than international flights and maritime shipping combined. Fast fashion has doubled clothing production since 2000, with the average garment worn only 7 times before being discarded.",
  },
];

// What if everyone scenarios
export const whatIfScenarios = [
  {
    id: 'bottles',
    icon: '🫗',
    title: 'Used reusable water bottles',
    desc: 'If everyone carried a reusable bottle',
    globalImpact: {
      co2Saved: '2.5 million tonnes CO₂/year',
      plasticReduced: '480 billion bottles/year eliminated',
      waterSaved: '17 billion liters of water/year',
      equivalent: 'Like removing 500,000 cars from roads',
    },
  },
  {
    id: 'meatless',
    icon: '🥗',
    title: 'Ate vegetarian once a week',
    desc: 'Just one meatless day per week',
    globalImpact: {
      co2Saved: '2.1 billion tonnes CO₂/year',
      plasticReduced: '340 million acres of farmland freed',
      waterSaved: '1.8 trillion liters of water/year',
      equivalent: 'Like taking every car in Europe off the road',
    },
  },
  {
    id: 'transport',
    icon: '🚇',
    title: 'Used public transport for commuting',
    desc: 'Switch from car to metro/bus',
    globalImpact: {
      co2Saved: '5.4 billion tonnes CO₂/year',
      plasticReduced: '3 billion fewer vehicles needed',
      waterSaved: '890 billion liters of fuel/year',
      equivalent: "Like shutting down 1,350 coal power plants",
    },
  },
  {
    id: 'ac',
    icon: '❄️',
    title: 'Raised AC temperature by 2°C',
    desc: 'Set thermostat from 22°C to 24°C',
    globalImpact: {
      co2Saved: '1.2 billion tonnes CO₂/year',
      plasticReduced: '8% reduction in electricity demand',
      waterSaved: '1.4 trillion liters cooling water/year',
      equivalent: 'Like closing 300 coal power plants',
    },
  },
];

// Earth companion messages
export const companionMessages = {
  welcome: ["Hey there! 🌍 I'm Earth. Let's explore together!", "Welcome, friend! Ready to learn about our planet?"],
  livingEarth: ["These are my vital signs. I've been running a fever lately... 🌡️", "My oceans are warming. Can you help me cool down?"],
  chat: ["Be honest! There's no wrong answer here 💚", "I love learning about how people live!"],
  dashboard: ["Every kg of CO₂ tells a story. What's yours?", "Small numbers add up to big changes!"],
  actionsLab: ["Ooh, try toggling some actions! Watch what happens!", "Every switch you flip makes me happier 🌱"],
  timeMachine: ["My future depends on what we do today...", "Slide to the right — do you like what you see?"],
  consumption: ["Click something! You'll be surprised what's inside.", "Everything has a story. Most aren't pretty."],
  knowledge: ["Knowledge is the first step to change! 📚", "Learn something new today!"],
  myths: ["Think carefully! Not everything is what it seems 🤔", "You're doing great! Knowledge is power!"],
  whatIf: ["Imagine if EVERYONE did this... 🌍✨", "The power of collective action is incredible!"],
  wrapped: ["This is YOUR story. Own it! 💪", "Next year can be even better!"],
  wow: ["Two futures. The choice is yours. 💚", "I believe in you. We can change this together."],
  happy: ["You're making me so happy! 🌿💚", "I can feel the trees growing! Thank you!"],
  sad: ["Hmm, that makes me a little worried... 😟", "I'm not giving up on us! 🌍"],
  neutral: ["Every journey starts with a single step.", "Let's keep going together!"],
};

// 2050 WOW moment data
export const wowData = {
  currentTrajectory: {
    label: 'If We Continue As-Is',
    year: '2050',
    metrics: [
      { label: 'Temperature Rise', value: '+2.7°C', severity: 'danger' },
      { label: 'Sea Level Rise', value: '+40 cm', severity: 'danger' },
      { label: 'Forest Cover', value: '25%', severity: 'warning' },
      { label: 'Species at Risk', value: '40%', severity: 'danger' },
      { label: 'Air Quality (AQI)', value: '130 (Unhealthy)', severity: 'danger' },
      { label: 'Water Stress', value: '5.7B people', severity: 'danger' },
    ],
  },
  improvedTrajectory: {
    label: 'If We Act Now',
    year: '2050',
    metrics: [
      { label: 'Temperature Rise', value: '+1.6°C', severity: 'good' },
      { label: 'Sea Level Rise', value: '+18 cm', severity: 'warning' },
      { label: 'Forest Cover', value: '34%', severity: 'good' },
      { label: 'Species at Risk', value: '15%', severity: 'warning' },
      { label: 'Air Quality (AQI)', value: '55 (Moderate)', severity: 'good' },
      { label: 'Water Stress', value: '3.2B people', severity: 'warning' },
    ],
  },
};

// Climate Challenges
export const challenges = {
  daily: [
    { id: 'd1', icon: '🚶', title: 'Walk 2,000 Steps Instead of Driving', desc: 'Take a 15-minute walk for short errands today.', reward: '🌿 Saves 1.2 kg CO₂', co2: 1.2, difficulty: 'easy' },
    { id: 'd2', icon: '🥗', title: 'Eat a Fully Plant-Based Meal', desc: 'Replace one meal with vegetables, grains, and legumes.', reward: '🌿 Saves 2.5 kg CO₂', co2: 2.5, difficulty: 'easy' },
    { id: 'd3', icon: '🚿', title: 'Take a 5-Minute Shower', desc: 'Cut your shower time to under 5 minutes.', reward: '💧 Saves 30L water + 0.5 kg CO₂', co2: 0.5, difficulty: 'easy' },
    { id: 'd4', icon: '🔌', title: 'Unplug All Standby Devices', desc: 'Turn off and unplug devices not in use before bed.', reward: '⚡ Saves 0.3 kg CO₂', co2: 0.3, difficulty: 'easy' },
  ],
  weekly: [
    { id: 'w1', icon: '🚲', title: 'Bike Commute for a Week', desc: 'Use a bicycle for your daily commute all week.', reward: '🌿 Saves 12 kg CO₂/week', co2: 12, difficulty: 'medium' },
    { id: 'w2', icon: '🛒', title: 'Zero-Waste Grocery Trip', desc: 'Buy all groceries package-free or in reusable bags.', reward: '♻️ Eliminates ~2 kg plastic', co2: 3, difficulty: 'medium' },
    { id: 'w3', icon: '👕', title: 'No-Buy Fashion Week', desc: 'Don\'t purchase any new clothing for 7 days.', reward: '🌿 Saves 5 kg CO₂', co2: 5, difficulty: 'easy' },
    { id: 'w4', icon: '🌱', title: 'Start Composting', desc: 'Compost food scraps instead of throwing them away.', reward: '♻️ Diverts 3 kg from landfill', co2: 2, difficulty: 'medium' },
  ],
  monthly: [
    { id: 'm1', icon: '🌳', title: 'Plant a Tree', desc: 'Plant or sponsor the planting of at least one tree.', reward: '🌳 Absorbs 22 kg CO₂/year', co2: 22, difficulty: 'medium' },
    { id: 'm2', icon: '☀️', title: 'Energy Audit Your Home', desc: 'Identify and fix energy leaks — insulation, LED switches, smart plugs.', reward: '⚡ Saves up to 15% energy', co2: 30, difficulty: 'hard' },
    { id: 'm3', icon: '📦', title: 'Declutter & Donate', desc: 'Donate unused items instead of throwing them away.', reward: '♻️ Extends product lifecycle', co2: 8, difficulty: 'easy' },
    { id: 'm4', icon: '🧑‍🍳', title: 'Meal Prep Challenge', desc: 'Plan and prep all meals to eliminate food waste.', reward: '🍽️ Reduces waste by 50%', co2: 15, difficulty: 'medium' },
  ],
};

// Carbon Marketplace of Actions
export const marketplaceActions = [
  { id: 'mp1', icon: '💡', name: 'Switch to LED Bulbs', desc: 'Replace all home lighting with LEDs', effort: 'low', cost: 'low', co2PerYear: 200, unit: 'kg' },
  { id: 'mp2', icon: '🚶', name: 'Walk Short Distances', desc: 'Walk trips under 2 km instead of driving', effort: 'low', cost: 'free', co2PerYear: 350, unit: 'kg' },
  { id: 'mp3', icon: '🥗', name: 'Eat Vegetarian 3x/Week', desc: 'Replace meat with plant-based meals', effort: 'medium', cost: 'free', co2PerYear: 500, unit: 'kg' },
  { id: 'mp4', icon: '🫗', name: 'Use Reusable Bottle', desc: 'Carry a bottle, skip single-use plastic', effort: 'low', cost: 'low', co2PerYear: 30, unit: 'kg' },
  { id: 'mp5', icon: '🔌', name: 'Unplug Standby Devices', desc: 'Eliminate phantom power consumption', effort: 'low', cost: 'free', co2PerYear: 100, unit: 'kg' },
  { id: 'mp6', icon: '☀️', name: 'Install Solar Panels', desc: 'Generate your own clean electricity', effort: 'high', cost: 'high', co2PerYear: 2000, unit: 'kg' },
  { id: 'mp7', icon: '🚲', name: 'Bike Commute', desc: 'Cycle to work instead of driving', effort: 'medium', cost: 'low', co2PerYear: 950, unit: 'kg' },
  { id: 'mp8', icon: '❄️', name: 'Adjust Thermostat ±2°C', desc: 'Slightly warmer in summer, cooler in winter', effort: 'low', cost: 'free', co2PerYear: 440, unit: 'kg' },
  { id: 'mp9', icon: '🛒', name: 'Buy Local Produce', desc: 'Shop at farmers markets, reduce food miles', effort: 'medium', cost: 'low', co2PerYear: 250, unit: 'kg' },
  { id: 'mp10', icon: '👕', name: 'Buy Secondhand Clothes', desc: 'Thrift instead of fast fashion', effort: 'medium', cost: 'free', co2PerYear: 400, unit: 'kg' },
  { id: 'mp11', icon: '🧴', name: 'Switch to Bar Soap/Shampoo', desc: 'Eliminate plastic packaging from bathroom', effort: 'low', cost: 'low', co2PerYear: 25, unit: 'kg' },
  { id: 'mp12', icon: '🚇', name: 'Use Public Transit', desc: 'Take metro/bus instead of personal car', effort: 'medium', cost: 'low', co2PerYear: 650, unit: 'kg' },
  { id: 'mp13', icon: '✈️', name: 'Take One Less Flight/Year', desc: 'Choose train or video call instead', effort: 'medium', cost: 'free', co2PerYear: 1600, unit: 'kg' },
  { id: 'mp14', icon: '🌳', name: 'Plant Trees Quarterly', desc: 'Plant or sponsor 4 trees per year', effort: 'low', cost: 'low', co2PerYear: 88, unit: 'kg' },
  { id: 'mp15', icon: '🏠', name: 'Insulate Your Home', desc: 'Proper insulation reduces heating/cooling energy', effort: 'high', cost: 'medium', co2PerYear: 1200, unit: 'kg' },
];

// Generational Impact data
export const generationalData = {
  generations: [
    {
      label: 'You',
      avatar: '🧑',
      years: '2025 — 2065',
      metrics: [
        { label: 'Lifetime CO₂', value: null, severity: 'warning', multiplier: 40 },
        { label: 'Trees Needed', value: null, severity: 'warning', treeMult: true },
        { label: 'Water Used', value: null, severity: 'warning', waterMult: 40 },
      ],
    },
    {
      label: 'Your Children',
      avatar: '👶',
      years: '2050 — 2120',
      inherited: true,
      metrics: [
        { label: 'Inherited Warming', value: '+1.8°C to +2.4°C', severity: 'warning' },
        { label: 'Sea Level They Face', value: '+25 to +60 cm', severity: 'danger' },
        { label: 'Species Lost', value: '15-30%', severity: 'danger' },
        { label: 'Water Stress', value: '4-6 billion people', severity: 'danger' },
      ],
    },
    {
      label: 'Your Grandchildren',
      avatar: '👧',
      years: '2080 — 2170',
      inherited: true,
      metrics: [
        { label: 'Inherited Warming', value: '+2.0°C to +3.5°C', severity: 'danger' },
        { label: 'Sea Level They Face', value: '+50 cm to +1.5 m', severity: 'danger' },
        { label: 'Climate Refugees', value: '1-2 billion people', severity: 'danger' },
        { label: 'Extreme Weather', value: '5x more frequent', severity: 'danger' },
      ],
    },
  ],
};
