export default {
  nav: {
    home: 'Home',
    favorites: 'Favorites',
    title: 'Weather App',
    pageTitleHome: 'Weather App — Current weather & forecast',
    pageTitleFavorites: 'Weather App — Favorite cities',
  },
  search: {
    placeholder: 'Enter city name...',
    noResults: 'No cities found',
  },
  weather: {
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    wind: 'Wind',
    pressure: 'Pressure',
    visibility: 'Visibility',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    ms: 'm/s',
    hPa: 'hPa',
    km: 'km',
  },
  tabs: {
    day: 'Day',
    week: '5 Days',
  },
  actions: {
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    addBlock: 'Add city',
    deleteBlock: 'Remove block',
  },
  modal: {
    confirmDelete: 'Remove block?',
    confirmDeleteText: 'Are you sure you want to remove the weather block for {city}?',
    confirm: 'Remove',
    cancel: 'Cancel',
    favoritesLimit: 'Favorites limit reached',
    favoritesLimitText: 'To add a new city, please remove "{city}" — maximum 5 favorites allowed.',
    ok: 'OK',
    confirmRemoveFav: 'Remove from favorites?',
    confirmRemoveFavText: 'Are you sure you want to remove {city} from favorites?',
  },
  chart: {
    temperature: 'Temperature, °C',
  },
  favorites: {
    empty: 'No favorite cities yet. Add them from the Home tab.',
    title: 'Favorite Cities',
  },
  theme: {
    toNight: 'Switch to night mode',
    toDay: 'Switch to day mode',
  },
  errors: {
    fetchFailed: 'Failed to load weather data',
    cityNotFound: 'City not found',
  },
  preloader: {
    loading: 'Loading...',
  },
}
