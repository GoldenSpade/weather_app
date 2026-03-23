import axios from 'axios'

const API_KEY = 'a660c010d79e0d58a3e25bc36a2eaa2b'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0'

export function useWeatherApi() {
  async function searchCities(query, lang = 'en') {
    if (!query || query.length < 2) return []
    const { data } = await axios.get(`${GEO_URL}/direct`, {
      params: { q: query, limit: 5, appid: API_KEY },
    })
    return data.map(item => ({
      name: item.local_names?.[lang] || item.name,
      nameEn: item.name,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
      label: `${item.local_names?.[lang] || item.name}, ${item.country}`,
    }))
  }

  async function getCurrentWeather(lat, lon, lang = 'en') {
    const { data } = await axios.get(`${BASE_URL}/weather`, {
      params: { lat, lon, appid: API_KEY, units: 'metric', lang },
    })
    return data
  }

  async function getForecast(lat, lon, lang = 'en') {
    const { data } = await axios.get(`${BASE_URL}/forecast`, {
      params: { lat, lon, appid: API_KEY, units: 'metric', lang },
    })
    return data
  }

  async function getCityByIp() {
    try {
      const { data } = await axios.get('https://ipapi.co/json/')
      return {
        name: data.city,
        nameEn: data.city,
        country: data.country_code,
        lat: data.latitude,
        lon: data.longitude,
        label: `${data.city}, ${data.country_code}`,
      }
    } catch {
      return null
    }
  }

  return { searchCities, getCurrentWeather, getForecast, getCityByIp }
}
