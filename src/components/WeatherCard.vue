<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  weather: { type: Object, required: true },
  forecast: { type: Object, required: true },
  viewMode: { type: String, default: 'day' },
})

const { t, locale } = useI18n()

const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`

function formatTime(unix, tzOffset) {
  const totalSec = unix + tzOffset
  const h = String(Math.floor((totalSec % 86400) / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0')
  return `${h}:${m}`
}

function windDirection(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

const current = computed(() => {
  const w = props.weather
  return {
    temp: Math.round(w.main.temp),
    feelsLike: Math.round(w.main.feels_like),
    humidity: w.main.humidity,
    pressure: w.main.pressure,
    windSpeed: w.wind.speed.toFixed(1),
    windDir: windDirection(w.wind.deg),
    visibility: (w.visibility / 1000).toFixed(0),
    sunrise: formatTime(w.sys.sunrise, w.timezone),
    sunset: formatTime(w.sys.sunset, w.timezone),
    icon: w.weather[0].icon,
    description: w.weather[0].description,
  }
})

const weekDays = computed(() => {
  const groups = {}
  props.forecast.list.forEach(item => {
    const day = item.dt_txt.split(' ')[0]
    if (!groups[day]) groups[day] = []
    groups[day].push(item)
  })

  const localeCode = locale.value === 'uk' ? 'uk-UA' : 'en-US'

  return Object.entries(groups).slice(0, 5).map(([date, items]) => {
    const temps = items.map(i => i.main.temp)
    const midItem = items.find(i => i.dt_txt.includes('12:00:00')) || items[Math.floor(items.length / 2)]
    const dayLabel = new Intl.DateTimeFormat(localeCode, { weekday: 'short' }).format(new Date(date + 'T12:00:00'))
    const dateLabel = new Intl.DateTimeFormat(localeCode, { day: 'numeric', month: 'short' }).format(new Date(date + 'T12:00:00'))

    return {
      date,
      dayLabel,
      dateLabel,
      avgTemp: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
      minTemp: Math.round(Math.min(...items.map(i => i.main.temp_min))),
      maxTemp: Math.round(Math.max(...items.map(i => i.main.temp_max))),
      icon: midItem.weather[0].icon,
      description: midItem.weather[0].description,
    }
  })
})
</script>

<template>
  <!-- Day mode -->
  <div v-if="viewMode === 'day'" class="weather-card">
    <div class="weather-card__main">
      <div class="weather-card__icon-wrap">
        <img
          class="weather-card__icon"
          :src="iconUrl(current.icon)"
          :alt="current.description"
        />
      </div>
      <div class="weather-card__temp-wrap">
        <span class="weather-card__temp">{{ current.temp }}°C</span>
        <span class="weather-card__description">{{ current.description }}</span>
        <span class="weather-card__feels">
          {{ $t('weather.feelsLike') }}: {{ current.feelsLike }}°C
        </span>
      </div>
    </div>

    <div class="weather-card__details">
      <div class="weather-card__detail">
        <span class="weather-card__detail-icon">💧</span>
        <span class="weather-card__detail-label">{{ $t('weather.humidity') }}</span>
        <span class="weather-card__detail-value">{{ current.humidity }}%</span>
      </div>
      <div class="weather-card__detail">
        <span class="weather-card__detail-icon">💨</span>
        <span class="weather-card__detail-label">{{ $t('weather.wind') }}</span>
        <span class="weather-card__detail-value">{{ current.windSpeed }} {{ $t('weather.ms') }} {{ current.windDir }}</span>
      </div>
      <div class="weather-card__detail">
        <span class="weather-card__detail-icon">🌡️</span>
        <span class="weather-card__detail-label">{{ $t('weather.pressure') }}</span>
        <span class="weather-card__detail-value">{{ current.pressure }} {{ $t('weather.hPa') }}</span>
      </div>
      <div class="weather-card__detail">
        <span class="weather-card__detail-icon">👁️</span>
        <span class="weather-card__detail-label">{{ $t('weather.visibility') }}</span>
        <span class="weather-card__detail-value">{{ current.visibility }} {{ $t('weather.km') }}</span>
      </div>
      <div class="weather-card__detail">
        <span class="weather-card__detail-icon">🌅</span>
        <span class="weather-card__detail-label">{{ $t('weather.sunrise') }}</span>
        <span class="weather-card__detail-value">{{ current.sunrise }}</span>
      </div>
      <div class="weather-card__detail">
        <span class="weather-card__detail-icon">🌇</span>
        <span class="weather-card__detail-label">{{ $t('weather.sunset') }}</span>
        <span class="weather-card__detail-value">{{ current.sunset }}</span>
      </div>
    </div>
  </div>

  <!-- Week mode -->
  <div v-else class="weather-week">
    <div
      v-for="day in weekDays"
      :key="day.date"
      class="weather-week__day"
    >
      <span class="weather-week__day-name">{{ day.dayLabel }}</span>
      <span class="weather-week__day-date">{{ day.dateLabel }}</span>
      <img
        class="weather-week__icon"
        :src="iconUrl(day.icon)"
        :alt="day.description"
      />
      <span class="weather-week__temp">{{ day.avgTemp }}°C</span>
      <span class="weather-week__range">{{ day.minTemp }}° / {{ day.maxTemp }}°</span>
      <span class="weather-week__desc">{{ day.description }}</span>
    </div>
  </div>
</template>

<style scoped>
/* ─── Day card ─────────────────────────────────── */
.weather-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.weather-card__main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.weather-card__icon-wrap {
  flex-shrink: 0;
}

.weather-card__icon {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.weather-card__temp-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.weather-card__temp {
  font-size: 2.6rem;
  font-weight: 700;
  color: #1e3a5f;
  line-height: 1;
}

.weather-card__description {
  font-size: 0.95rem;
  color: #64748b;
  text-transform: capitalize;
}

.weather-card__feels {
  font-size: 0.85rem;
  color: #94a3b8;
}

.weather-card__details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.weather-card__detail {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px 10px;
}

.weather-card__detail-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.weather-card__detail-label {
  font-size: 0.78rem;
  color: #94a3b8;
  flex: 1;
  min-width: 0;
}

.weather-card__detail-value {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e3a5f;
  white-space: nowrap;
}

/* ─── Week view ────────────────────────────────── */
.weather-week {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.weather-week__day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: #f8fafc;
  border-radius: 10px;
  padding: 12px 6px;
  text-align: center;
}

.weather-week__day-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: #1e3a5f;
  text-transform: capitalize;
}

.weather-week__day-date {
  font-size: 0.75rem;
  color: #94a3b8;
}

.weather-week__icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.weather-week__temp {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e3a5f;
}

.weather-week__range {
  font-size: 0.75rem;
  color: #64748b;
}

.weather-week__desc {
  font-size: 0.72rem;
  color: #94a3b8;
  text-transform: capitalize;
  text-align: center;
}

@media (max-width: 480px) {
  .weather-week {
    grid-template-columns: repeat(5, 1fr);
    gap: 4px;
  }

  .weather-week__day {
    padding: 8px 4px;
  }

  .weather-week__icon {
    width: 36px;
    height: 36px;
  }

  .weather-week__desc {
    display: none;
  }
}
</style>
