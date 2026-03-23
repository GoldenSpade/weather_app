<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
} from 'chart.js'

Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Tooltip, Filler)

const props = defineProps({
  forecast: { type: Object, required: true },
  viewMode: { type: String, default: 'day' },
})

const { t, locale } = useI18n()
const canvasRef = ref(null)
let chartInstance = null

function getTodayItems() {
  const todayStr = new Date().toISOString().split('T')[0]
  const items = props.forecast.list.filter(i => i.dt_txt.startsWith(todayStr))
  return items.length > 0 ? items : props.forecast.list.slice(0, 8)
}

function getWeekItems() {
  const groups = {}
  props.forecast.list.forEach(item => {
    const day = item.dt_txt.split(' ')[0]
    if (!groups[day]) groups[day] = []
    groups[day].push(item)
  })

  const localeCode = locale.value === 'uk' ? 'uk-UA' : 'en-US'

  return Object.entries(groups).slice(0, 5).map(([date, items]) => {
    const temps = items.map(i => i.main.temp)
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length
    const label = new Intl.DateTimeFormat(localeCode, { weekday: 'short', day: 'numeric' })
      .format(new Date(date + 'T12:00:00'))
    return { label, avgTemp: +avgTemp.toFixed(1) }
  })
}

function buildChartData() {
  if (props.viewMode === 'day') {
    const items = getTodayItems()
    return {
      labels: items.map(i => i.dt_txt.split(' ')[1].slice(0, 5)),
      data: items.map(i => +i.main.temp.toFixed(1)),
    }
  } else {
    const items = getWeekItems()
    return {
      labels: items.map(i => i.label),
      data: items.map(i => i.avgTemp),
    }
  }
}

function createChart() {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  if (!canvasRef.value) return

  const { labels, data } = buildChartData()
  const ctx = canvasRef.value.getContext('2d')

  const gradient = ctx.createLinearGradient(0, 0, 0, 200)
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.35)')
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: t('chart.temperature'),
        data,
        borderColor: '#3b82f6',
        borderWidth: 2.5,
        pointBackgroundColor: '#3b82f6',
        pointRadius: 4,
        pointHoverRadius: 6,
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.y}°C`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { color: '#94a3b8', font: { size: 12 } },
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            color: '#94a3b8',
            font: { size: 12 },
            callback: (v) => `${v}°`,
          },
        },
      },
    },
  })
}

onMounted(createChart)
onBeforeUnmount(() => { if (chartInstance) chartInstance.destroy() })
watch([() => props.viewMode, () => props.forecast, locale], createChart)
</script>

<template>
  <div class="weather-chart">
    <canvas ref="canvasRef" />
  </div>
</template>

<style scoped>
.weather-chart {
  width: 100%;
  height: 200px;
  overflow: hidden;
  min-width: 0;
}
</style>
