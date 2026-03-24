# Weather App

A responsive weather application built with Vue 3 that provides real-time weather data and forecasts for cities around the world.

**Live Demo:** [https://goldenspade.github.io/weather_app/](https://goldenspade.github.io/weather_app/)

---

## Features

- **Automatic city detection** — detects the user's location via IP on first load
- **City search with autocomplete** — debounced search with keyboard navigation (↑ ↓ Enter Escape)
- **Current weather** — temperature, weather condition, feels like, humidity, wind speed & direction, pressure, visibility, sunrise and sunset times
- **5-day forecast** — daily average, min and max temperatures with weather icons
- **Temperature chart** — interactive Chart.js line chart for hourly (day) or daily (5-day) temperature data
- **Multiple weather blocks** — add up to 5 city blocks on the Home page simultaneously
- **Favorites** — save up to 5 cities to a dedicated Favorites tab, persisted in localStorage
- **Day / Night theme** — toggle between light and dark mode, preference saved in localStorage
- **Bilingual UI** — full English and Ukrainian interface via vue-i18n, language preference saved in localStorage
- **Confirmation modals** — delete block and remove from favorites actions require confirmation
- **Responsive design** — works on screens from 360px to 1200px+

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Build tool | Vite |
| State management | Pinia |
| Routing | Vue Router 4 |
| Internationalization | vue-i18n v11 |
| HTTP client | axios |
| Charts | Chart.js (tree-shaken direct import) |
| Styles | SCSS with BEM methodology, CSS custom properties for theming |
| Weather API | OpenWeatherMap (Geocoding, Current Weather, Forecast) |
| IP geolocation | ipinfo.io |

---

## Project Structure

```
src/
├── assets/
│   └── styles/
│       ├── _variables.scss        # SCSS variables + CSS custom properties (day/night themes)
│       ├── _reset.scss
│       ├── main.scss
│       ├── components/            # BEM component styles
│       │   ├── _app-header.scss
│       │   ├── _weather-block.scss
│       │   ├── _weather-card.scss
│       │   ├── _weather-chart.scss
│       │   ├── _city-autocomplete.scss
│       │   └── _modals.scss
│       └── views/
│           ├── _home.scss
│           └── _favorites.scss
├── components/
│   ├── AppHeader.vue
│   ├── WeatherBlock.vue
│   ├── WeatherCard.vue
│   ├── WeatherChart.vue
│   ├── CityAutocomplete.vue
│   ├── ConfirmModal.vue
│   └── FavoritesLimitModal.vue
├── composables/
│   ├── useWeatherApi.js           # All API calls (geocoding, weather, forecast, IP)
│   ├── useLang.js                 # Language switching
│   └── usePageTitle.js            # Dynamic document.title per view
├── locales/
│   ├── en.js
│   ├── uk.js
│   └── i18n.js
├── stores/
│   ├── favorites.js               # Favorites list (Pinia)
│   └── theme.js                   # Day/Night theme (Pinia)
├── views/
│   ├── HomeView.vue
│   └── FavoritesView.vue
└── router/
    └── index.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [OpenWeatherMap](https://openweathermap.org/api) API key (free tier is sufficient)

### Installation

```bash
# Clone the repository
git clone https://github.com/GoldenSpade/weather_app.git
cd weather_app

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```env
VITE_OWM_API_KEY=your_openweathermap_api_key
```

> `.env.local` is git-ignored by default. Never commit your API key.

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

---

## Deployment

The app is configured for GitHub Pages with `base: '/weather_app/'` in `vite.config.js`.

A `public/404.html` redirect script handles direct URL access and page refreshes for Vue Router's HTML5 history mode on GitHub Pages.

To deploy manually:
1. Run `npm run build`
2. Push the contents of `dist/` to the `gh-pages` branch
3. In repository **Settings → Pages**, set source to the `gh-pages` branch

---

## License

MIT
