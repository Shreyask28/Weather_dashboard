const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");

// Status indicators
const loadingSpinner = document.getElementById("loading-spinner");
const errorMessage = document.getElementById("error-message");

// Weather display & Current weather elements
const weatherDisplay = document.getElementById("weather-display");
const currentCity = document.getElementById("current-city");
const currentTemp = document.getElementById("current-temp");
const currentCondition = document.getElementById("current-condition");
const currentWind = document.getElementById("current-wind");

// Forecast cards container
const forecastCards = document.getElementById("forecast-cards"); 

// State 1: Data is being fetched
function showLoading() {
  loadingSpinner.classList.remove('hidden');
  errorMessage.classList.add('hidden');
  weatherDisplay.classList.add('hidden');
}
// State 2: Something went wrong
function showError(message) {
  loadingSpinner.classList.add('hidden');
  weatherDisplay.classList.add('hidden');
  
  // Update the text in our error container
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}
// State 3: Everything succeeded
function showWeather() {
  loadingSpinner.classList.add('hidden');
  errorMessage.classList.add('hidden');
  weatherDisplay.classList.remove('hidden');
}


//serach form event listener



async function getCityCoordinates(cityName) {
  if(!navigator.onLine){
    throw new Error("you are offline. Please check your internet connection.");
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch city coordinates.");
  }

  const data = await response.json();
  
  if (!data.results || data.results.length === 0) {
    throw new Error("City not found.");
  }
  return data.results[0]; // Return the first result


}






const weatherDescriptions = {
  0: { text: "Clear Sky", icon: "☀️" },
  1: { text: "Mainly Clear", icon: "🌤️" },
  2: { text: "Partly Cloudy", icon: "⛅" },
  3: { text: "Overcast", icon: "☁️" },
  45: { text: "Fog", icon: "🌫️" },
  48: { text: "Depositing Rime Fog", icon: "🌫️" },
  51: { text: "Light Drizzle", icon: "🌦️" },
  61: { text: "Slight Rain", icon: "🌧️" },
  63: { text: "Moderate Rain", icon: "🌧️" },
  65: { text: "Heavy Rain", icon: "🌧️" },
  71: { text: "Slight Snow", icon: "🌨️" },
  75: { text: "Heavy Snow", icon: "❄️" },
  95: { text: "Thunderstorm", icon: "⛈️" }
};






// Helper function to safely look up any code
function getWeatherInfo(code) {
  return weatherDescriptions[code] || { text: "Variable", icon: "🌡️" };
}


// the latitude and longitude data will go to openmateo api to get the weather data for that city.


async function getWeatherData(latitude, longitude){


  if(!navigator.onLine) {
    throw new Error("You are offline. Please check your internet connection.");
  }



  const url =`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;

  const response = await fetch(url);

  if(!response.ok){
    throw new Error("Failed to fetch weather data.");

  }

  const data = await response.json();
  return data;

}




  searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const cityName = cityInput.value.trim();
  if (!cityName) {
    showError("Please enter a city name.");
    return;
  }

  showLoading();

  try {
    // 1. Get coordinates
    const cityData = await getCityCoordinates(cityName);

    // 2. Get weather data using those coordinates!
    const weatherData = await getWeatherData(cityData.latitude, cityData.longitude);

    
    // Update the UI with the retrieved data
    displayCurrentWeather(cityData, weatherData.current_weather);
    displayForecast(weatherData.daily);


    showWeather();

  } catch (error) {
    console.error(error);
    showError(error.message);
  }
});


// Function: Update the Current Weather Card on the screen
function displayCurrentWeather(cityData, currentWeather) {
  const { temperature, windspeed, weathercode } = currentWeather;
  const info = getWeatherInfo(weathercode);

  // Set city name & country
  currentCity.textContent = `${cityData.name}, ${cityData.country || ''}`;

  // Round temperature to integer degrees
  currentTemp.textContent = `${Math.round(temperature)}°C`;

  // Display condition emoji and text
  currentCondition.textContent = `${info.icon} ${info.text}`;

  // Set wind speed
  currentWind.textContent = `${windspeed} km/h`;
}

// Function: Dynamically create forecast cards for the next 5 days
function displayForecast(daily) {
  // 1. Wipe out any cards from previous searches
  forecastCards.innerHTML = '';

  // 2. Loop through the next 5 days (indexes 1 to 5)
  for (let i = 1; i <= 5; i++) {
    const dateStr = daily.time[i];
    const maxTemp = Math.round(daily.temperature_2m_max[i]);
    const minTemp = Math.round(daily.temperature_2m_min[i]);
    const info = getWeatherInfo(daily.weathercode[i]);

    // Format readable date (e.g., "Wed, Nov 4")
    const dateObj = new Date(dateStr);
    const dayName = dateObj.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    // 3. Create the card container element dynamically
    const card = document.createElement('div');
    card.classList.add('forecast-card');

    // 4. Populate with HTML matching weather.css classes
    card.innerHTML = `
      <div class="forecast-date">${dayName}</div>
      <div class="forecast-icon">${info.icon}</div>
      <div class="forecast-condition">${info.text}</div>
      <div class="forecast-temp">${maxTemp}° / ${minTemp}°C</div>
    `;

    // 5. Append the card to the forecast container
    forecastCards.appendChild(card);
  }
}
