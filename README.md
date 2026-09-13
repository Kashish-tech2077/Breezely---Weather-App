# Breezely — Weather App

Breezely is a framework-free weather web application built with HTML, CSS, and JavaScript. It combines current weather conditions, forecasts, air-quality information, location search, saved locations, recent searches, configurable units, and weather-aware theming in a responsive browser-based interface.

## Preview

![Breezely Preview](https://github.com/user-attachments/assets/33eb7c69-1563-44eb-9a54-53e411692802) 

# Breezely — Weather App

## Project Status

| | |
|---|---|
| **Current version** | `v1.0.0` |
| **Status** | Live |
| **Live website** | [www.breezely.in](https://www.breezely.in) |
| **Repository** | [Kashish-tech2077/Breezely---Weather-App](https://github.com/Kashish-tech2077/Breezely---Weather-App) |

> v1.0.0 is the current declared project version. The application is currently deployed and accessible from the live website above.

## Live Demo

**Live Website:** [https://www.breezely.in](https://www.breezely.in)

**GitHub Repository:** [https://github.com/Kashish-tech2077/Breezely---Weather-App](https://github.com/Kashish-tech2077/Breezely---Weather-App)

Open Breezely in a browser to use the live application.

## Project Overview

Breezely is a client-side weather application designed to make detailed weather information easy to scan while still providing useful controls for repeated use.

The application lets users:

- Search for cities and select a location from geocoding results.
- View current weather conditions and detailed metrics.
- View an hourly forecast for the next 24 hours.
- View a 7-day forecast.
- View current air-quality measurements and AQI classifications.
- Use the browser's current location when available.
- Fall back to an approximate IP-based location when browser geolocation is unavailable.
- Save and remove locations for quick access.
- Review and clear recent searches.
- Configure temperature, wind-speed, pressure, and time formats.
- Choose automatic, light, or dark theme behavior.
- Receive weather-specific visual themes and day/night weather icons.

The project does not use a frontend framework or a package/build system. The interface is implemented directly with HTML, CSS, and browser JavaScript, with application state maintained in JavaScript and persisted locally where appropriate.

## Features

### Weather Information

The current-weather section displays:

- Current temperature.
- Feels-like temperature.
- Current weather condition.
- Daily high and low temperatures.
- Humidity.
- Wind speed and compass direction.
- Chance of precipitation.
- UV index and a UV category label.
- Atmospheric pressure.
- Visibility.
- Sunrise and sunset times.
- A visual sunrise-to-sunset arc with the current sun position.
- A manual **Refresh** action for fetching the latest data.

### Hourly Forecast

- Displays the current hour as **Now** followed by upcoming hourly entries.
- Covers the next 24 hours from the current forecast position.
- Shows temperature, weather icon, and precipitation probability.
- Uses horizontal scrolling so the wide forecast table remains usable on smaller screens.

### 7-Day Forecast

- Displays a seven-day weather outlook.
- Shows weekday/date, weather condition, high and low temperatures, precipitation probability, and maximum wind speed for each day.
- Uses weather-specific icons based on the returned weather code.

### Location Search

Location search uses the Open-Meteo Geocoding API.

Search behavior includes:

- Returns up to five geocoding results.
- Displays city, administrative area, country, and country flag information when available.
- Requires at least three characters before a search request is made.
- Accepts letters, numbers, spaces, and hyphens; special characters are rejected.
- Debounces valid input before making the request.
- Provides user-facing states such as **Searching...**, invalid-input messages, and no-result messages.
- Uses request tokens to prevent stale asynchronous search responses from overwriting newer results.
- Provides the same search capability through the desktop header, mobile navigation UI, and Manage Locations interface.
- Allows a search result to be selected as the active location or saved directly.

### Current Location

Breezely requests the browser's Geolocation API with high accuracy enabled.

If browser geolocation is unavailable or permission cannot be used, the application falls back to an IP-based location lookup. The fallback is explicitly presented as an **approximate location** rather than as a precise GPS location.

### Saved Locations

Saved locations are managed through the **Manage Locations** interface.

- Locations can be saved from search results or from the active location.
- Saved locations show their latest fetched temperature, weather icon, city, and country.
- Locations can be opened to make them the active weather location.
- Individual saved locations can be deleted with a confirmation dialog.
- All saved locations can be cleared with a confirmation dialog.
- Duplicate locations are detected using coordinates and, where applicable, city/country identity.
- Saved locations are persisted in `localStorage`.

### Recent Searches

- Recently selected locations are recorded locally.
- The list is capped at **five locations**.
- Re-selecting an existing recent location updates its weather snapshot instead of creating a duplicate entry.
- Recent locations display their country flag, city/country, temperature, and weather icon.
- Recent searches persist between page loads.
- All recent searches can be cleared through a confirmation dialog.

### Settings

Breezely provides the following configurable settings:

| Setting | Options |
|---|---|
| **Time format** | 12-hour / 24-hour |
| **Temperature** | °C / °F |
| **Wind speed** | km/h / mph |
| **Pressure** | hPa / mmHg |
| **Theme** | Auto / Light / Dark |

Settings are persisted in `localStorage` and restored when the application starts.

### Themes

Breezely has two related theme layers:

1. **Color mode** — automatic, light, or dark.
2. **Weather theme** — visual styling derived from the current weather category.

The weather categories represented in the CSS/theme system are:

- Sunny
- Cloudy
- Atmosphere
- Rain
- Snow
- Thunder

In **Auto** mode, the application selects light or dark color mode according to whether the current weather time is within the returned sunrise/sunset interval. Weather icons also distinguish between day and night for weather conditions that have separate variants.

### Air Quality

The Air Quality section displays the current US AQI and pollutant measurements returned by the Open-Meteo Air Quality API.

Displayed pollutants include:

- PM10
- PM2.5
- Carbon monoxide (CO)
- Nitrogen dioxide (NO₂)
- Sulphur dioxide (SO₂)
- Ozone (O₃)

The application classifies AQI and pollutant readings into categories including **Good**, **Moderate**, **Unhealthy for sensitive groups**, **Unhealthy**, **Very unhealthy**, and **Hazardous**. The UI includes a category guide based on US EPA-style AQI ranges.

The AQI presentation changes at smaller viewport sizes: the desktop/table presentation is replaced by a mobile-friendly card layout on tablet and mobile widths.

### Responsive Design

The interface has dedicated responsive CSS for large desktop, desktop/laptop, tablet, and mobile layouts.

Notable responsive behavior includes:

- Desktop navigation is replaced by a hamburger-driven mobile navigation panel below the tablet breakpoint.
- The current-weather layout changes from a two-column layout to a stacked layout on smaller desktop widths.
- AQI tables are replaced with mobile cards at widths of 900px and below.
- Forecast tables remain horizontally scrollable on narrow screens.
- Seven-day forecast cards remain horizontally scrollable rather than forcing all cards into a narrow column.
- Settings and Manage Locations interfaces adapt their layouts for tablet and mobile screens.
- The footer changes from a multi-column layout to a vertically stacked layout on smaller screens.

The repository defines explicit responsive breakpoints at `2000px`, `1600px`, `1300px`, `900px`, and `500px`.

### Loading and Error Handling

Breezely includes several user-facing resilience mechanisms:

- Full-page loading state during application initialization.
- Weather-section loading overlay during location changes.
- Disabled/loading state for the Refresh action while data is being updated.
- Search-specific loading and validation messages.
- Offline detection with a user-facing message.
- Handling for HTTP `429` responses with a rate-limit message.
- Handling for HTTP `5xx` responses with a temporary-service-unavailable message.
- Generic fallback messaging for other failures.
- Corrupted persisted state is detected during JSON parsing; the stored Breezely state is reset instead of being used as invalid application state.
- Search and location request tokens protect the UI from stale asynchronous responses.

The offline behavior is limited to error/status handling in v1.0. The application does **not** currently provide a full offline weather experience backed by a service worker/cache.

## Tech Stack

### Frontend

- **HTML5** — page structure and semantic content.
- **CSS3** — layout, responsive design, design tokens, component styling, and themes.
- **Vanilla JavaScript** — application state, API requests, DOM updates, event handling, persistence, and UI behavior.

No React, Vue, Angular, Tailwind, Bootstrap, TypeScript, or other frontend framework is used in the repository.

### CSS Organization

The styling is intentionally split across focused files:

- `root.css` — design tokens and global CSS variables.
- `base.css` — font import, resets, base styles, and shared utility styling.
- `components.css` — application component/layout styling.
- `theme.css` — light/dark and weather-specific theme variables and overrides.
- `responsive.css` — viewport-specific responsive behavior.

### Browser APIs

The application uses browser capabilities including:

- **Geolocation API** — current-location detection.
- **localStorage** — persistence of selected location, saved locations, recent searches, and settings.
- **DOM APIs** — rendering and interaction with the application interface.
- **Intl.DateTimeFormat** — localized time/date formatting.

### Fonts and Icons

- **Ubuntu** is loaded from Google Fonts.
- **Font Awesome** is loaded through a Font Awesome Kit for interface icons.
- Breezely also contains its own local SVG icon assets for weather and interface graphics.
- Country flags are loaded from FlagsAPI.

## APIs & External Services

Breezely is a browser-based client application and makes its external API requests directly from JavaScript.

| Service | Purpose | API key in current code | Main data used |
|---|---|---|---|
| **Open-Meteo Weather Forecast API** | Current conditions and forecasts | No key is present in the implementation | Current weather, hourly forecast, daily forecast, sunrise/sunset, UV, precipitation probability, visibility, wind, pressure, humidity |
| **Open-Meteo Air Quality API** | Air-quality data | No key is present in the implementation | US AQI, PM10, PM2.5, CO, NO₂, SO₂, O₃ |
| **Open-Meteo Geocoding API** | City search | No key is present in the implementation | City, administrative area, country, coordinates, country code |
| **BigDataCloud Reverse Geocoding API** | Converts browser GPS coordinates into a readable location | No key is present in the implementation | City and country name |
| **freeipapi** | Approximate location fallback when browser geolocation is unavailable | No key is present in the implementation | Approximate latitude, longitude, city, and country |
| **FlagsAPI** | Country flag images | No key is present in the implementation | Country flag image for search/recent-search locations |

The repository does not contain a backend API layer. Requests are made from the browser, and no API credentials are stored in the repository.

## Application Architecture

Breezely uses a small, explicit JavaScript architecture rather than a framework or state-management library.

### Main Files

| File | Responsibility |
|---|---|
| `index.html` | Complete page structure, weather/forecast/AQI markup, settings UI, Manage Locations UI, confirmation dialogs, footer, and script/style loading. |
| `root.css` | Global design tokens, typography values, spacing, colors, borders, radii, shadows, and transitions. |
| `base.css` | CSS reset, global styles, shared layout utilities, loading UI, and common styling. |
| `components.css` | Component-level layout and styling for the header, weather sections, forecasts, AQI, recent searches, footer, settings, locations, and popups. |
| `theme.css` | Theme variables and weather/color-mode combinations for sunny, cloudy, rain, snow, atmosphere, and thunder states. |
| `responsive.css` | Responsive rules for large desktop through mobile layouts. |
| `variables.js` | Global application state, DOM element references, weather configuration, and related constants. |
| `foundation.js` | Core UI interactions such as opening/closing panels, mobile navigation, confirmation dialogs, scroll-to-top behavior, and Escape-key handling. |
| `core.js` | Application initialization, API calls, search, weather/AQI rendering, location management, persistence, settings, recent searches, and refresh behavior. |
| `Assets/` | Local Breezely logo and SVG interface/weather icons. |

### Architecture Overview

```text
index.html
│
├── CSS
│   ├── root.css
│   ├── base.css
│   ├── components.css
│   ├── theme.css
│   └── responsive.css
│
├── JavaScript
│   ├── variables.js
│   ├── foundation.js
│   └── core.js
│
└── Assets
    ├── Images
    └── Icons
        ├── generic icons
        └── weather icons
```

## Data Flow

The primary location-to-weather flow is:

```text
User searches for a city
        │
        ▼
Open-Meteo Geocoding API
        │
        ▼
Latitude / Longitude
        │
        ├───────────────┐
        ▼               ▼
Weather Forecast API   Air Quality API
        │               │
        └───────┬───────┘
                ▼
        JavaScript application state
                │
                ▼
          DOM/UI rendering
                │
                ▼
        localStorage persistence
        where applicable
```

For current-location initialization, the flow is:

```text
Browser Geolocation API
        │
        ├── Success ──► coordinates
        │                    │
        │                    ▼
        │             Weather + AQI data
        │
        └── Unavailable/denied
                 │
                 ▼
          IP-based location API
                 │
                 ▼
             coordinates
                 │
                 ▼
          Weather + AQI data
```

## State & Persistence

The application maintains its state through JavaScript variables rather than an external state-management library.

Important state includes:

- `selectedCity` — the currently selected weather location.
- `currentLocation` — the browser/IP-derived current location information.
- `currentWeatherData` — the active weather response used for UI updates.
- `savedLocations` — locations saved by the user.
- `recentSearchLocations` — recent selected locations, limited to five.
- `themeMode` — `auto`, `light`, or `dark`.
- Time, temperature, wind-speed, and pressure format settings.
- Request tokens used to prevent stale asynchronous responses.

### localStorage

Breezely stores its combined application state under the key:

```text
breezelyState
```

Persisted information includes selected/current location information, saved locations, recent searches, and user settings. Weather snapshots associated with saved/recent locations are refreshed from the weather API when appropriate rather than being treated as permanent weather data.

The application validates the persisted theme mode before applying it and handles malformed JSON by clearing the corrupted `breezelyState` entry.

## Accessibility

Accessibility-related implementation currently includes:

- Semantic `header`, `main`, `footer`, table, heading, button, label, input, and form-control elements where appropriate.
- Alternative text on the majority of image-based interface and weather icons.
- `aria-label` on search clear buttons.
- `role="status"` and `aria-live="polite"` for the full-page loading state.
- `role="status"` and `aria-live="polite"` for the weather loading overlay.
- Dynamically created application status messages use `role="status"` and `aria-live="polite"`.
- `aria-busy` is applied to the document body during application loading and to the main weather section during weather loading.
- Radio inputs are associated with visible labels.
- The Escape key can close settings, location panels, and confirmation dialogs.
- Visible focus styling is provided for the search control through `:focus-within`.

Accessibility is not presented as complete or exhaustive in v1.0; there is still room to improve keyboard interaction semantics and other accessibility details in future iterations.

## Error Handling & Resilience

The application explicitly handles several common failure conditions:

- Network/offline state.
- HTTP rate limiting (`429`).
- Server-side API failures (`5xx`).
- Failed weather, AQI, geocoding, reverse-geocoding, and fallback-location requests.
- Unavailable browser geolocation.
- Corrupted local persisted state.
- Stale search and location requests caused by asynchronous responses arriving out of order.
- Loading states during initial startup, location changes, and manual refreshes.

Breezely does not currently implement service-worker-backed offline caching, so a user without network access cannot retrieve fresh weather data from an offline cache in v1.0.

## Run Locally

Breezely is a static frontend with no package manager, dependency installation step, or build command defined in the repository.

### 1. Clone the repository

```bash
git clone https://github.com/Kashish-tech2077/Breezely---Weather-App.git
cd Breezely---Weather-App
```

### 2. Serve the repository with a local static HTTP server

Serve the repository root using any local static development server.

A local HTTP server is recommended instead of opening `index.html` directly because the application uses browser APIs and external requests that are better tested from an HTTP origin.

### 3. Open the local application

Open the local server address in a browser and allow location permission if you want Breezely to use the browser's Geolocation API.

There is no `package.json` or project-specific npm build/start command in the repository.

## Deployment

The current live deployment is:

**[https://www.breezely.in](https://www.breezely.in)**

The GitHub repository is connected to Netlify for Git-based automatic deployment. Changes pushed to the `main` branch are deployed through the connected Netlify project.

```text
GitHub repository
       │
       ▼
     Netlify
       │
       ▼
Automatic deployment
       │
       ▼
www.breezely.in
```

The project is a static frontend, so no build command or backend runtime is required for deployment.

## Project Structure

```text
Breezely---Weather-App/
│
├── Assets/
│   ├── Icons/
│   │   ├── generic icons/
│   │   └── weather icons/
│   └── Images/
│       └── Breezely logo.png
│
├── index.html
├── root.css
├── base.css
├── components.css
├── theme.css
├── responsive.css
├── variables.js
├── foundation.js
├── core.js
└── README.md
```

## Version 1.0 Scope

### v1.0.0 — Current

- [x] Current weather information and detailed metrics.
- [x] Hourly forecast.
- [x] 7-day forecast.
- [x] Air-quality data and AQI classification.
- [x] City search with validation, debouncing, and stale-request protection.
- [x] Browser geolocation with approximate IP-based fallback.
- [x] Saved locations and Manage Locations UI.
- [x] Recent search history with a five-location limit.
- [x] Persistent settings and location/search state through localStorage.
- [x] Temperature, wind-speed, pressure, and time-format settings.
- [x] Auto, light, and dark modes.
- [x] Weather-specific themes and day/night weather icons.
- [x] Responsive desktop, tablet, and mobile layouts.
- [x] Loading, validation, and API error states.

## Roadmap

The following items are planned future work and are **not implemented in v1.0.0**.

### v2.0 — Planned

- [ ] Client-side caching.
- [ ] Service Worker integration.
- [ ] PWA functionality.
- [ ] Offline cache/offline experience.
- [ ] Continuous sun movement rather than updating the sun position only when weather state is rendered.
- [ ] Continuous automatic theme scheduling.
- [ ] Stronger persisted-state/schema validation.

The roadmap above describes planned improvements; it should not be interpreted as functionality currently available in the live v1.0 application.

## Known Limitations / Future Improvements

### Known limitations

- Weather data and location services depend on external network APIs.
- IP-based location is approximate and is used only as a fallback when browser geolocation is unavailable.
- v1.0 does not provide a true offline weather experience.
- The application currently focuses on English-language location search and display.
- The repository does not currently contain a formal automated test suite or build pipeline.

### Planned improvements

- Introduce service-worker-backed caching and offline support.
- Improve persistence validation beyond the current default/fallback checks.
- Make sun movement continuously update as time passes.
- Make automatic theme scheduling continuously track the current day/night state.
- Continue improving accessibility and semantic interaction behavior.

These items are improvements beyond the current v1.0 scope, not claims about existing defects.

## Security & Privacy Notes

- No API keys, passwords, tokens, or credentials are stored in the repository.
- API requests are made directly from the browser to the external services listed above.
- Browser geolocation requires the user's permission. If it is unavailable, Breezely can use an approximate IP-based location fallback.
- User-managed state such as saved locations, recent searches, and settings is stored locally in the browser through `localStorage`.
- No backend or user-account system is included in the current repository.

## License

No `LICENSE` file is currently included in this repository.

## Credits & Attributions

### Data services

- **Open-Meteo** — weather forecast, air-quality, and geocoding data.
- **BigDataCloud** — reverse geocoding for readable names from coordinates.
- **freeipapi** — approximate IP-based location fallback.
- **FlagsAPI** — country flag images.

### UI resources

- **Font Awesome** — interface icon library loaded through the project's Font Awesome Kit.
- **Google Fonts** — Ubuntu typeface.
- Breezely's weather and generic SVG icons are included locally under `Assets/Icons/`.

## Development Notes

Breezely intentionally keeps its implementation framework-free. The code separates global state and configuration, foundational UI interactions, and application/data logic into different JavaScript files while keeping the CSS divided into tokens, base styles, components, themes, and responsive rules.

This structure is intended to keep the v1.0 codebase understandable without introducing a framework or build-tool abstraction that the project does not currently need.
