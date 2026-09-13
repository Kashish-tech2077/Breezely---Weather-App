// Global variables

let debounceTimer;
// search result box variables
let searchResultBox = document.querySelector('.site_header__search-result-box');
let searchResultBoxMobile = document.querySelector('.site_header__search-result-box--mobile');
let searchResultBoxLocation = document.querySelector('.site_header__search-result-box--location');

// current data variables
let currentSearchData;
let currentLocation;
let currentWeatherData;

// request tokens variables
let searchRequestToken = 0;
let locationRequestToken = 0;

// theme variables
let themeMode = "auto";

// sunrise and sunset time for day/night icon logic
let currentTime;
let sunriseTime;
let sunsetTime;

// selected city
let selectedCity = [];

// saved locations variables
let savedLocations = [];

// location variables
let locationToDeleteId = null;
let locationToDeleteLatitude;
let locationToDeleteLongitude;
let locationToDeleteName;
let locationToDeleteCountry;

// recent searches variables
let recentSearchLocations = [];
let RECENT_SEARCH_MAX_LENGTH = 5;

// UIElements object which contains all essential DOM elements

const UIElements = {

    // site header elements
    site_header_cities: document.querySelectorAll('.site_header__search-result-city:not(.site_header__search-result-city--mobile, .site_header__search-result-city--location)'),
    site_header_cities_mobile: document.querySelectorAll('.site_header__search-result-city--mobile'),
    site_header_cities_location: document.querySelectorAll('.site_header__search-result-city--location'),

    site_header_states: document.querySelectorAll('.site_header__search-result-state:not(.site_header__search-result-state--mobile, .site_header__search-result-state--location)'),
    site_header_states_mobile: document.querySelectorAll('.site_header__search-result-state--mobile'),
    site_header_states_location: document.querySelectorAll('.site_header__search-result-state--location'),

    site_header_countries: document.querySelectorAll('.site_header__search-result-country:not(.site_header__search-result-country--mobile, .site_header__search-result-country--location)'),
    site_header_countries_mobile: document.querySelectorAll('.site_header__search-result-country--mobile'),
    site_header_countries_location: document.querySelectorAll('.site_header__search-result-country--location'),

    site_header_flag: document.querySelectorAll('.site_header__search-result-flag-value:not(.site_header__search-result-flag-value--mobile)'),
    site_header_flag_mobile: document.querySelectorAll('.site_header__search-result-flag-value--mobile'),
    site_header_flag_location: document.querySelectorAll('.site_header__search-result-flag-value--location'),

    mobileSiteHeader: document.querySelector('.mobile-site-header'),
    mobileSiteHeaderSetttings: document.querySelector('.mobile-site-header__action--settings'),
    mobileSiteHeaderlocation: document.querySelector('.mobile-site-header__action--locations'),


    // site header search elements
    searchBar: document.querySelectorAll('.site-header__search-bar'),
    searchResultBox: document.querySelector('.site_header__search-result-box'),
    searchResultBoxMobile: document.querySelector('.site_header__search-result-box--mobile'),
    searchResultBoxLocation: document.querySelector('.site_header__search-result-box--location'),
    searchResultRow: document.querySelectorAll('.site_header__search-result-row:not(.site_header__search-result-row--mobile, .site_header__search-result-row--location)'),
    searchResultRowMobile: document.querySelectorAll('.site_header__search-result-row--mobile'),
    searchResultRowLocation: document.querySelectorAll('.site_header__search-result-row--location'),


    // current weather (hero-section) elements
    heroSection: document.querySelector('.current-weather'),
    appLoading: document.querySelector('.app-loading'),
    weatherLoading: document.querySelector('.weather-loading-overlay'),
    temp: document.querySelector('.current-weather__temperature-value'),
    weather_type: document.querySelector('.current-weather__condition-type'),
    heroWeatherIcon: document.querySelector('.current-weather__weather-icon'),
    temp__high: document.querySelector('.high_temp'),
    temp__low: document.querySelector('.low_temp'),
    temp__feel: document.querySelector('.current-weather__feel-temp'),
    location_city: document.querySelector('.current-weather__location-city'),
    location_country: document.querySelector('.current-weather__location-country'),
    updated_time: document.querySelector('.current-weather__update-time-value'),
    humidity_value: document.querySelector('.humidity_value'),
    wind_speed: document.querySelector('.wind_speed'),
    wind_direction: document.querySelector('.wind_direction'),
    rain_chance: document.querySelector('.rain_chance'),
    uv_index: document.querySelector('.uv_index'),
    uv_index_status: document.querySelector('.uv_index_status'),
    pressure_value: document.querySelector('.pressure_value'),
    visibility_value: document.querySelector('.visibility_value'),
    sunrise_time: document.querySelector('.sunrise_time'),
    sunset_time: document.querySelector('.sunset_time'),
    currentSunIcon: document.querySelector('.current-weather__sun-icon'),
    sunPath: document.getElementById('sunPath'),


    // hourly forecast elements
    hourly_forecast_time: document.querySelectorAll('.hourly-forecast__time'),
    hourly_forecast_temp: document.querySelectorAll('.hourly-forecast__temp-value'),
    hourly_forecast_rain: document.querySelectorAll('.hourly-forecast__rain-chance-value'),


    // days forecast elements
    dayForecastDay: document.querySelectorAll('.days-forecast__day'),
    dayForecastDate: document.querySelectorAll('.days-forecast__date'),
    dayForecastStatus: document.querySelectorAll('.days-forecast__status'),
    dayForecastTempHigh: document.querySelectorAll('.days-forecast__temp-val--high'),
    dayForecastTempLow: document.querySelectorAll('.days-forecast__temp-val--low'),
    dayForecastRain: document.querySelectorAll('.days-forecast__stat-rain'),
    dayForecastWindSpeed: document.querySelectorAll('.days-forecast__stat-wind'),


    // aqi forecast elements
    aqi_overall_value: document.querySelector('.aqi-forecast__aqi-value'),
    aqi_overall_mobile: document.querySelector('.aqi-forecast__overall-aqi-value--mobile'),

    aqi_PM10_value: document.querySelector('.aqi-forecast__pm10-value'),
    aqi_PM10_value_mobile: document.querySelector('.aqi-forecast__pm10-value--mobile'),

    aqi_PM25_value: document.querySelector('.aqi-forecast__pm25-value'),
    aqi_PM25_value_mobile: document.querySelector('.aqi-forecast__pm25-value--mobile'),

    aqi_CO_VALUE: document.querySelector('.aqi-forecast__CO-value'),
    aqi_CO_VALUE_mobile: document.querySelector('.aqi-forecast__CO-value--mobile'),

    aqi_NO_value: document.querySelector('.aqi-forecast__NO-value'),
    aqi_NO_value_mobile: document.querySelector('.aqi-forecast__NO-value--mobile'),

    aqi_SO_value: document.querySelector('.aqi-forecast__SO-value'),
    aqi_SO_value_mobile: document.querySelector('.aqi-forecast__SO-value--mobile'),

    aqi_OZ_value: document.querySelector('.aqi-forecast__OZ-value'),
    aqi_OZ_value_mobile: document.querySelector('.aqi-forecast__OZ-value--mobile'),

    aqi_overall_aqi_value: document.querySelector('.aqi-forecast__overall-aqi-value'),
    aqi_overall_status: document.querySelector('.aqi-forecast__overall-status'),
    aqi_overall_status_mobile: document.querySelector('.aqi-forecast__mobile-aqi-status'),
    aqi_overall_status_second: document.querySelector('.aqi-forecast__status-overall'),

    aqi_PM10_status: document.querySelector('.aqi-forecast__status-PM10'),
    aqi_PM10_status_mobile: document.querySelector('.aqi-forecast__status-PM10--mobile'),

    aqi_PM25_status: document.querySelector('.aqi-forecast__status-PM25'),
    aqi_PM25_status_mobile: document.querySelector('.aqi-forecast__status-PM25--mobile'),

    aqi_CO_status: document.querySelector('.aqi-forecast__status-CO'),
    aqi_CO_status_mobile: document.querySelector('.aqi-forecast__status-CO--mobile'),

    aqi_NO_status: document.querySelector('.aqi-forecast__status-NO'),
    aqi_NO_status_mobile: document.querySelector('.aqi-forecast__status-NO--mobile'),

    aqi_SO_status: document.querySelector('.aqi-forecast__status-SO'),
    aqi_SO_status_mobile: document.querySelector('.aqi-forecast__status-SO--mobile'),

    aqi_OZ_status: document.querySelector('.aqi-forecast__status-OZ'),
    aqi_OZ_status_mobile: document.querySelector('.aqi-forecast__status-OZ--mobile'),


    // recent search elements
    recentSearchContainer: document.querySelector('.recent-search__container'),
    recentSearchClearnBtn: document.querySelector('.recent-search__clear-btn'),


    // settings container elements
    settingsContainer: document.getElementById('settings'),


    // location container elements
    locationContainer: document.getElementById('location'),
    manageLocationList: document.querySelector('.manage-locations__list'),
    manageLocationBoxes: document.querySelectorAll('.manage-locations__item:not(.manage-locations__item--current)'),
    currentLocationBox: document.querySelectorAll('.manage-locations__item--current'),
    currentLocationCity: document.querySelectorAll('.manage-locations__city--current'),
    currentLocationCountry: document.querySelectorAll('.manage-locations__country--current'),
    currentLocationTempValue: document.querySelectorAll('.manage-locations__temp-value--current'),
    currentLocationWeather: document.querySelectorAll('.manage-locations__weather--current'),


    // confirmation popup elements
    deleteSaveLocationPopup: document.getElementById('delete-save-location-popup'),
    clearallRecentSearchPopup: document.getElementById('clearall-recentsearch-popup'),
    clearallSavedLocationsPopup: document.getElementById('clearall-saved-locations-popup'),

    // background overlay elements
    backgroundOverlay: document.querySelector('.background-overlay'),
    secondBgOverlay: document.querySelector('.background-overlay--second'),
    thirdBgOverlay: document.querySelector('.background-overlay--third'),


    // Buttons and icons elements

    // scroll up btn
    scrollUpBtn: document.getElementById('scroll-top-btn'),

    // feedback button
    feedbackBtn: document.querySelector('.feedback-button'),

    // header icons and buttons
    hamburgerIcon: document.querySelector('.hamburger-icon'),
    mobileSiteHeaderCloseBtn: document.querySelector('.mobile-site-header__action--closeicon'),
    clearSearchBtn: document.querySelectorAll('.search-text-clear-btn'),
    settingsBtn: document.querySelector('.site-header__btn--settings'),
    myLocationBtn: document.querySelector('.site-header__btn--location'),

    desktopSaveLocationBtns: searchResultBox.querySelectorAll('.site-header__save-icon'),
    mobileSaveLocationBtns: searchResultBoxMobile.querySelectorAll('.site-header__save-icon'),
    locationSaveLocationBtn: searchResultBoxLocation.querySelectorAll('.site-header__save-icon'),

    // hero-section buttons
    savelocationStatusBtn: document.querySelector('.current-weather__save-location-status-btn'),
    dataRefreshBtn: document.querySelector('.current-weather__refresh-data-btn'),

    // recent search icons and buttons
    recentsearchClearBtn: document.querySelector('.recent-search__clear-btn'),
    recentSearchDeleteConfirmationBtn: document.querySelector('.confirmation-popup-recent-search-btn--delete'),

    // settings container icons and buttons
    settingsCloseBtn: document.querySelector('.settings__close-button'),
    settingsCloseIcon: document.querySelector('.generic-icons__close--settings'),
    clock12HourSettingsBtn: document.getElementById('12-hour-radio'),
    clock24HourSettingsBtn: document.getElementById('24-hour-radio'),
    tempCelciusSettingsBtn: document.getElementById('degree-celcius-radio'),
    tempFahSettingsBtn: document.getElementById('degree-fahrenheit-radio'),
    windSpeedKMPHSettingsBtn: document.getElementById('kmph-speed-radio'),
    windSpeedMPHSettingsBtn: document.getElementById('mph-speed-radio'),
    pressureHPASettingsBtn: document.getElementById('hPa-unit-radio'),
    pressureMMHGSettingsBtn: document.getElementById('mmHg-unit-radio'),
    themeAutoSettingsBtn: document.getElementById('auto-theme-radio'),
    themeLightSettingsBtn: document.getElementById('light-theme-radio'),
    themeDarkSettingsBtn: document.getElementById('dark-theme-radio'),
    footerThemeBtn: document.querySelector('.footer__theme-btn'),

    // manage location icons and buttons
    deleteSavedLocationConfirmationBtn: document.querySelector('.confirmation-popup__delete-location-btn'),
    clearallLocationBtn: document.querySelector('.manage-locations__clearall-button'),
    locationCloseIcon: document.querySelector('.generic-icons__close--location'),
    clearAllSavedLocationsBtn: document.querySelector('.manage-locations__clearall-button'),
    clearAllSavedLocationConfirmationBtn: document.querySelector('.confirmation-popup__clearall-location-btn'),

    // popup container icons buttons
    popupCloseIcons: document.querySelectorAll('.generic-icons__close--popup'),
    popupCloseBtns: document.querySelectorAll('.confirmation-popup__button--cancel'),


    // weather icons

    // hourly-forecast weather icons
    hourlyForecastWeatherIcons: document.querySelectorAll('.weather-icons__hourly-forecast'),

    // day-forecast weather icons
    dayForecastWeatherIcons: document.querySelectorAll('.weather-icons__day-forecast'),

    // current location weather icons
    currentLocationWeatherIcon: document.querySelectorAll('.weather-icons__location--current'),
}


// Weather Interpretation code and icons based on weather
const weatherConfig = {
    0: {
        label: "Clear sky",
        icon: {
            day: "clear-day.svg",
            night: "clear-night.svg"
        }
    },

    1: {
        label: "Mainly clear",
        icon: {
            day: "partly-cloudy-day.svg",
            night: "partly-cloudy-night.svg"
        }
    },

    2: {
        label: "Partly cloudy",
        icon: {
            day: "partly-cloudy-day.svg",
            night: "partly-cloudy-night.svg"
        }
    },

    3: {
        label: "Overcast",
        icon: "overcast.svg"
    },

    45: {
        label: "Fog",
        icon: {
            day: "fog-day.svg",
            night: "fog-night.svg"
        }
    },

    48: {
        label: "Rime fog",
        icon: {
            day: "fog-day.svg",
            night: "fog-night.svg"
        }
    },

    51: {
        label: "Light drizzle",
        icon: "drizzle.svg"
    },

    53: {
        label: "Moderate drizzle",
        icon: "drizzle.svg"
    },

    55: {
        label: "Heavy drizzle",
        icon: "drizzle.svg"
    },

    56: {
        label: "Freezing light drizzle",
        icon: "sleet.svg"
    },

    57: {
        label: "Freezing heavy drizzle",
        icon: "sleet.svg"
    },

    61: {
        label: "Light rain",
        icon: "rain.svg"
    },

    63: {
        label: "Moderate rain",
        icon: "rain.svg"
    },

    65: {
        label: "Heavy rain",
        icon: "rain.svg"
    },

    66: {
        label: "Freezing light rain",
        icon: "sleet.svg"
    },

    67: {
        label: "Freezing heavy rain",
        icon: "sleet.svg"
    },

    71: {
        label: "Light snowfall",
        icon: "snow.svg"
    },

    73: {
        label: "Moderate snowfall",
        icon: "snow.svg"
    },

    75: {
        label: "Heavy snowfall",
        icon: "snow.svg"
    },

    77: {
        label: "Snow grains",
        icon: "snow.svg"
    },

    80: {
        label: "Light rain shower",
        icon: "rain.svg"
    },

    81: {
        label: "Moderate rain shower",
        icon: "rain.svg"
    },

    82: {
        label: "Violent rain shower",
        icon: "rain.svg"
    },

    85: {
        label: "Light snow shower",
        icon: "snow.svg"
    },

    86: {
        label: "Heavy snow shower",
        icon: "snow.svg"
    },

    95: {
        label: "Moderate Thunderstorm",
        icon: "thunderstorms.svg"
    },

    96: {
        label: "Severe Thunderstorm",
        icon: "extreme-thunderstorms.svg"
    },

    99: {
        label: "Torrential Thunderstorm",
        icon: "extreme-thunderstorms.svg"
    }
};