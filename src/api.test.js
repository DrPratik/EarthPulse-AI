import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWeatherData, fetchWorldBankEmissions } from './api.js';

describe('api.js', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    // Setup a simple mock for localStorage before each test
    const store = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => { store[key] = value.toString(); })
    });
  });

  describe('fetchWeatherData', () => {
    it('should fetch and return weather and aqi data', async () => {
      const mockWeather = { current: { temperature_2m: 25 } };
      const mockAqi = { current: { european_aqi: 40 } };

      global.fetch.mockImplementation((url) => {
        if (url.includes('air-quality')) {
          return Promise.resolve({ json: () => Promise.resolve(mockAqi) });
        }
        return Promise.resolve({ json: () => Promise.resolve(mockWeather) });
      });

      const { weatherRes, aqiRes } = await fetchWeatherData(0, 0);
      expect(weatherRes).toEqual(mockWeather);
      expect(aqiRes).toEqual(mockAqi);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('fetchWorldBankEmissions', () => {
    it('should return cached data if available and fresh', async () => {
      localStorage.setItem('worldBankData', JSON.stringify({ 'Qatar': 35.6 }));
      localStorage.setItem('worldBankDataTime', Date.now().toString());

      const data = await fetchWorldBankEmissions();
      expect(data).toEqual({ 'Qatar': 35.6 });
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should fetch from API if cache is missing', async () => {
      const mockApiRes = [
        {},
        [
          { countryiso3code: 'QAT', value: 35.6 },
          { countryiso3code: 'USA', value: 14.9 }
        ]
      ];

      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockApiRes)
      });

      const data = await fetchWorldBankEmissions();
      expect(data['Qatar']).toBe(35.6);
      expect(data['United States']).toBe(14.9);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
    
    it('should handle API failure gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('API Down'));
      
      const data = await fetchWorldBankEmissions();
      expect(data).toBeNull();
    });
  });
});
