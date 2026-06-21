export async function fetchWeatherData(lat, lon) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,cloud_cover,uv_index&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,european_aqi`;

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(weatherUrl).then(r => r.json()),
    fetch(aqiUrl).then(r => r.json()),
  ]);

  return { weatherRes, aqiRes };
}

export async function fetchWorldBankEmissions() {
  const cachedStr = localStorage.getItem('worldBankData');
  const cacheTime = localStorage.getItem('worldBankDataTime');
  if (cachedStr && cacheTime && (Date.now() - parseInt(cacheTime) < 24 * 60 * 60 * 1000)) {
    try {
      return JSON.parse(cachedStr);
    } catch(e) {}
  }
  
  try {
    const url = 'https://api.worldbank.org/v2/country/QA;US;DE;IN;KE;WLD/indicator/EN.GHG.CO2.PC.CE.AR5?format=json&per_page=100';
    const res = await fetch(url);
    const json = await res.json();
    if (json && json[1] && Array.isArray(json[1])) {
      const parsedData = {};
      for (const entry of json[1]) {
        const code = entry.countryiso3code || entry.country.id;
        if (!parsedData[code] && entry.value !== null) {
          parsedData[code] = parseFloat(entry.value);
        }
      }
      
      const apiData = {
        'Qatar': parsedData['QAT'] || 35.6,
        'United States': parsedData['USA'] || 14.9,
        'Germany': parsedData['DEU'] || 7.7,
        'Global Average': parsedData['WLD'] || 4.7,
        'India': parsedData['IND'] || 1.9,
        'Kenya': parsedData['KEN'] || 0.3
      };
      
      localStorage.setItem('worldBankData', JSON.stringify(apiData));
      localStorage.setItem('worldBankDataTime', Date.now().toString());
      return apiData;
    }
  } catch (err) {
    console.error("World Bank API fetch failed.", err);
  }
  return null;
}
