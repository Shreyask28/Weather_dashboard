const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');
const weatherDisplay = document.getElementById('weather-display');


const currentCityEl = document.getElementById('current-city');
const currentTempEl = document.getElementById('current-temp');
const currentConditionEl = document.getElementById('current-condition');
const currentWindEl = document.getElementById('current-wind');

// Forecast Container
const forecastCardsContainer = document.getElementById('forecast-cards');


const getWeatherInterpretation = (code) => {
  const codeMap = {
    0: { text: 'Clear Sky', icon: '☀️' },
    1: { text: 'Mainly Clear', icon: '🌤️' },
    2: { text: 'Partly Cloudy', icon: '⛅' },
    3: { text: 'Overcast', icon: '☁️' },
    45: { text: 'Foggy', icon: '🌫️' },
    48: { text: 'Depositing Rime Fog', icon: '🌫️' },
    51: { text: 'Light Drizzle', icon: '🌦️' },
    53: { text: 'Moderate Drizzle', icon: '🌦️' },
    55: { text: 'Dense Drizzle', icon: '🌧️' },
    61: { text: 'Slight Rain', icon: '🌦️' },
    63: { text: 'Moderate Rain', icon: '🌧️' },
    65: { text: 'Heavy Rain', icon: '🌧️' },
    71: { text: 'Slight Snow', icon: '🌨️' },
    73: { text: 'Moderate Snow', icon: '❄️' },
    75: { text: 'Heavy Snow', icon: '❄️' },
    80: { text: 'Rain Showers', icon: '🌦️' },
    81: { text: 'Heavy Showers', icon: '🌧️' },
    82: { text: 'Violent Showers', icon: '⛈️' },
    95: { text: 'Thunderstorm', icon: '⛈️' },
    96: { text: 'Thunderstorm with Hail', icon: '⛈️' },
    99: { text: 'Severe Thunderstorm', icon: '⛈️' }
  };

  return codeMap[code] || { text: 'Variable Weather', icon: '🌡️' };
};


const showLoading = () => {
  loadingSpinner.classList.remove('hidden');
  errorMessage.classList.add('hidden');
  weatherDisplay.classList.add('hidden');
};

const hideLoading = () => {
  loadingSpinner.classList.add('hidden');
};

const showError = (message) => {
  hideLoading();
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  weatherDisplay.classList.add('hidden');
};

const clearError = () => {
  errorMessage.classList.add('hidden');
  errorMessage.textContent = '';
};


const formatDayName = (dateStr, index) => {
  if (index === 0) return 'Today';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
};


const fetchCoordinates = async (cityName) => {
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;

  const response = await fetch(geocodingUrl);

  if (!response.ok) {
    throw new Error(`Geocoding service unavailable (HTTP ${response.status})`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${cityName}" not found. Please check spelling.`);
  }

  const { name, country, latitude, longitude } = data.results[0];
  return { name, country, latitude, longitude };
};

/**
 * Fetch current weather and multi-day forecast from Open-Meteo
 */
const fetchWeatherData = async (latitude, longitude) => {
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;

  const response = await fetch(forecastUrl);

  if (!response.ok) {
    throw new Error(`Weather service unavailable (HTTP ${response.status})`);
  }

  return await response.json();
};


const displayCurrentWeather = (cityName, country, currentWeather) => {
  const { temperature, windspeed, weathercode } = currentWeather;
  const condition = getWeatherInterpretation(weathercode);

  currentCityEl.textContent = country ? `${cityName}, ${country}` : cityName;
  currentTempEl.textContent = `${Math.round(temperature)}°C`;
  currentConditionEl.textContent = `${condition.icon} ${condition.text}`;
  currentWindEl.textContent = `${windspeed} km/h`;
};

/**
 * Dynamically creates and renders forecast cards using DOM manipulation
 */
const displayForecast = (dailyData) => {
  // Clear previous cards
  forecastCardsContainer.innerHTML = '';

  const { time, weathercode, temperature_2m_max, temperature_2m_min } = dailyData;

  // Display up to 5 days of forecast
  const daysToShow = Math.min(time.length, 5);

  for (let i = 0; i < daysToShow; i++) {
    const dayName = formatDayName(time[i], i);
    const condition = getWeatherInterpretation(weathercode[i]);
    const maxTemp = Math.round(temperature_2m_max[i]);
    const minTemp = Math.round(temperature_2m_min[i]);

    // Create card element dynamically
    const card = document.createElement('div');
    card.className = 'forecast-card';

    card.innerHTML = `
      <p class="forecast-date">${dayName}</p>
      <div class="forecast-icon" aria-label="${condition.text}">${condition.icon}</div>
      <p class="forecast-condition">${condition.text}</p>
      <p class="forecast-temp">${maxTemp}° / ${minTemp}°C</p>
    `;

    forecastCardsContainer.appendChild(card);
  }
};


const handleSearch = async (city) => {
  const trimmedCity = city.trim();

 
  if (!trimmedCity) {
    showError('Please enter a city name to search.');
    return;
  }

  // Check network connectivity
  if (!navigator.onLine) {
    showError('No internet connection. Please check your network and try again.');
    return;
  }

  try {
    showLoading();
    clearError();

   
    const { name, country, latitude, longitude } = await fetchCoordinates(trimmedCity);

   
    const weatherData = await fetchWeatherData(latitude, longitude);

   
    displayCurrentWeather(name, country, weatherData.current_weather);
    displayForecast(weatherData.daily);

    
    hideLoading();
    weatherDisplay.classList.remove('hidden');

  } catch (error) {
    showError(error.message || 'An unexpected error occurred while fetching weather data.');
  }
};


searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSearch(cityInput.value);
});
