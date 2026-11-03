# 🌤️ Weather Dashboard

A clean, responsive, and modern weather dashboard web application built from scratch using **Vanilla JavaScript (ES6+)**, **HTML5**, and **CSS3**. The app fetches real-time weather conditions and a 5-day forecast for any city worldwide using the free **Open-Meteo API** (no API keys required).

---

## 🚀 Live Demo & Links

- **Live Deployment:** [View Live App (Vercel / Netlify)](https://your-deployment-link.vercel.app) *(Replace with your deployed link)*
- **GitHub Repository:** [GitHub Repo](https://github.com/your-username/weather-dashboard) *(Replace with your GitHub repo URL)*

---

## ✨ Features

- **Search by City:** Instant weather search by city name (e.g., London, Tokyo, Mumbai, New York) with support for both the **Search button** and the **Enter key**.
- **Current Weather Conditions:**
  - Current temperature in °C (rounded for clean display)
  - Weather condition description with matching emoji icons (mapped from WMO weather codes)
  - Wind speed in km/h
- **5-Day Dynamic Forecast:**
  - Forecast cards generated on the fly via JavaScript DOM manipulation (`document.createElement`).
  - Displays formatted dates (e.g., "Wed, Nov 4"), weather icons, conditions, and daily max/min temperatures.
- **Robust Error Handling:**
  - **Empty Input:** Prompts the user to enter a city name.
  - **City Not Found:** Displays a friendly error message if the geocoding service cannot locate the city.
  - **Offline Detection:** Checks `navigator.onLine` and alerts the user if their device loses internet connectivity.
  - **Server / HTTP Errors:** Validates `response.ok` and handles network or server failures gracefully.
- **Loading State:** Shows an interactive loading spinner while data is being fetched across the network.
- **Fully Responsive Layout:**
  - **Desktop / Laptop:** Forecast cards displayed side-by-side in a horizontal row.
  - **Mobile:** Clean vertical card layout optimized for handheld screens.
- **Zero API Keys:** Communicates directly with free public endpoints without exposing sensitive credentials in client-side code.

---

## 🛠️ Concepts & Technologies Practiced

- **Asynchronous JavaScript:**
  - Modern `async / await` syntax for handling asynchronous operations.
  - Working with JavaScript `Promises`.
  - The `fetch()` API for making HTTP `GET` requests.
  - Inspecting HTTP response status codes and handling errors with `try / catch`.
- **DOM Manipulation:**
  - Selecting and caching elements with `document.getElementById`.
  - Managing UI states (Loading, Error, Results) by toggling the `.hidden` class using `classList.add()` and `classList.remove()`.
  - Dynamically creating elements with `document.createElement()` and `appendChild()`.
  - Clearing and repopulating dynamic content with `innerHTML = ''`.
- **Modern JavaScript (ES6+):**
  - Template literals (`${...}`)
  - Arrow functions (`() => {}`)
  - Object destructuring (`const { temperature, windspeed } = currentWeather;`)
  - Modern Date formatting with `toLocaleDateString()`.
- **CSS3 & Responsive Design:**
  - CSS custom properties (variables) for consistent theming and glassmorphic styling.
  - Flexbox layouts for dynamic card alignment.
  - Media queries (`@media (max-width: 640px)`) for smooth mobile responsiveness.

---

## 🌐 APIs Used

This project utilizes the **Open-Meteo Suite**:

1. **Open-Meteo Geocoding API:**  
   Converts the user's city name string into geographic coordinates (`latitude` and `longitude`).  
   `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json`

2. **Open-Meteo Weather Forecast API:**  
   Fetches current conditions and daily forecasts based on coordinates and aligns with the city's local timezone.  
   `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`

---

## 📂 Project Structure

```text
weather-dashboard/
│
├── weather.html      # Semantic HTML5 layout and container elements
├── weather.css       # Styling, glassmorphic effects, and responsive breakpoints
├── weather.js        # Core logic: API fetching, DOM manipulation, error handling
└── README.md         # Documentation and project overview
```

---

## 💻 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/weather-dashboard.git
   ```
2. **Navigate into the project directory:**
   ```bash
   cd weather-dashboard
   ```
3. **Open the project:**
   - Double-click `weather.html` to open it in any modern browser.
   - Or, open it with VS Code's **Live Server** extension.

---

## 📝 License

This project is created as part of the Web Technology coursework for educational purposes.




## 👨‍💻 Author & Contact

**Shreyas Vitthal Kumbhar**

If you have any questions, feedback, or want to collaborate on AI projects, feel free to reach out!

*   **GitHub:** [@Shreyask28](https://github.com/Shreyask28)
*   **LinkedIn:** [linkedin.com/in/shreyas-kumbhar-63715237a/](https://www.linkedin.com/in/shreyas-kumbhar-63715237a/)
*   **Email:** [kumbharshreyas7777@gmail.com](kumbharshreyas7777@gmail.com)

---
⭐ *If you find these tutorials helpful, please consider giving this repository a star!* ⭐
