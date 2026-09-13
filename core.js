// local storage, onload functions and code

// think saveState as functions who writes data on storage drive i.e. localStorage
function saveState() {
    const state = {
        selectedCity,
        currentLocation,
        recentSearchLocations,
        savedLocations,

        settings: {
            timeFormat,
            temperature: temFormat,
            wind: windFormat,
            pressure: pressureFormat,
            theme: themeMode
        }
    }

    // saving state of breezely
    localStorage.setItem("breezelyState", JSON.stringify(state));
}

// Think loadState a functions which reads data from storageDrive i.e. localStorage and show on UI
function loadState() {
    const savedState = localStorage.getItem("breezelyState");

    if (!savedState) {
        return;
    }

    // protecting loadState against currupted data.
    try {

        const state = JSON.parse(savedState);

        selectedCity = state.selectedCity || [];
        currentLocation = state.currentLocation || null;
        recentSearchLocations = state.recentSearchLocations || [];
        savedLocations = state.savedLocations || [];

        if (state.settings) {
            timeFormat = state.settings.timeFormat || "12h";
            temFormat = state.settings.temperature || "C";
            windFormat = state.settings.wind || "kmph";
            pressureFormat = state.settings.pressure || "hPa";

            // Validation before loading themes -> basically checking that these names exist in settings (auto, light and dark), if any other name exist then apply 'auto' theme.
            if (["auto", "light", "dark"].includes(state.settings.theme)) {
                themeMode = state.settings.theme;
            } else {
                themeMode = "auto";
            }
        }

        // Sets an initial DOM theme mode before the actual weather/day-night state is applied.
        if (themeMode === "dark") {
            document.body.dataset.themeMode = "dark";
        } else {
            document.body.dataset.themeMode = "light";
        }

    } catch (error) {
        console.warn("Saved Breezely state is corrupted. Resetting saved state.");
        showAppStatus("Curropted localStorage, reset the localStorage", "error");
        localStorage.removeItem("breezelyState");
    }


}

// update locationNames function
function updateLocationName(city, country) {
    UIElements.location_city.textContent = city;
    UIElements.location_country.textContent = country;
}

// All functions

// sunrise and sunset arc - function
function sunAnimation(sunriseTime, sunsetTime, currentTime) {

    let sunriseMinutes = sunriseTime.slice(14)
    let sunsetHour = sunsetTime.split("T")[1].slice(0, 2);
    let elapsedSunriseMinutes = parseInt((60 - sunriseMinutes));
    let elapsedSunsetMinutes = parseInt(sunsetTime.slice(14));
    let sunriseHour = parseInt(sunriseTime.split("T")[1].slice(0, 2)) + 1;
    let middleHoursMinutes = (sunsetHour - sunriseHour) * 60;
    let totalDaylightMinutes = elapsedSunriseMinutes + middleHoursMinutes + elapsedSunsetMinutes;

    let currentHour = parseInt(currentTime.split("T")[1].slice(0, 2));
    let currentTimeMinutes = parseInt(currentTime.split("T")[1].slice(3, 5));
    let totalCurrentPassedMinutes = elapsedSunriseMinutes + currentTimeMinutes + ((currentHour - sunriseHour) * 60);

    let sunTimeDifference = totalCurrentPassedMinutes / totalDaylightMinutes;
    const progress = Math.min(1, Math.max(0, sunTimeDifference));

    if (progress <= 0 || progress >= 1) {
        UIElements.currentSunIcon.style.display = 'none';
    }
    else {
        UIElements.currentSunIcon.style.display = 'block';

        // positions using polar to cartesian concept
        // const angle = Math.PI * (1 - progress);
        // const cx = 50, cy = 50, radius = 46;

        // // Position in SVG coordinates
        // const xPosition = cx + radius * Math.cos(angle);
        // const yPosition = cy - radius * Math.sin(angle);

        // // Convert SVG coords → percentage of the container
        // const leftPct = xPosition;
        // const topPct = (yPosition / 50) * 100 //viewBox height is 40

        // UIElements.currentSunIcon.style.left = leftPct + '%';
        // UIElements.currentSunIcon.style.top = topPct + '%';
        // UIElements.currentSunIcon.style.transform = 'translate(-50%, -50%)';

        const pathLength = UIElements.sunPath.getTotalLength();

        const point = UIElements.sunPath.getPointAtLength(pathLength * progress);

        const arcBox = document.querySelector(
            '.current-weather__arc-box'
        );

        // calculating positions from x and y points (for horizontal position divide by 100(arcBox width) to get percentage and multiply by arcBox width(according to devie) to get actual position)
        const xPosition =
            (point.x / 100) * arcBox.clientWidth;

        const yPosition =
            (point.y / 50) * arcBox.clientHeight;

        UIElements.currentSunIcon.style.left =
            `${xPosition}px`;

        UIElements.currentSunIcon.style.top =
            `${yPosition}px`;

        UIElements.currentSunIcon.style.transform =
            'translate(-50%, -50%)';

    }

}

// Utility functions
let timeFormat = "12h";

function formatTime(timestamp) {
    const date = new Date(timestamp);

    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: timeFormat === "12h"
    }).format(date);
}

let temFormat = "C";
function formatTemperature(tempValue) {
    tempValue = parseFloat(tempValue);
    if (temFormat === "F") {
        tempValue = Math.round(((tempValue * (9 / 5)) + 32) * 10) / 10;
        return `${tempValue}&deg`;
    }

    else {
        return `${tempValue}&deg`;
    }

}

let windFormat = "kmph";
function formatWind(windValue) {
    windValue = parseInt(windValue);

    if (windFormat === "mph") {
        windValue = Math.round((windValue * 0.621371) * 10) / 10;
        return `${windValue} mph`
    }
    else {
        return `${windValue} km/h`
    }
}

let pressureFormat = "hPa";
function formatPressure(pressureValue) {
    pressureValue = parseFloat(pressureValue);

    if (pressureFormat === "mmHg") {
        pressureValue = Math.round((pressureValue * 0.750062) * 10) / 10;
        return `${pressureValue} mmHg`;
    }
    else {
        return `${pressureValue} hPa`;
    }

}

// error handling UI - functions
function showAppStatus(message, type = "error") {
    let status = document.querySelector(".app-status-message");

    if (!status) {
        status = document.createElement("p");
        status.className = "app-status-message";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");
        Object.assign(status.style, {
            position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
            zIndex: "9999", maxWidth: "min(90vw, 600px)", margin: "0", padding: "12px 16px",
            borderRadius: "8px", color: "#fff", background: "#b42318", boxShadow: "0 8px 24px rgba(0,0,0,.2)"
        });
        document.body.appendChild(status);
    }

    status.textContent = message;
    if (type === "success") {
        status.style.background = "#067647";
    }
    else if (type === "info") {
        status.style.background = "#175cd3";
    }
    else {
        status.style.background = "#b42318";
    }

    status.hidden = false;
    clearTimeout(showAppStatus.timer);
    showAppStatus.timer = setTimeout(() => {
        status.hidden = true;
    }, 5000);
}

// All loaders - functions
function setAppLoading(isLoading) {
    if (!UIElements.appLoading) {
        return;
    }

    // if isLoading = true then !isLoading means false therefore hidden = false -> show the loader,
    // If isLoading = false then !isLoading means true therefore hidden = true -> hider the loader.
    UIElements.appLoading.hidden = !isLoading;
    // simpler version
    // if (isLoading) {
    //     UIElements.appLoading.hidden = false;
    // } else {
    //     UIElements.appLoading.hidden = true;
    // }

    // tells accessibility technologies whether the whole page is currently busy/loading.
    document.body.setAttribute("aria-busy", String(isLoading));
}

function setWeatherLoading(isLoading) {
    if (!UIElements.weatherLoading) {
        return;
    }

    UIElements.weatherLoading.hidden = !isLoading;
    if (UIElements.heroSection) {
        UIElements.heroSection.setAttribute("aria-busy", String(isLoading));
    }
}

function setRefreshLoading(isLoading) {
    if (!UIElements.dataRefreshBtn) {
        return;
    }

    UIElements.dataRefreshBtn.disabled = isLoading;
    UIElements.dataRefreshBtn.classList.toggle("is-loading", isLoading);
    // Can also be written as:
    /* if(isLoading === true){
        UIElements.dataRefreshBtn.classList.add("is-loading")
    }
    else{
        UIElements.dataRefreshBtn.classList.remove("is-loading");
    }
      */
    UIElements.dataRefreshBtn.textContent = isLoading ? "Updating..." : "Refresh";
    // Can also be written as:
    /*
    if(isLoading === true){
        UIElements.dataRefreshBtn.textContent = "Updating...";
    }
    else{
        UIElements.dataRefreshBtn.textContent = "Refresh";
    }
     */
}

function getErrorMessage(error) {

    if (!navigator.onLine) {
        return showAppStatus("You are offline. Check your internet connection");
    }

    if (error.status === 429) {
        return showAppStatus("Too many requests. Please try again later.");
    }

    if (error.status >= 500) {
        return showAppStatus("The weather service is temporarily unavailable.");
    }

    return showAppStatus("Something went wrong. Please try again.");

}


function formatForecastDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);

    const day = new Intl.DateTimeFormat('en-US', {
        weekday: 'short'
    }).format(date);

    const dateNumber = new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'long'
    }).format(date);

    return {
        day,
        date: dateNumber
    };
}

// weathericon function based on time
function getWeatherConfig(weatherCode) {
    return weatherConfig[weatherCode] || {
        label: "Changing weather",
        icon: "overcast.svg"
    };
}

function getWeatherIcon(weatherCode, isDay) {
    const config = getWeatherConfig(weatherCode);

    if (typeof config.icon === "string") {
        return config.icon
    }

    return config.icon[isDay ? "day" : "night"];
}

function getWeatherThemeCategory(weatherCode) {
    const code = Number(weatherCode);

    if (code === 0 || code === 1 || code === 2) return "sunny";
    if (code === 3) return "cloudy";
    if (code === 45 || code === 48) return "atmosphere";
    if (code >= 51 && code <= 67 || code >= 80 && code <= 82) return "rain";
    if (code >= 71 && code <= 77 || code >= 85 && code <= 86) return "snow";
    if (code >= 95 && code <= 99) return "thunder";

    return "sunny";
}

// apply weather theme and schedule theme - functions
function applyWeatherTheme(weatherCode, isDay) {
    const category = getWeatherThemeCategory(weatherCode);
    let colorMode;

    if (themeMode === "auto") {
        if (isDay) {
            colorMode = "light";
        } else {
            colorMode = "dark";
        }
    } else {
        colorMode = themeMode;
    }

    document.body.dataset.weatherTheme = category;
    document.body.dataset.themeMode = colorMode;
}

// function to check day or night
function isItDayTime(timestamp, sunriseTime, sunsetTime) {
    return timestamp > sunriseTime && timestamp <= sunsetTime;
}

// Show search status message - function
function showSearchStatus(message) {

    let boxes = document.querySelectorAll('.site_header__search-result-box, .site_header__search-result-box--mobile, .site_header__search-result-box--location');

    boxes.forEach((box) => {

        if (!box) return;

        let StatusMessage = box.querySelector('.search-status-message');
        if (!StatusMessage) {
            StatusMessage = document.createElement('p');
            StatusMessage.className = 'search-status-message';
            box.appendChild(StatusMessage);
        }

        StatusMessage.textContent = message;
        StatusMessage.style.display = 'block';
        box.style.display = 'block';

    })

    document.querySelectorAll('.site_header__search-result-row, .site_header__search-result-row--mobile, .site_header__search-result-row--location')
        .forEach(row => row.style.display = 'none');

}

// hide status message - function
function hideSearchStatus() {

    document.querySelectorAll('.search-status-message')
        .forEach(searchStatus => searchStatus.style.display = 'none');

}

// save location btn fill/empty state - function
function updateStarState(star, locationLatitude, locationLongitude, locationName, locationCountry) {

    const isSaved = savedLocations.some(
        location =>
            (location.latitude === locationLatitude &&
                location.longitude === locationLongitude) ||
            (location.name === locationName &&
                location.country === locationCountry)
    );

    if (isSaved) {
        star.classList.add('fa-solid');
    }
    else {
        star.classList.remove('fa-solid');
    }

}


// All APIs, getting data from APIs functions

// Getting user's live location
const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
};

// live location success - function
async function success(position) {

    const isInitialLocationLoad = selectedCity.length === 0;
    try {

        const coordinate = position.coords;

        const livelatitude = coordinate.latitude;
        const livelongitude = coordinate.longitude;

        const { weatherData } = await cityWeather(livelatitude, livelongitude, false);
        const areaData = await getAreaName(livelatitude, livelongitude, false);
        let currentTime = weatherData.current.time;

        currentLocation = {
            name: areaData.city,
            country: areaData.countryName,
            latitude: livelatitude,
            longitude: livelongitude,
            temperature: weatherData.current.temperature_2m,
            weatherCode: weatherData.current.weather_code,
            cityCurrentTime: currentTime,
            cityCurrentSunriseTime: weatherData.daily.sunrise[0],
            cityCurrentSunsetTime: weatherData.daily.sunset[0]
        }
        renderCurrentLocation(currentLocation);
        saveState();

        if (selectedCity.length === 0) {
            updateSelectedLocation(currentLocation);

            // When no selected city exists, update currentWeatherData directly so settings work
            // even if the user opens Settings immediately on first launch.
            currentWeatherData = weatherData;

            updateLocationName(areaData.city, areaData.countryName);
            sunriseTime = weatherData.daily.sunrise[0];
            sunsetTime = weatherData.daily.sunset[0];
            currentTime = weatherData.current.time;
            updateWeatherUI(weatherData);
            await cityAQI(livelatitude, livelongitude, true);
            updateHourlyForecast(weatherData);
            updateDaysForecast(weatherData);
            sunAnimation(sunriseTime, sunsetTime, currentTime);
        }
    }
    catch (error) {
        console.log(error);
        showAppStatus(
            "Couldn't load weather for your current location. Please try again.",
            "error"
        );
    }
    finally {
        if (isInitialLocationLoad) {
            setAppLoading(false);
        }
    }

}

// live location failed - function
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message} `);

    // Location on basis of user's IP address
    async function getIPgeoLocation() {
        const isInitialLocationLoad = selectedCity.length === 0;
        try {

            const response = await fetch('https://free.freeipapi.com/api/json');

            if (!response.ok) {
                const error = new Error("IP Location request failed");
                error.status = response.status;
                throw error;
            }

            const data = await response.json();

            // sending coordinates to fetch weather engine and aqi engine
            const { weatherData } = await cityWeather(data.latitude, data.longitude, false);
            let currentTime = weatherData.current.time;

            currentLocation = {
                name: data.cityName,
                country: data.countryName,
                latitude: data.latitude,
                longitude: data.longitude,
                temperature: weatherData.current.temperature_2m,
                weatherCode: weatherData.current.weather_code,
                cityCurrentTime: currentTime,
                cityCurrentSunriseTime: weatherData.daily.sunrise[0],
                cityCurrentSunsetTime: weatherData.daily.sunset[0]
            }
            renderCurrentLocation(currentLocation);
            saveState();

            if (selectedCity.length === 0) {
                updateSelectedLocation(currentLocation);

                // When no selected city exists, update currentWeatherData directly so settings work
                // even if the user opens Settings immediately on first launch.
                currentWeatherData = weatherData;

                updateLocationName(data.cityName, data.countryName);
                sunriseTime = weatherData.daily.sunrise[0];
                sunsetTime = weatherData.daily.sunset[0];
                currentTime = weatherData.current.time;
                updateWeatherUI(weatherData);
                await cityAQI(data.latitude, data.longitude, true);
                updateHourlyForecast(weatherData);
                updateDaysForecast(weatherData);
                sunAnimation(sunriseTime, sunsetTime, currentTime);
                showAppStatus(
                    "Location permission was unavailable. Using an approximate location.",
                    "info"
                );
            }

        }

        catch (error) {
            console.log(`Error: ${error.message} `);
            getErrorMessage(error);
        }
        finally {
            if (isInitialLocationLoad) {
                setAppLoading(false);
            }
        }

    }

    getIPgeoLocation();

}

async function initializeApp() {

    setAppLoading(true);
    loadState();

    if (selectedCity.length > 0) {
        const latitude = selectedCity[0].latitude;
        const longitude = selectedCity[0].longitude;
        try {
            await Promise.all([
                cityWeather(latitude, longitude, true),
                cityAQI(latitude, longitude, true)
            ]);
        } catch (error) {
            console.warn("Initial saved-location weather load failed.", error);
        } finally {
            setAppLoading(false);
        }
        updateLocationName(selectedCity[0].name, selectedCity[0].country);
        IsLocationSaved(selectedCity[0].latitude, selectedCity[0].longitude, selectedCity[0].name, selectedCity[0].country);
    }

    // running parallely to fetch current location of user on every loading.
    navigator.geolocation.getCurrentPosition(success, error, options);

    await updateRecentSearchData();
    await updateSavedLocationData();

    renderRecentSearch();
    renderSavedLocation();
    renderSettingsButtons();

}

initializeApp();


// Main weather fetching engine - function
async function cityWeather(lat, lon, updateUI = true) {

    try {
        let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,sunrise,sunset,uv_index_max,temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,wind_speed_10m_max&hourly=temperature_2m,precipitation_probability,visibility,uv_index,weather_code&current=temperature_2m,apparent_temperature,pressure_msl,weather_code,relative_humidity_2m,wind_speed_10m,wind_direction_10m&timezone=auto`;

        let response = await fetch(weatherUrl);

        if (!response.ok) {
            const error = new Error("Failed to fetch weather data");
            error.status = response.status;
            throw error;
        }

        let weatherData = await response.json();

        if (updateUI) {
            currentWeatherData = weatherData;

            // sunrise and sunset time
            sunriseTime = weatherData.daily.sunrise[0];
            sunsetTime = weatherData.daily.sunset[0];
            currentTime = weatherData.current.time;

            // update UI functions call
            updateWeatherUI(weatherData);
            updateHourlyForecast(weatherData);
            updateDaysForecast(weatherData);
            sunAnimation(sunriseTime, sunsetTime, currentTime);
            scrollUp();
        }

        return { weatherData, sunriseTime, sunsetTime };
    }
    catch (error) {
        getErrorMessage(error);
        throw error;
    }



}

// Main AQI fetching engine - function
async function cityAQI(lat, lon, updateUI = true) {

    try {

        const aqiURL = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi&timezone=auto`;

        const response = await fetch(aqiURL);

        if (!response.ok) {
            const error = new Error("Failed to fetch AQI data");
            error.status = response.status;
            throw error;
        }

        const aqiData = await response.json();

        if (updateUI) {
            updateWeatherAQI(aqiData);
            scrollUp();
        }
        return aqiData;
    }

    catch (error) {
        console.log(`Some error occured: ${error.message}`);
        getErrorMessage(error);
        throw error;
    }
}

// Getting city/country name from raw GPS coordinates - function
async function getAreaName(lat, lon, updateUI = true) {

    try {

        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

        const response = await fetch(url);

        if (!response.ok) {
            const error = new Error(`Location naming lookup failed`);
            error.status = response.status;
            throw error;
        }

        const data = await response.json();

        if (updateUI) {
            updateLocationName(data.city, data.countryName);
        }

        return data;
    }

    catch (error) {
        console.error("Reverse geocoding error:", error);
        getErrorMessage(error);
        throw error;
    }

}

// Geocoding API - function
async function LocationCoordinates(city, requestToken) {

    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5&language=en&format=json`);

        if (!response.ok) {
            const error = new Error(`Error occured: ${response.status}`);
            error.status = response.status;
            throw error;
        }

        const data = await response.json();

        if (requestToken !== searchRequestToken) {
            return;
        }

        searchResults(data);

    }

    catch (error) {
        console.log(error.message);

        if (!navigator.onLine) {
            showSearchStatus("You are offline. Search is unavilable");
        }
        else {
            showSearchStatus("Unable to search right now. Please try again.");
        }
        getErrorMessage(error);
        throw error;
    }

}

function getSearchResultForRow(row) {
    const locationID = row.dataset.locationID;

    // find the exact row using ID
    let result;
    for (let city of currentSearchData.results) {
        if (String(city.id) === locationID) {
            result = city;
            break;
        }
    }

    return result;
}

// Update UI functions

// Search functions

// Update search results - function
function searchResults(data) {

    currentSearchData = data;

    if (!data || !data.results || data.results.length === 0) {
        showSearchStatus("This location doesn't exist");
        return;
    }

    hideSearchStatus();

    UIElements.site_header_cities.forEach((element, i) => {

        if (!data.results[i]) {
            let rowParent = element.closest('.site_header__search-result-row');

            if (rowParent) {
                rowParent.style.display = 'none';
            }
            return;
        }

        const locationID = data.results[i].id

        // assigning location ID to save location buttons
        UIElements.desktopSaveLocationBtns[i].dataset.locationID = locationID;
        UIElements.mobileSaveLocationBtns[i].dataset.locationID = locationID;
        UIElements.locationSaveLocationBtn[i].dataset.locationID = locationID;

        // assigning location ID to searchResult row of desktop, mobile and location just like assigned in save location buttons
        UIElements.searchResultRow[i].dataset.locationID = locationID;
        UIElements.searchResultRowMobile[i].dataset.locationID = locationID;
        UIElements.searchResultRowLocation[i].dataset.locationID = locationID;

        updateStarState(UIElements.desktopSaveLocationBtns[i], data.results[i].latitude, data.results[i].longitude, data.results[i].name, data.results[i].country);
        updateStarState(UIElements.mobileSaveLocationBtns[i], data.results[i].latitude, data.results[i].longitude, data.results[i].name, data.results[i].country);
        updateStarState(UIElements.locationSaveLocationBtn[i], data.results[i].latitude, data.results[i].longitude, data.results[i].name, data.results[i].country);

        element.textContent = data.results[i].name;

        if (UIElements.site_header_cities_mobile[i] && UIElements.site_header_cities_location[i]) {
            UIElements.site_header_cities_mobile[i].textContent = data.results[i].name;
            UIElements.site_header_cities_location[i].textContent = data.results[i].name;
        }

        if (UIElements.site_header_states[i] && UIElements.site_header_states_mobile[i] && UIElements.site_header_states_location[i]) {
            UIElements.site_header_states[i].textContent = data.results[i].admin1;
            UIElements.site_header_states_mobile[i].textContent = data.results[i].admin1;
            UIElements.site_header_states_location[i].textContent = data.results[i].admin1;
        }

        if (UIElements.site_header_countries[i] && UIElements.site_header_countries_mobile && UIElements.site_header_countries_location[i]) {
            UIElements.site_header_countries[i].textContent = data.results[i].country;
            UIElements.site_header_countries_mobile[i].textContent = data.results[i].country;
            UIElements.site_header_countries_location[i].textContent = data.results[i].country;
        }

        if (UIElements.site_header_flag[i] && UIElements.site_header_flag_mobile[i] && UIElements.site_header_flag_location[i]) {
            UIElements.site_header_flag[i].src = `https://flagsapi.com/${data.results[i].country_code}/flat/32.png`;
            UIElements.site_header_flag_mobile[i].src = `https://flagsapi.com/${data.results[i].country_code}/flat/32.png`;
            UIElements.site_header_flag_location[i].src = `https://flagsapi.com/${data.results[i].country_code}/flat/32.png`;
        }

    });

    UIElements.site_header_cities_mobile.forEach((element, i) => {

        if (!data.results[i]) {
            let rowParentMobile = element.closest('.site_header__search-result-row--mobile');

            if (rowParentMobile) {
                rowParentMobile.style.display = 'none';
            }
            return;
        }

    });

    UIElements.site_header_cities_location.forEach((element, i) => {

        if (!data.results[i]) {
            let rowParentLocation = element.closest('.site_header__search-result-row--location');

            if (rowParentLocation) {
                rowParentLocation.style.display = 'none';
            }
            return;
        }

    });

}

// Search functionality - function
function searchCity() {

    UIElements.searchBar.forEach((search) => {
        search.addEventListener('input', (e) => {
            const searchValue = e.target.value.trim();
            const requestToken = ++searchRequestToken;

            // Clear previous timer immediately on every single keystroke
            clearTimeout(debounceTimer);

            // CASE 1: Completely empty search input
            if (searchValue.length === 0) {
                if (UIElements.searchResultBox) UIElements.searchResultBox.style.display = 'none';
                if (UIElements.searchResultBoxMobile) UIElements.searchResultBoxMobile.style.display = 'none';
                if (UIElements.searchResultBoxLocation) UIElements.searchResultBoxLocation.style.display = 'none';
                hideSearchStatus();
                return;
            }

            // CASE 2: Block special characters (Only allows letters, numbers, spaces and hyphens)
            const validCharacters = /^[a-zA-Z0-9\s\-]+$/;
            if (!validCharacters.test(searchValue)) {
                showSearchStatus("Please enter a valid city name without special characters");
                return;
            }

            // CASE 3: Input is 1 or 2 characters long
            if (searchValue.length < 3) {
                showSearchStatus("Please enter atleast 3 characters to start searching!");
                return;
            }

            // CASE 4: Valid search term! Wait 500ms before making the API call
            showSearchStatus("Searching...");

            debounceTimer = setTimeout(() => {
                if (UIElements.searchResultBox) UIElements.searchResultBox.style.display = 'block';
                if (UIElements.searchResultBoxMobile) UIElements.searchResultBoxMobile.style.display = 'block';
                if (UIElements.searchResultBoxLocation) UIElements.searchResultBoxLocation.style.display = 'block';

                hideSearchStatus();

                UIElements.searchResultRow.forEach(row => row.style.display = 'flex');
                UIElements.searchResultRowMobile.forEach(row => row.style.display = 'flex');
                UIElements.searchResultRowLocation.forEach((row) => row.style.display = 'flex');

                LocationCoordinates(searchValue, requestToken);

            }, 800);

        })

    })

}

searchCity();

// Update hero section - function
function updateWeatherUI(data) {

    // Time-based logic
    let date = `${data.current.time}`;
    let originalTime = date.slice(11);
    const fixedHour = originalTime.split(':')[0];
    const formattedTimeHour = `${fixedHour}:00`;

    let updated_time = formatTime(date);
    const isDay = isItDayTime(date, data.daily.sunrise[0], data.daily.sunset[0]);
    applyWeatherTheme(data.current.weather_code, isDay);

    if (UIElements.heroWeatherIcon) {
        UIElements.heroWeatherIcon.src = `./Assets/Icons/weather icons/${getWeatherIcon(data.current.weather_code, isDay)}`;
    }

    const timeSet = {
        '00:00': 0,
        '01:00': 1,
        '02:00': 2,
        '03:00': 3,
        '04:00': 4,
        '05:00': 5,
        '06:00': 6,
        '07:00': 7,
        '08:00': 8,
        '09:00': 9,
        '10:00': 10,
        '11:00': 11,
        '12:00': 12,
        '13:00': 13,
        '14:00': 14,
        '15:00': 15,
        '16:00': 16,
        '17:00': 17,
        '18:00': 18,
        '19:00': 19,
        '20:00': 20,
        '21:00': 21,
        '22:00': 22,
        '23:00': 23
    }

    let currentTimeStamp = timeSet[formattedTimeHour];

    // convert to km function
    function convertToKm(meters) {
        const km = Math.floor(meters / 100) / 10;
        return `${km} km`;
    }

    // Visibility logic
    let visibility_data = `${data.hourly.visibility[currentTimeStamp]}`;

    // UV Status logic
    let uv_status_code = `${data.hourly.uv_index[currentTimeStamp]}`;
    let UV_STATUS;
    if (uv_status_code >= 0 && uv_status_code < 2) {
        UV_STATUS = "Low";
    }
    else if (uv_status_code >= 2 && uv_status_code < 5) {
        UV_STATUS = "Moderate";
    }
    else if (uv_status_code >= 5 && uv_status_code < 7) {
        UV_STATUS = "High";
    }
    else if (uv_status_code >= 7 && uv_status_code <= 9) {
        UV_STATUS = "Very High";
    }
    else {
        UV_STATUS = "Extreme";
    }

    // Wind direction logic
    let wind_direction_angle = `${data.current.wind_direction_10m}`;
    let WIND_DIRECTION;

    if (wind_direction_angle >= 337.5 || wind_direction_angle < 22.5) {
        WIND_DIRECTION = "N";
    } else if (wind_direction_angle >= 22.5 && wind_direction_angle < 67.5) {
        WIND_DIRECTION = "NE";
    } else if (wind_direction_angle >= 67.5 && wind_direction_angle < 112.5) {
        WIND_DIRECTION = "E";
    } else if (wind_direction_angle >= 112.5 && wind_direction_angle < 157.5) {
        WIND_DIRECTION = "SE";
    } else if (wind_direction_angle >= 157.5 && wind_direction_angle < 202.5) {
        WIND_DIRECTION = "S";
    } else if (wind_direction_angle >= 202.5 && wind_direction_angle < 247.5) {
        WIND_DIRECTION = "SW";
    } else if (wind_direction_angle >= 247.5 && wind_direction_angle < 292.5) {
        WIND_DIRECTION = "W";
    } else {
        WIND_DIRECTION = "NW"; // Handles 292.5 to 337.5
    }


    let currentWeatherCode = `${data.current.weather_code}`;
    UIElements.temp.innerHTML = formatTemperature(data.current.temperature_2m);
    UIElements.temp__feel.innerHTML = formatTemperature(data.current.apparent_temperature);
    UIElements.humidity_value.textContent = `${data.current.relative_humidity_2m}%`;
    UIElements.wind_speed.textContent = formatWind(data.current.wind_speed_10m);
    UIElements.wind_direction.textContent = WIND_DIRECTION;
    UIElements.weather_type.textContent = getWeatherConfig(currentWeatherCode).label;
    UIElements.temp__high.innerHTML = `&nbsp;${formatTemperature(data.daily.temperature_2m_max[0])}`;
    UIElements.temp__low.innerHTML = `&nbsp;${formatTemperature(data.daily.temperature_2m_min[0])}`;
    UIElements.pressure_value.textContent = formatPressure(data.current.pressure_msl);
    UIElements.uv_index.textContent = `${data.hourly.uv_index[currentTimeStamp]}`;
    UIElements.uv_index_status.textContent = UV_STATUS;

    UIElements.rain_chance.textContent = `${data.hourly.precipitation_probability[currentTimeStamp]}%`;
    UIElements.visibility_value.textContent = convertToKm(visibility_data);
    UIElements.updated_time.textContent = updated_time;

    UIElements.sunrise_time.textContent = formatTime(`${data.daily.sunrise[0]}`);
    UIElements.sunset_time.textContent = formatTime(`${data.daily.sunset[0]}`);
}

// Update hourly-forecast section - function
function updateHourlyForecast(data) {

    // Time-based logic
    const timeArray = data.hourly.time;
    let currentTime = data.current.time;
    let roundedCurrentTime = currentTime.substring(0, currentTime.lastIndexOf(":")) + ":00";
    let currentHourlyTimeIndex = timeArray.indexOf(roundedCurrentTime);

    let currentSunriseTime;
    let currentSunsetTime;
    let currentDate = data.daily.time[0];

    UIElements.hourly_forecast_time.forEach((timeElement, i) => {
        let targetIndex = currentHourlyTimeIndex + i;

        if (timeArray[targetIndex]) {
            // getting currect timestamps for getting current data sunrise and sunset time.
            let hourlyDate = data.hourly.time[targetIndex].split('T')[0];

            if (hourlyDate === currentDate) {
                currentSunriseTime = data.daily.sunrise[0];
                currentSunsetTime = data.daily.sunset[0];
            }
            else {
                currentSunriseTime = data.daily.sunrise[1];
                currentSunsetTime = data.daily.sunset[1];

            }

            const weatherCode = data.hourly.weather_code[targetIndex];
            const weatherIcon = getWeatherIcon(weatherCode, isItDayTime(timeArray[targetIndex], currentSunriseTime, currentSunsetTime));

            if (i === 0) {
                timeElement.textContent = "Now";
            }
            else {
                timeElement.textContent = formatTime(timeArray[targetIndex]);
            }


            if (UIElements.hourly_forecast_temp[i]) {
                UIElements.hourly_forecast_temp[i].innerHTML = formatTemperature(data.hourly.temperature_2m[targetIndex]);
            }

            if (UIElements.hourly_forecast_rain[i]) {
                UIElements.hourly_forecast_rain[i].innerHTML = `${data.hourly.precipitation_probability[targetIndex]}%`;
            }

            if (UIElements.hourlyForecastWeatherIcons[i]) {
                UIElements.hourlyForecastWeatherIcons[i].src = `./Assets/Icons/weather icons/${weatherIcon}`;
            }

        }
    });

}

// Update 7-days forecast section - function
function updateDaysForecast(data) {

    UIElements.dayForecastDay.forEach((element, i) => {
        let weatherCode = data.daily.weather_code[i];
        let weatherIcon;

        if (weatherCode === 0 || weatherCode === 1 || weatherCode === 2 || weatherCode === 45 || weatherCode === 48) {
            weatherIcon = getWeatherConfig(weatherCode).icon.day
        }
        else {
            weatherIcon = getWeatherConfig(weatherCode).icon;
        }

        let targetIndex = i;

        UIElements.dayForecastDay[i].textContent = formatForecastDate(data.daily.time[targetIndex]).day;

        if (UIElements.dayForecastDate[i]) {
            UIElements.dayForecastDate[i].textContent = formatForecastDate(data.daily.time[targetIndex]).date;
        }

        if (UIElements.dayForecastStatus[i]) {
            UIElements.dayForecastStatus[i].innerHTML = `${getWeatherConfig(data.daily.weather_code[targetIndex]).label}`;
        }

        if (UIElements.dayForecastTempHigh[i]) {
            UIElements.dayForecastTempHigh[i].innerHTML = formatTemperature(data.daily.temperature_2m_max[targetIndex]);
        }

        if (UIElements.dayForecastTempLow[i]) {
            UIElements.dayForecastTempLow[i].innerHTML = formatTemperature(data.daily.temperature_2m_min[targetIndex]);
        }

        if (UIElements.dayForecastRain[i]) {
            UIElements.dayForecastRain[i].textContent = data.daily.precipitation_probability_max[targetIndex] + "%";
        }

        if (UIElements.dayForecastWindSpeed[i]) {
            UIElements.dayForecastWindSpeed[i].innerHTML = formatWind(data.daily.wind_speed_10m_max[targetIndex]);
        }

        if (UIElements.dayForecastWeatherIcons[i]) {
            UIElements.dayForecastWeatherIcons[i].src = `./Assets/Icons/weather icons/${weatherIcon}`
        }

    })

}

// Update AQI section - function
function updateWeatherAQI(data) {

    [UIElements.aqi_overall_value.textContent, UIElements.aqi_overall_mobile.textContent] = [data.current.us_aqi, data.current.us_aqi];
    [UIElements.aqi_PM10_value.textContent, UIElements.aqi_PM10_value_mobile.textContent] = [data.current.pm10, data.current.pm10];
    [UIElements.aqi_PM25_value.textContent, UIElements.aqi_PM25_value_mobile.textContent] = [data.current.pm2_5, data.current.pm2_5];
    [UIElements.aqi_CO_VALUE.textContent, UIElements.aqi_CO_VALUE_mobile.textContent] = [data.current.carbon_monoxide, data.current.carbon_monoxide];
    [UIElements.aqi_NO_value.textContent, UIElements.aqi_NO_value_mobile.textContent] = [data.current.nitrogen_dioxide, data.current.nitrogen_dioxide];
    [UIElements.aqi_SO_value.textContent, UIElements.aqi_SO_value_mobile.textContent] = [data.current.sulphur_dioxide, data.current.sulphur_dioxide];
    [UIElements.aqi_OZ_value.textContent, UIElements.aqi_OZ_value_mobile.textContent] = [data.current.ozone, data.current.ozone];
    UIElements.aqi_overall_aqi_value.textContent = data.current.us_aqi;

    // removing existing classes
    const aqiClasses = [
        'aqi-forecast__status--good',
        'aqi-forecast__status--moderate',
        'aqi-forecast__status--unhealthy-sensitive',
        'aqi-forecast__status--unhealthy',
        'aqi-forecast__status--very-unhealthy',
        'aqi-forecast__status--hazardous'
    ];

    // 2. Loop through the elements and remove the classes
    [
        UIElements.aqi_overall_status_second,
        UIElements.aqi_PM10_status,
        UIElements.aqi_PM10_status_mobile,
        UIElements.aqi_PM25_status,
        UIElements.aqi_PM25_status_mobile,
        UIElements.aqi_CO_status,
        UIElements.aqi_CO_status_mobile,
        UIElements.aqi_NO_status,
        UIElements.aqi_NO_status_mobile,
        UIElements.aqi_SO_status,
        UIElements.aqi_SO_status_mobile,
        UIElements.aqi_OZ_status,
        UIElements.aqi_OZ_status_mobile
    ].forEach(element => element.classList.remove(...aqiClasses));

    // AQI INFO

    let AQI_VALUE = data.current.us_aqi;
    if (AQI_VALUE <= 50) {
        UIElements.aqi_overall_status.textContent = "Good";
        UIElements.aqi_overall_status_mobile.textContent = "Good";
        UIElements.aqi_overall_status_second.classList.add('aqi-forecast__status--good');
        UIElements.aqi_overall_status_second.textContent = "Good";
    }
    else if (AQI_VALUE >= 51 && AQI_VALUE <= 100) {
        UIElements.aqi_overall_status.textContent = "Moderate";
        UIElements.aqi_overall_status_mobile.textContent = "Moderate";
        UIElements.aqi_overall_status_second.classList.add('aqi-forecast__status--moderate');
        UIElements.aqi_overall_status_second.textContent = "Moderate";
    }
    else if (AQI_VALUE >= 101 && AQI_VALUE <= 150) {
        UIElements.aqi_overall_status.textContent = "Unhealthy for sensitive groups";
        UIElements.aqi_overall_status_mobile.textContent = "Unhealthy for sensitive groups";
        UIElements.aqi_overall_status_second.classList.add('aqi-forecast__status--unhealthy-sensitive');
        UIElements.aqi_overall_status_second.textContent = "Unhealthy for sensitive groups";
    }
    else if (AQI_VALUE >= 151 && AQI_VALUE <= 200) {
        UIElements.aqi_overall_status.textContent = "Unhealthy";
        UIElements.aqi_overall_status_mobile.textContent = "Unhealthy";
        UIElements.aqi_overall_status_second.classList.add('aqi-forecast__status--unhealthy');
        UIElements.aqi_overall_status_second.textContent = "Unhealthy";
    }
    else if (AQI_VALUE >= 201 && AQI_VALUE <= 300) {
        UIElements.aqi_overall_status.textContent = "Very Unhealthy";
        UIElements.aqi_overall_status_mobile.textContent = "Very Unhealthy";
        UIElements.aqi_overall_status_second.classList.add('aqi-forecast__status--very-unhealthy');
        UIElements.aqi_overall_status_second.textContent = "Very Unhealthy";
    }
    else {
        UIElements.aqi_overall_status.textContent = "Hazardous";
        UIElements.aqi_overall_status_mobile.textContent = "Hazardous";
        UIElements.aqi_overall_status_second.textContent = "Hazardous";
        UIElements.aqi_overall_status_second.classList.add('aqi-forecast__status--hazardous');
    }


    let PM_10_VALUE = data.current.pm10;
    if (PM_10_VALUE >= 0 && PM_10_VALUE <= 54) {
        UIElements.aqi_PM10_status.textContent = "Good";
        UIElements.aqi_PM10_status_mobile.textContent = "Good";
        UIElements.aqi_PM10_status.classList.add('aqi-forecast__status--good');
        UIElements.aqi_PM10_status_mobile.classList.add('aqi-forecast__status--good');
    }
    else if (PM_10_VALUE > 54 && PM_10_VALUE <= 154) {
        UIElements.aqi_PM10_status.textContent = "Moderate";
        UIElements.aqi_PM10_status_mobile.textContent = "Moderate";
        UIElements.aqi_PM10_status.classList.add('aqi-forecast__status--moderate');
        UIElements.aqi_PM10_status_mobile.classList.add('aqi-forecast__status--moderate');
    }
    else if (PM_10_VALUE > 154 && PM_10_VALUE <= 254) {
        UIElements.aqi_PM10_status.textContent = "Unhealthy for sensitive groups";
        UIElements.aqi_PM10_status_mobile.textContent = "Unhealthy for sensitive groups";
        UIElements.aqi_PM10_status.classList.add('aqi-forecast__status--unhealthy-sensitive');
        UIElements.aqi_PM10_status_mobile.classList.add('aqi-forecast__status--unhealthy-sensitive');
    }
    else if (PM_10_VALUE > 254 && PM_10_VALUE <= 354) {
        UIElements.aqi_PM10_status.textContent = "Unhealthy";
        UIElements.aqi_PM10_status_mobile.textContent = "Unhealthy";
        UIElements.aqi_PM10_status.classList.add('aqi-forecast__status--unhealthy');
        UIElements.aqi_PM10_status_mobile.classList.add('aqi-forecast__status--unhealthy');
    }
    else if (PM_10_VALUE > 354 && PM_10_VALUE <= 424) {
        UIElements.aqi_PM10_status.textContent = "Very unhealthy";
        UIElements.aqi_PM10_status_mobile.textContent = "Very unhealthy";
        UIElements.aqi_PM10_status.classList.add('aqi-forecast__status--very-unhealthy');
        UIElements.aqi_PM10_status_mobile.classList.add('aqi-forecast__status--very-unhealthy');
    }
    else {
        UIElements.aqi_PM10_status.textContent = "Hazardous";
        UIElements.aqi_PM10_status_mobile.textContent = "Hazardous";
        UIElements.aqi_PM10_status.classList.add('aqi-forecast__status--hazardous');
        UIElements.aqi_PM10_status_mobile.classList.add('aqi-forecast__status--hazardous');
    }


    let PM_25_VALUE = data.current.pm2_5;
    if (PM_25_VALUE >= 0.0 && PM_25_VALUE <= 9.0) {
        UIElements.aqi_PM25_status.textContent = "Good";
        UIElements.aqi_PM25_status_mobile.textContent = "Good";
        UIElements.aqi_PM25_status.classList.add('aqi-forecast__status--good');
        UIElements.aqi_PM25_status_mobile.classList.add('aqi-forecast__status--good');
    }
    else if (PM_25_VALUE > 9.0 && PM_25_VALUE <= 35.4) {
        UIElements.aqi_PM25_status.textContent = "Moderate";
        UIElements.aqi_PM25_status_mobile.textContent = "Moderate";
        UIElements.aqi_PM25_status.classList.add('aqi-forecast__status--moderate');
        UIElements.aqi_PM25_status_mobile.classList.add('aqi-forecast__status--moderate');
    }
    else if (PM_25_VALUE > 35.4 && PM_25_VALUE <= 55.4) {
        UIElements.aqi_PM25_status.textContent = "Unhealthy for sensitive groups";
        UIElements.aqi_PM25_status_mobile.textContent = "Unhealthy for sensitive groups";
        UIElements.aqi_PM25_status.classList.add('aqi-forecast__status--unhealthy-sensitive');
        UIElements.aqi_PM25_status_mobile.classList.add('aqi-forecast__status--unhealthy-sensitive');
    }
    else if (PM_25_VALUE > 55.4 && PM_25_VALUE <= 125.4) {
        UIElements.aqi_PM25_status.textContent = "Unhealthy";
        UIElements.aqi_PM25_status_mobile.textContent = "Unhealthy";
        UIElements.aqi_PM25_status.classList.add('aqi-forecast__status--unhealthy');
        UIElements.aqi_PM25_status_mobile.classList.add('aqi-forecast__status--unhealthy');
    }
    else if (PM_25_VALUE > 125.4 && PM_25_VALUE <= 225.4) {
        UIElements.aqi_PM25_status.textContent = "Very unhealthy";
        UIElements.aqi_PM25_status_mobile.textContent = "Very unhealthy";
        UIElements.aqi_PM25_status.classList.add('aqi-forecast__status--very-unhealthy');
        UIElements.aqi_PM25_status_mobile.classList.add('aqi-forecast__status--very-unhealthy');
    }
    else {
        UIElements.aqi_PM25_status.textContent = "Hazardous";
        UIElements.aqi_PM25_status_mobile.textContent = "Hazardous";
        UIElements.aqi_PM25_status.classList.add('aqi-forecast__status--hazardous');
        UIElements.aqi_PM25_status_mobile.classList.add('aqi-forecast__status--hazardous');
    }


    let CO_VALUE = data.current.carbon_monoxide;
    if (CO_VALUE >= 0.0 && CO_VALUE <= 5041) {
        UIElements.aqi_CO_status.textContent = "Good";
        UIElements.aqi_CO_status_mobile.textContent = "Good";
        UIElements.aqi_CO_status.classList.add('aqi-forecast__status--good');
        UIElements.aqi_CO_status_mobile.classList.add('aqi-forecast__status--good');
    }
    else if (CO_VALUE > 5041 && CO_VALUE <= 10769) {
        UIElements.aqi_CO_status.textContent = "Moderate";
        UIElements.aqi_CO_status_mobile.textContent = "Moderate";
        UIElements.aqi_CO_status.classList.add('aqi-forecast__status--moderate');
        UIElements.aqi_CO_status_mobile.classList.add('aqi-forecast__status--moderate');
    }
    else if (CO_VALUE > 10769 && CO_VALUE <= 14205) {
        UIElements.aqi_CO_status.textContent = "Unhealthy for sensitive groups";
        UIElements.aqi_CO_status_mobile.textContent = "Unhealthy for sensitive groups";
        UIElements.aqi_CO_status.classList.add('aqi-forecast__status--unhealthy-sensitive');
        UIElements.aqi_CO_status_mobile.classList.add('aqi-forecast__status--unhealthy-sensitive');
    }
    else if (CO_VALUE > 14205 && CO_VALUE <= 17642) {
        UIElements.aqi_CO_status.textContent = "Unhealthy";
        UIElements.aqi_CO_status_mobile.textContent = "Unhealthy";
        UIElements.aqi_CO_status.classList.add('aqi-forecast__status--unhealthy');
        UIElements.aqi_CO_status_mobile.classList.add('aqi-forecast__status--unhealthy');
    }
    else if (CO_VALUE > 17642 && CO_VALUE <= 34826) {
        UIElements.aqi_CO_status.textContent = "Very unhealthy";
        UIElements.aqi_CO_status_mobile.textContent = "Very unhealthy";
        UIElements.aqi_CO_status.classList.add('aqi-forecast__status--very-unhealthy');
        UIElements.aqi_CO_status_mobile.classList.add('aqi-forecast__status--very-unhealthy');
    }
    else {
        UIElements.aqi_CO_status.textContent = "Hazardous";
        UIElements.aqi_CO_status_mobile.textContent = "Hazardous";
        UIElements.aqi_CO_status.classList.add('aqi-forecast__status--hazardous');
        UIElements.aqi_CO_status_mobile.classList.add('aqi-forecast__status--hazardous');
    }


    let NO_VALUE = data.current.nitrogen_dioxide;
    if (NO_VALUE >= 0 && NO_VALUE <= 99.7) {
        UIElements.aqi_NO_status.textContent = "Good";
        UIElements.aqi_NO_status_mobile.textContent = "Good";
        UIElements.aqi_NO_status.classList.add('aqi-forecast__status--good');
        UIElements.aqi_NO_status_mobile.classList.add('aqi-forecast__status--good');
    }
    else if (NO_VALUE > 99.7 && NO_VALUE <= 188.2) {
        UIElements.aqi_NO_status.textContent = "Moderate";
        UIElements.aqi_NO_status_mobile.textContent = "Moderate";
        UIElements.aqi_NO_status.classList.add('aqi-forecast__status--moderate');
        UIElements.aqi_NO_status_mobile.classList.add('aqi-forecast__status--moderate');
    }
    else if (NO_VALUE > 188.2 && NO_VALUE <= 677.4) {
        UIElements.aqi_NO_status.textContent = "Unhealthy for sensitive groups";
        UIElements.aqi_NO_status_mobile.textContent = "Unhealthy for sensitive groups";
        UIElements.aqi_NO_status.classList.add('aqi-forecast__status--unhealthy-sensitive');
        UIElements.aqi_NO_status_mobile.classList.add('aqi-forecast__status--unhealthy-sensitive');
    }
    else if (NO_VALUE > 677.4 && NO_VALUE <= 1221.2) {
        UIElements.aqi_NO_status.textContent = "Unhealthy";
        UIElements.aqi_NO_status_mobile.textContent = "Unhealthy";
        UIElements.aqi_NO_status.classList.add('aqi-forecast__status--unhealthy');
        UIElements.aqi_NO_status_mobile.classList.add('aqi-forecast__status--unhealthy');
    }
    else if (NO_VALUE > 1221.2 && NO_VALUE <= 2350.1) {
        UIElements.aqi_NO_status.textContent = "Very unhealthy";
        UIElements.aqi_NO_status_mobile.textContent = "Very unhealthy";
        UIElements.aqi_NO_status.classList.add('aqi-forecast__status--very-unhealthy');
        UIElements.aqi_NO_status_mobile.classList.add('aqi-forecast__status--very-unhealthy');
    }
    else {
        UIElements.aqi_NO_status.textContent = "Hazardous";
        UIElements.aqi_NO_status_mobile.textContent = "Hazardous";
        UIElements.aqi_NO_status.classList.add('aqi-forecast__status--hazardous');
        UIElements.aqi_NO_status_mobile.classList.add('aqi-forecast__status--hazardous');
    }

    let SO_VALUE = data.current.sulphur_dioxide;
    if (SO_VALUE >= 0 && SO_VALUE <= 92) {
        UIElements.aqi_SO_status.textContent = "Good";
        UIElements.aqi_SO_status_mobile.textContent = "Good";
        UIElements.aqi_SO_status.classList.add('aqi-forecast__status--good');
        UIElements.aqi_SO_status_mobile.classList.add('aqi-forecast__status--good');
    }
    else if (SO_VALUE > 92 && SO_VALUE <= 197) {
        UIElements.aqi_SO_status.textContent = "Moderate";
        UIElements.aqi_SO_status_mobile.textContent = "Moderate";
        UIElements.aqi_SO_status.classList.add('aqi-forecast__status--moderate');
        UIElements.aqi_SO_status_mobile.classList.add('aqi-forecast__status--moderate');
    }
    else if (SO_VALUE > 197 && SO_VALUE <= 484) {
        UIElements.aqi_SO_status.textContent = "Unhealthy for sensitive groups";
        UIElements.aqi_SO_status_mobile.textContent = "Unhealthy for sensitive groups";
        UIElements.aqi_SO_status.classList.add('aqi-forecast__status--unhealthy-sensitive');
        UIElements.aqi_SO_status_mobile.classList.add('aqi-forecast__status--unhealthy-sensitive');
    }
    else if (SO_VALUE > 484 && SO_VALUE <= 796) {
        UIElements.aqi_SO_status.textContent = "Unhealthy";
        UIElements.aqi_SO_status_mobile.textContent = "Unhealthy";
        UIElements.aqi_SO_status.classList.add('aqi-forecast__status--unhealthy');
        UIElements.aqi_SO_status_mobile.classList.add('aqi-forecast__status--unhealthy');
    }
    else if (SO_VALUE > 796 && SO_VALUE <= 1580) {
        UIElements.aqi_SO_status.textContent = "Very unhealthy";
        UIElements.aqi_SO_status_mobile.textContent = "Very unhealthy";
        UIElements.aqi_SO_status.classList.add('aqi-forecast__status--very-unhealthy');
        UIElements.aqi_SO_status_mobile.classList.add('aqi-forecast__status--very-unhealthy');
    }
    else {
        UIElements.aqi_SO_status.textContent = "Hazardous";
        UIElements.aqi_SO_status_mobile.textContent = "Hazardous";
        UIElements.aqi_SO_status.classList.add('aqi-forecast__status--hazardous');
        UIElements.aqi_SO_status_mobile.classList.add('aqi-forecast__status--hazardous');
    }

    let OZ_VALUE = data.current.ozone;
    if (OZ_VALUE >= 0 && OZ_VALUE <= 106) {
        UIElements.aqi_OZ_status.textContent = "Good";
        UIElements.aqi_OZ_status_mobile.textContent = "Good";
        UIElements.aqi_OZ_status.classList.add('aqi-forecast__status--good');
        UIElements.aqi_OZ_status_mobile.classList.add('aqi-forecast__status--good');
    }
    else if (OZ_VALUE > 106 && OZ_VALUE <= 137) {
        UIElements.aqi_OZ_status.textContent = "Moderate";
        UIElements.aqi_OZ_status_mobile.textContent = "Moderate";
        UIElements.aqi_OZ_status.classList.add('aqi-forecast__status--moderate');
        UIElements.aqi_OZ_status_mobile.classList.add('aqi-forecast__status--moderate');
    }
    else if (OZ_VALUE > 137 && OZ_VALUE <= 167) {
        UIElements.aqi_OZ_status.textContent = "Unhealthy for sensitive groups";
        UIElements.aqi_OZ_status_mobile.textContent = "Unhealthy for sensitive groups";
        UIElements.aqi_OZ_status.classList.add('aqi-forecast__status--unhealthy-sensitive');
        UIElements.aqi_OZ_status_mobile.classList.add('aqi-forecast__status--unhealthy-sensitive');
    }
    else if (OZ_VALUE > 167 && OZ_VALUE <= 206) {
        UIElements.aqi_OZ_status.textContent = "Unhealthy";
        UIElements.aqi_OZ_status_mobile.textContent = "Unhealthy";
        UIElements.aqi_OZ_status.classList.add('aqi-forecast__status--unhealthy');
        UIElements.aqi_OZ_status_mobile.classList.add('aqi-forecast__status--unhealthy');
    }
    else if (OZ_VALUE > 206 && OZ_VALUE <= 392) {
        UIElements.aqi_OZ_status.textContent = "Very unhealthy";
        UIElements.aqi_OZ_status_mobile.textContent = "Very unhealthy";
        UIElements.aqi_OZ_status.classList.add('aqi-forecast__status--very-unhealthy');
        UIElements.aqi_OZ_status_mobile.classList.add('aqi-forecast__status--very-unhealthy');
    }
    else {
        UIElements.aqi_OZ_status.textContent = "Hazardous";
        UIElements.aqi_OZ_status_mobile.textContent = "Hazardous";
        UIElements.aqi_OZ_status.classList.add('aqi-forecast__status--hazardous');
        UIElements.aqi_OZ_status_mobile.classList.add('aqi-forecast__status--hazardous');
    }


}

// recent searches functions

// update selected location - function
function updateSelectedLocation(item) {
    let selectedCityData = {
        id: item.id,
        name: item.name,
        country: item.country,
        latitude: item.latitude,
        longitude: item.longitude,
    }

    if (selectedCity.length >= 1) {
        selectedCity.shift();
    }

    selectedCity.push(selectedCityData);

    IsLocationSaved(selectedCityData.latitude, selectedCityData.longitude, selectedCityData.name, selectedCityData.country);
    saveState();
}

// update recent search - function
function updateRecentSearch(item, weatherData) {

    let recentLocation = {
        id: item.id,
        name: item.name,
        country: item.country,
        countryCode: item.country_code,
        latitude: item.latitude,
        longitude: item.longitude,
        temperature: weatherData.current.temperature_2m,
        weatherCode: weatherData.current.weather_code,
        cityCurrentTime: weatherData.current.time,
        cityCurrentSunriseTime: weatherData.daily.sunrise[0],
        cityCurrentSunsetTime: weatherData.daily.sunset[0]
    }

    // Checks for duplicate items, if present then don't add.
    const isDuplicate = recentSearchLocations.some(existing => existing.id === item.id);

    if (isDuplicate) {
        // If location is duplicate, then update the duplicate city data and render recent search and then return function. In this way the duplicate recent box will be update and no duplicate entry will be added.

        // find the exact duplicate row
        const existingLocation = recentSearchLocations.find(locationRow => locationRow.id === item.id);

        // update existing location data
        existingLocation.temperature = weatherData.current.temperature_2m;
        existingLocation.weatherCode = weatherData.current.weather_code;
        existingLocation.cityCurrentTime = weatherData.current.time;
        existingLocation.cityCurrentSunriseTime = weatherData.daily.sunrise[0];
        existingLocation.cityCurrentSunsetTime = weatherData.daily.sunset[0];

        // save state and re-render recent search and then return the function.
        saveState();
        renderRecentSearch();

        return;
    }

    if (recentSearchLocations.length >= RECENT_SEARCH_MAX_LENGTH) {
        recentSearchLocations.shift();
    }

    recentSearchLocations.push(recentLocation);
    UIElements.recentSearchClearnBtn.disabled = false;
    UIElements.recentSearchClearnBtn.style.cursor = 'pointer';

    renderRecentSearch();

    saveState();
}

// render recent search - function
function renderRecentSearch() {
    // update recent-search container based on the source of truth i.e. recentSearchLocations array

    UIElements.recentSearchContainer.innerHTML = '';

    if (recentSearchLocations.length === 0) {
        const recentSearchMessage = document.createElement('p');
        recentSearchMessage.textContent = "Currently NO recent searches. Kindly search any city!";
        recentSearchMessage.className = 'recent-search__message';
        UIElements.recentSearchContainer.append(recentSearchMessage);
        UIElements.recentSearchClearnBtn.disabled = true;
        UIElements.recentSearchClearnBtn.style.cursor = 'not-allowed';
    }

    recentSearchLocations.forEach((element, index) => {

        const recentSearchBox = document.createElement('div');
        recentSearchBox.className = 'recent-search__box';

        const weatherCode = element.weatherCode;
        const weatherIcon = getWeatherIcon(weatherCode, isItDayTime(element.cityCurrentTime, element.cityCurrentSunriseTime, element.cityCurrentSunsetTime));

        recentSearchBox.innerHTML = `

                    <div class="recent-search__info">

                        <img class="site_header__search-result-flag-value" src="https://flagsapi.com/${element.countryCode}/flat/32.png" alt="flag-icon">

                        <div class="recent-search__location">
                            <p class="recent-search__city">${element.name}</p>
                            <p class="recent-search__country">${element.country}</p>
                        </div>

                    </div>

                    <div class="recent-search__temperature">
                        <span class="recent-search__temperature-icon">
                            <img class="weather-icons weather-icons__recent-search" src="" alt="day-weather-icon">
                        </span>

                        <span class="recent-search__temperature-value">
                            ${formatTemperature(element.temperature)};
                        </span>
                    </div>

                `;

        const recentSearchWeatherIcon = recentSearchBox.querySelector('.weather-icons__recent-search');
        recentSearchWeatherIcon.src = `./Assets/Icons/weather icons/${weatherIcon}`;
        UIElements.recentSearchContainer.prepend(recentSearchBox);

        recentSearchBox.addEventListener(('click'), async (e) => {
            try {
                setAppLoading(true);
                const requestToken = ++locationRequestToken;

                const weatherResult = await cityWeather(element.latitude, element.longitude, false);

                if (!weatherResult) {
                    return;
                }

                const { weatherData } = weatherResult;
                const aqiData = await cityAQI(element.latitude, element.longitude, false);

                if (requestToken !== locationRequestToken) {
                    return;
                }

                // updates the UI after checking requestToken matches
                currentWeatherData = weatherData;

                sunriseTime = weatherData.daily.sunrise[0];
                sunsetTime = weatherData.daily.sunset[0];
                currentTime = weatherData.current.time;

                updateWeatherUI(weatherData);
                sunAnimation(sunriseTime, sunsetTime, currentTime);
                updateLocationName(element.name, element.country);
                updateHourlyForecast(weatherData);
                updateDaysForecast(weatherData);
                updateWeatherAQI(aqiData);

                updateSelectedLocation(element);
                IsLocationSaved(element.latitude, element.longitude, element.name, element.country);

                // clicked recent-search city data update
                const currentElementId = element.id;
                const recentSearchLocationUpdateRow = recentSearchLocations.find(row => row.id === currentElementId);

                recentSearchLocationUpdateRow.temperature = weatherData.current.temperature_2m;
                recentSearchLocationUpdateRow.weatherCode = weatherData.current.weather_code;

                saveState();
                renderRecentSearch();

                scrollUp();
            }
            catch (error) {
                console.error("Error occurred while fetching weather data for recent search:", error);
            }
            finally {
                setAppLoading(false);
            }
        })

    });


}

// current location function
const renderCurrentLocation = (currentLocation) => {

    const weatherCode = currentLocation.weatherCode;
    const weatherIcon = getWeatherIcon(weatherCode, isItDayTime(currentLocation.cityCurrentTime, currentLocation.cityCurrentSunriseTime, currentLocation.cityCurrentSunsetTime));

    UIElements.currentLocationCity.forEach(locationCity => {
        locationCity.textContent = currentLocation.name;
    });
    UIElements.currentLocationCountry.forEach(locationCountry => {
        locationCountry.textContent = currentLocation.country;
    });
    UIElements.currentLocationTempValue.forEach(locationTempValue => {
        locationTempValue.innerHTML = formatTemperature(currentLocation.temperature);
    });
    UIElements.currentLocationWeatherIcon.forEach(locationWeatherIcon => {
        locationWeatherIcon.src = `./Assets/Icons/weather icons/${weatherIcon}`;
    });

}

UIElements.currentLocationBox.forEach(currentLocationBox => {

    currentLocationBox.addEventListener('click', async () => {

        try {
            setAppLoading(true);

            const weatherResult = await cityWeather(currentLocation.latitude, currentLocation.longitude);

            if (!weatherResult) {
                return;
            }

            const { weatherData } = weatherResult;
            await cityAQI(currentLocation.latitude, currentLocation.longitude);
            updateSelectedLocation(currentLocation);
            // using savedLocation in 'IsLocationSaved' because updateSelectedLocation is already updated and now selectedCity contains currentLocation data.
            IsLocationSaved(selectedCity[0].latitude, selectedCity[0].longitude, selectedCity[0].name, selectedCity[0].country);

            updateLocationName(currentLocation.name, currentLocation.country);
            closeLocation();
            UIElements.backgroundOverlay.style.display = 'none';
            UIElements.mobileSiteHeader.style.display = 'none';
            scrollUp();
        }
        catch (error) {
            console.error("Error occurred while fetching weather data for current location:", error);
        }
        finally {
            setAppLoading(false);
        }
    });
})

// save location functions

// update saved locations - function
function updateSavedLocation(locationData, weatherData) {

    let savedCityData = {
        id: locationData.id || `${locationData.latitude}-${locationData.longitude}`,
        name: locationData.name,
        country: locationData.country,
        countryCode: locationData.country_code || locationData.countryCode,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        temperature: weatherData.current.temperature_2m,
        weatherCode: weatherData.current.weather_code,
        cityCurrentTime: weatherData.current.time,
        cityCurrentSunriseTime: weatherData.daily.sunrise[0],
        cityCurrentSunsetTime: weatherData.daily.sunset[0]
    }

    const isDuplicate = savedLocations.some(element => element.latitude === savedCityData.latitude && element.longitude === savedCityData.longitude || (element.name === savedCityData.name && element.country === savedCityData.country));

    if (isDuplicate) {
        savedLocations = savedLocations.filter(
            thisElement =>
                !(
                    thisElement.latitude === savedCityData.latitude &&
                    thisElement.longitude === savedCityData.longitude ||
                    (thisElement.name === savedCityData.name && thisElement.country === savedCityData.country)
                )
        );

        // show notification after location is removed
        showAppStatus(`${savedCityData.name}, ${savedCityData.country} removed from your locations.`, "success");
    }
    else {
        savedLocations.push(savedCityData);

        // show notification after location is saved
        showAppStatus(`${savedCityData.name}, ${savedCityData.country} saved to your locations.`, "success");

        UIElements.clearAllSavedLocationsBtn.disabled = false;
        UIElements.clearAllSavedLocationsBtn.style.cursor = 'pointer';
    }

    renderSavedLocation();

    saveState();
}


// render saved locations - function
function renderSavedLocation() {
    UIElements.manageLocationList.innerHTML = "";

    if (savedLocations.length === 0) {
        const noSavedLocationMessage = document.createElement('p');
        noSavedLocationMessage.className = 'manage-locations__message';
        noSavedLocationMessage.textContent = "Currently NO saved locations. Please save some!";
        UIElements.manageLocationList.append(noSavedLocationMessage);
        UIElements.clearAllSavedLocationsBtn.disabled = true;
        UIElements.clearAllSavedLocationsBtn.style.cursor = 'not-allowed';
    }

    savedLocations.forEach((element) => {

        const weatherCode = element.weatherCode;
        const weatherIcon = getWeatherIcon(weatherCode, isItDayTime(element.cityCurrentTime, element.cityCurrentSunriseTime, element.cityCurrentSunsetTime));

        const savedLocationItem = document.createElement('div');
        savedLocationItem.className = 'manage-locations__item manage-locations__item--saved';

        savedLocationItem.innerHTML = `

                        <div class="manage-locations__place-info manage-locations__place-info--saved">

                            <img class="weather-icons weather-icons__saved-locations" src="" alt="location-weather-icon">

                            <div class="manage-locations__place manage-locations__place--saved">
                                <h3 class="manage-locations__city manage-locations__city--saved">${element.name}</h3>
                                <p
                                    class="manage-locations__country manage-locations__country--saved model-header-tagline">
                                    ${element.country}
                                </p>
                            </div>

                        </div>

                        <div class="manage-locations__temperature manage-locations__temperature--saved">

                            <p class="manage-locations__temperature-value manage-locations__temperature-value--saved">
                                ${formatTemperature(element.temperature)}</p>

                            <img class="generic-icons generic-icons__trash manage-locations__delete-button" src="./Assets/Icons/generic icons/trash.svg" alt="trash-icon">

                        </div>`

        const savedLocationsWeatherIcon = savedLocationItem.querySelector('.weather-icons__saved-locations');
        savedLocationsWeatherIcon.src = `./Assets/Icons/weather icons/${weatherIcon}`;

        UIElements.manageLocationList.prepend(savedLocationItem);

        savedLocationItem.addEventListener('click', async () => {
            const requestToken = ++locationRequestToken;

            try {
                setAppLoading(true);
                const weatherResult = await cityWeather(element.latitude, element.longitude, false);

                if (!weatherResult) {
                    return;
                }

                const { weatherData } = weatherResult;
                const aqiData = await cityAQI(element.latitude, element.longitude, false);

                if (requestToken !== locationRequestToken) {
                    return;
                }

                currentWeatherData = weatherData;

                sunriseTime = weatherData.daily.sunrise[0];
                sunsetTime = weatherData.daily.sunset[0];
                currentTime = weatherData.current.time;

                updateWeatherUI(weatherData);
                sunAnimation(sunriseTime, sunsetTime, currentTime);
                updateLocationName(element.name, element.country);
                updateHourlyForecast(weatherData);
                updateDaysForecast(weatherData);
                updateWeatherAQI(aqiData);

                updateSelectedLocation(element);
                IsLocationSaved(element.latitude, element.longitude, element.name, element.country);

                // clicked saved-location city data update
                const currentElementId = element.id;
                const savedLocationUpdateRow = savedLocations.find(savedLocation => savedLocation.id === currentElementId);

                savedLocationUpdateRow.temperature = weatherData.current.temperature_2m;
                savedLocationUpdateRow.weatherCode = weatherData.current.weather_code;

                UIElements.locationContainer.style.display = 'none';
                UIElements.secondBgOverlay.style.display = 'none';
                UIElements.mobileSiteHeader.style.display = 'none';
                UIElements.backgroundOverlay.style.display = 'none';

                saveState();
                renderSavedLocation();

                scrollUp();
            }
            catch (error) {
                console.error("Error occurred while fetching weather data for saved location:", error);
            }
            finally {
                if (requestToken === locationRequestToken) {
                    setAppLoading(false);
                }
            }
        });

        const savedLocationDeleteBtn = savedLocationItem.querySelector('.manage-locations__delete-button');

        savedLocationDeleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            locationToDeleteId = element.id;
            locationToDeleteLatitude = element.latitude;
            locationToDeleteLongitude = element.longitude;
            locationToDeleteName = element.name;
            locationToDeleteCountry = element.country;

            UIElements.thirdBgOverlay.style.display = 'flex';
            UIElements.deleteSaveLocationPopup.style.display = 'block';
        });

    });

}


// All event listeners

// Search event listeners
UIElements.clearSearchBtn.forEach((clearBtn) => {
    clearBtn.addEventListener(('click'), () => {

        // fixed the race condition when clear button in search bar is clicked.
        searchRequestToken++;

        UIElements.searchBar.forEach((search) => {
            search.value = "";
            search.focus();
        });

        [UIElements.searchResultBox, UIElements.searchResultBoxMobile, UIElements.searchResultBoxLocation].forEach((boxes) => boxes.style.display = 'none');

    })
})

UIElements.searchResultRow.forEach((row) => {

    row.addEventListener(('click'), async (e) => {
        const requestToken = ++locationRequestToken;
        setWeatherLoading(true);

        // Hide the search result box, after clicking any box and clearing input
        if (UIElements.searchResultBox) UIElements.searchResultBox.style.display = 'none';
        if (UIElements.searchResultBoxMobile) UIElements.searchResultBoxMobile.style.display = 'none';
        if (UIElements.searchResultBoxLocation) UIElements.searchResultBoxLocation.style.display = 'none';

        const clickedLocation = getSearchResultForRow(row);
        if (!clickedLocation) {
            setWeatherLoading(false);
            return;
        }

        try {

            // Calling weather and AQI APIs and recent search functions
            const weatherResult = await cityWeather(clickedLocation.latitude, clickedLocation.longitude, false);

            if (!weatherResult) {
                setWeatherLoading(false);
                return;
            }

            const { weatherData } = weatherResult;

            const aqiData = await cityAQI(clickedLocation.latitude, clickedLocation.longitude, false);

            if (requestToken !== locationRequestToken) {
                return;
            }

            // updating the UI

            currentWeatherData = weatherData;

            sunriseTime = weatherData.daily.sunrise[0];
            sunsetTime = weatherData.daily.sunset[0];
            currentTime = weatherData.current.time;

            updateWeatherUI(weatherData);
            sunAnimation(sunriseTime, sunsetTime, currentTime);
            updateLocationName(clickedLocation.name, clickedLocation.country)
            updateHourlyForecast(weatherData);
            updateDaysForecast(weatherData);
            updateWeatherAQI(aqiData);

            updateRecentSearch(clickedLocation, weatherData);
            updateSelectedLocation(clickedLocation);
            IsLocationSaved(clickedLocation.latitude, clickedLocation.longitude, clickedLocation.name, clickedLocation.country);

            // clearing old search value
            UIElements.searchBar.forEach((search) => search.value = "");

            saveState();
            scrollUp();
        }
        catch (error) {
            console.error("Error occurred while fetching weather data for search result:", error);
        }
        finally {
            if (requestToken === locationRequestToken) {
                setWeatherLoading(false);
            }
        }
    })
})

UIElements.searchResultRowMobile.forEach((rowMobile) => {

    rowMobile.addEventListener(('click'), async () => {
        const requestToken = ++locationRequestToken;
        setAppLoading(true);

        if (UIElements.searchResultBox) UIElements.searchResultBox.style.display = 'none';
        if (UIElements.searchResultBoxMobile) UIElements.searchResultBoxMobile.style.display = 'none';
        if (UIElements.searchResultBoxLocation) UIElements.searchResultBoxLocation.style.display = 'none';

        const clickedLocation = getSearchResultForRow(rowMobile);
        if (!clickedLocation) {
            setAppLoading(false);
            return;
        }

        try {

            // Calling weather and AQI APIs and recent search functions
            const weatherResult = await cityWeather(clickedLocation.latitude, clickedLocation.longitude, false);

            if (!weatherResult) {
                return;
            }

            const { weatherData } = weatherResult;

            const aqiData = await cityAQI(clickedLocation.latitude, clickedLocation.longitude, false);

            if (requestToken !== locationRequestToken) {
                return;
            }

            // updating the UI

            currentWeatherData = weatherData;

            sunriseTime = weatherData.daily.sunrise[0];
            sunsetTime = weatherData.daily.sunset[0];
            currentTime = weatherData.current.time;

            updateWeatherUI(weatherData);
            sunAnimation(sunriseTime, sunsetTime, currentTime);
            updateLocationName(clickedLocation.name, clickedLocation.country)
            updateHourlyForecast(weatherData);
            updateDaysForecast(weatherData);
            updateWeatherAQI(aqiData);

            updateRecentSearch(clickedLocation, weatherData);
            updateSelectedLocation(clickedLocation);

            IsLocationSaved(clickedLocation.latitude, clickedLocation.longitude, clickedLocation.name, clickedLocation.country);

            UIElements.mobileSiteHeader.style.display = 'none';
            UIElements.backgroundOverlay.style.display = 'none';

            // // clearing old search value
            UIElements.searchBar.forEach((search) => search.value = "");

            saveState();
            scrollUp();
        }
        catch (error) {
            console.error("Error occurred while fetching weather data for search result:", error);
        }
        finally {
            if (requestToken === locationRequestToken) {
                setAppLoading(false);
            }
        }
    })

})

UIElements.searchResultRowLocation.forEach((rowLocation) => {

    rowLocation.addEventListener(('click'), async () => {
        const requestToken = ++locationRequestToken;
        setAppLoading(true);

        if (UIElements.searchResultBox) UIElements.searchResultBox.style.display = 'none';
        if (UIElements.searchResultBoxMobile) UIElements.searchResultBoxMobile.style.display = 'none';
        if (UIElements.searchResultBoxLocation) UIElements.searchResultBoxLocation.style.display = 'none';

        const clickedLocation = getSearchResultForRow(rowLocation);
        if (!clickedLocation) {
            setAppLoading(false);
            return;
        }

        try {

            // Calling weather and AQI APIs and recent search functions
            const weatherResult = await cityWeather(clickedLocation.latitude, clickedLocation.longitude, false);

            if (!weatherResult) {
                return;
            }

            const { weatherData } = weatherResult;
            const aqiData = await cityAQI(clickedLocation.latitude, clickedLocation.longitude, false);

            if (requestToken !== locationRequestToken) {
                return;
            }

            // updating the UI

            currentWeatherData = weatherData;

            sunriseTime = weatherData.daily.sunrise[0];
            sunsetTime = weatherData.daily.sunset[0];
            currentTime = weatherData.current.time;

            updateWeatherUI(weatherData);
            sunAnimation(sunriseTime, sunsetTime, currentTime);
            updateLocationName(clickedLocation.name, clickedLocation.country)
            updateHourlyForecast(weatherData);
            updateDaysForecast(weatherData);
            updateWeatherAQI(aqiData);

            updateRecentSearch(clickedLocation, weatherData);
            updateSelectedLocation(clickedLocation);

            IsLocationSaved(clickedLocation.latitude, clickedLocation.longitude, clickedLocation.name, clickedLocation.country);

            UIElements.locationContainer.style.display = 'none';
            UIElements.secondBgOverlay.style.display = 'none';
            UIElements.mobileSiteHeader.style.display = 'none';
            UIElements.backgroundOverlay.style.display = 'none';

            // // clearing old search value
            UIElements.searchBar.forEach((search) => search.value = "");

            saveState();
            scrollUp();
        }
        catch (error) {
            console.error("Error occurred while fetching weather data for search result:", error);
        }
        finally {
            if (requestToken === locationRequestToken) {
                setAppLoading(false);
            }
        }
    })


})


// recent search event listeners
UIElements.recentSearchDeleteConfirmationBtn.addEventListener(('click'), () => {

    recentSearchLocations.length = 0;

    setTimeout(() => {
        UIElements.clearallRecentSearchPopup.style.display = 'none';
        UIElements.thirdBgOverlay.style.display = 'none';
        renderRecentSearch();
        saveState();

        // show notification that all recent search locations deleted
        showAppStatus("Recent searches cleared.", "success");
    }, 200);

})


// save location event listener
const allSaveLocationBtns = [...UIElements.desktopSaveLocationBtns, ...UIElements.mobileSaveLocationBtns, ...UIElements.locationSaveLocationBtn];
allSaveLocationBtns.forEach((saveLocationBtn) => {

    saveLocationBtn.addEventListener('click', async (e) => {
        e.stopPropagation();

        try {
            const targetLocationID = e.currentTarget.dataset.locationID;
            const clickedLocation = currentSearchData?.results?.find(
                city => String(city.id) === targetLocationID
            );

            if (!clickedLocation) {
                return;
            }

            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${clickedLocation.latitude}&longitude=${clickedLocation.longitude}&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto`);

            if (!response.ok) {
                const error = new Error("Failed to fetch weather for this location");
                error.status = response.status;
                throw error;
            }

            const weatherData = await response.json();

            updateSavedLocation(clickedLocation, weatherData);
            updateStarState(saveLocationBtn, clickedLocation.latitude, clickedLocation.longitude, clickedLocation.name, clickedLocation.country);

            const selectedLocation = selectedCity[0];
            const isSelectedLocation = selectedLocation && ((selectedLocation.id && clickedLocation.id && String(selectedLocation.id) === String(clickedLocation.id)) || (selectedLocation.latitude === clickedLocation.latitude && selectedLocation.longitude === clickedLocation.longitude) || (selectedLocation.name === clickedLocation.name && selectedLocation.country === clickedLocation.country));

            if (isSelectedLocation) {
                IsLocationSaved(
                    selectedLocation.latitude,
                    selectedLocation.longitude,
                    selectedLocation.name,
                    selectedLocation.country
                );
            }

            saveState();
        }

        catch (error) {
            console.error(error);
            getErrorMessage(error);
        }

    })

})

UIElements.deleteSavedLocationConfirmationBtn.addEventListener('click', () => {

    savedLocations = savedLocations.filter(location => location.id !== locationToDeleteId);
    IsLocationSaved(selectedCity[0].latitude, selectedCity[0].longitude, selectedCity[0].name, selectedCity[0].country);
    UIElements.deleteSaveLocationPopup.style.display = 'none';
    UIElements.thirdBgOverlay.style.display = 'none';

    renderSavedLocation();
    saveState();

    // show notification if any location is deleted
    showAppStatus(`${locationToDeleteName}, ${locationToDeleteCountry} location deleted.`, "success");

})

UIElements.clearAllSavedLocationConfirmationBtn.addEventListener('click', () => {

    savedLocations.length = 0;
    IsLocationSaved();
    setTimeout(() => {
        UIElements.clearallSavedLocationsPopup.style.display = 'none';
        UIElements.thirdBgOverlay.style.display = 'none';
        renderSavedLocation();
        saveState();

        // show notification if all saved locations are cleared.
        showAppStatus("All saved locations cleared.", "success");
    }, 200);

})

function renderSettingsButtons() {
    // if condition is true then buttons will have checked class otherwise not

    UIElements.clock12HourSettingsBtn.checked = (timeFormat === "12h");
    UIElements.clock24HourSettingsBtn.checked = (timeFormat === "24h");

    UIElements.tempCelciusSettingsBtn.checked = (temFormat === "C");
    UIElements.tempFahSettingsBtn.checked = (temFormat === "F");

    UIElements.windSpeedKMPHSettingsBtn.checked = (windFormat === "kmph");
    UIElements.windSpeedMPHSettingsBtn.checked = (windFormat === "mph");

    UIElements.pressureHPASettingsBtn.checked = (pressureFormat === "hPa");
    UIElements.pressureMMHGSettingsBtn.checked = (pressureFormat === "mmHg");
    UIElements.themeAutoSettingsBtn.checked = (themeMode === "auto");
    UIElements.themeLightSettingsBtn.checked = (themeMode === "light");
    UIElements.themeDarkSettingsBtn.checked = (themeMode === "dark");
    if (UIElements.footerThemeBtn) {
        UIElements.footerThemeBtn.value = themeMode;
    }
}

// settings elements event listeners
function updateUI() {
    // Settings can change before the first weather response; defer weather-dependent rendering until data exists.
    if (!currentWeatherData) {
        renderSettingsButtons();
        return;
    }

    updateWeatherUI(currentWeatherData);
    updateHourlyForecast(currentWeatherData);
    updateDaysForecast(currentWeatherData);
    if (currentLocation) {
        renderCurrentLocation(currentLocation);
    }
    renderRecentSearch();
    renderSavedLocation();
    renderSettingsButtons()
}

function selectTheme(mode) {
    themeMode = mode;
    if (currentWeatherData) {
        updateWeatherUI(currentWeatherData);
    } else {
        // means if mode = "auto" then apply "light" otherwise mode (light or dark);
        document.body.dataset.themeMode = mode === "auto" ? "light" : mode;
    }
    renderSettingsButtons();
    saveState();
}

UIElements.themeAutoSettingsBtn.addEventListener('click', () => {
    selectTheme("auto");

    // show notification when theme is updated
    showAppStatus("Theme changed to auto mode", "info");
});

UIElements.themeLightSettingsBtn.addEventListener('click', () => {
    selectTheme("light");

    // show notification when theme is updated
    showAppStatus("Theme changed to light mode", "info");
});

UIElements.themeDarkSettingsBtn.addEventListener('click', () => {
    selectTheme("dark");

    // show notification when theme is updated
    showAppStatus("Theme changed to dark mode", "info");
});

UIElements.footerThemeBtn?.addEventListener('change', (event) => {
    selectTheme(event.target.value);

    // show notification when theme is updated
    showAppStatus(`Theme changed to ${event.target.value} mode`, "info");
});

UIElements.clock12HourSettingsBtn.addEventListener('click', () => {
    timeFormat = "12h";
    updateUI();
    saveState();

    // show notification when settings go updated
    showAppStatus("Time format changed to 12-hour", "info");
});

UIElements.clock24HourSettingsBtn.addEventListener('click', () => {
    timeFormat = "24h";
    updateUI();
    saveState();

    // show notification when settings go updated
    showAppStatus("Time format changed to 24-hour", "info");
});

UIElements.tempCelciusSettingsBtn.addEventListener('click', () => {
    temFormat = "C";
    updateUI();
    saveState();

    // show notification when settings go updated
    showAppStatus("Temperature format changed to degree celcius", "info");
});

UIElements.tempFahSettingsBtn.addEventListener('click', () => {
    temFormat = "F";
    updateUI();
    saveState();

    // show notification when settings go updated
    showAppStatus("Temperature format changed to degree fahrenheit", "info");
});

UIElements.windSpeedKMPHSettingsBtn.addEventListener('click', () => {
    windFormat = "kmph";
    updateUI();
    saveState();

    // show notification when settings go updated
    showAppStatus("Wind speed changed to km/h", "info");
});

UIElements.windSpeedMPHSettingsBtn.addEventListener('click', () => {
    windFormat = "mph";
    updateUI();
    saveState();

    // show notification when settings go updated
    showAppStatus("Wind speed changed to mph", "info");
});

UIElements.pressureHPASettingsBtn.addEventListener('click', () => {
    pressureFormat = "hPa";
    updateUI();
    saveState();

    // show notification when settings go updated
    showAppStatus("Pressure unit changed to hPa", "info");
});

UIElements.pressureMMHGSettingsBtn.addEventListener('click', () => {
    pressureFormat = "mmHg";
    updateUI();
    saveState();

    // show notification when settings go updated
    showAppStatus("Pressure unit changed to mmHg", "info");
});


async function updateRecentSearchData() {

    await Promise.all(
        recentSearchLocations.map(async (element) => {

            try {
                let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${element.latitude}&longitude=${element.longitude}&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto`);

                if (!response.ok) {
                    const error = new Error("Failed to fetch latest recent-searched locations data");
                    error.status = response.status;
                    throw error;
                }

                let data = await response.json();
                element.temperature = data.current.temperature_2m;
                element.weatherCode = data.current.weather_code;
                element.cityCurrentTime = data.current.time;
                element.cityCurrentSunriseTime = data.daily.sunrise[0];
                element.cityCurrentSunsetTime = data.daily.sunset[0];

            } catch (error) {
                getErrorMessage(error);
                console.log("Failed to fetch latest recent-searched locations data");
            }

        })
    )

    saveState();

}

async function updateSavedLocationData() {

    await Promise.all(
        savedLocations.map(async (element) => {

            try {
                let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${element.latitude}&longitude=${element.longitude}&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto`);

                if (!response.ok) {
                    const error = new Error("Failed to fetch latest saved locations data");
                    error.status = response.status;
                    throw error;
                }

                let data = await response.json();
                element.temperature = data.current.temperature_2m;
                element.weatherCode = data.current.weather_code;
                element.cityCurrentTime = data.current.time;
                element.cityCurrentSunriseTime = data.daily.sunrise[0];
                element.cityCurrentSunsetTime = data.daily.sunset[0];

            } catch (error) {
                getErrorMessage(error);
                console.log("Failed to fetch latest saved locations data");
            }


        })
    )
    saveState();

}

// hero-section save location status and refresh button logic

function IsLocationSaved(locationLatitude, locationLongitude, cityName, cityCountry) {

    // No target passed → just show "Save Location"
    if (locationLatitude === undefined || locationLongitude === undefined) {
        UIElements.savelocationStatusBtn.textContent = "Save Location";
        UIElements.savelocationStatusBtn.style.backgroundColor = '#E5F2FF';
        UIElements.savelocationStatusBtn.style.color = '#000';
        UIElements.savelocationStatusBtn.disabled = false;
        UIElements.savelocationStatusBtn.style.cursor = 'pointer';
        return;
    }

    // targetID = parseInt(locationLatitude);
    const isPresent = savedLocations.some(location => location.latitude === locationLatitude && location.longitude === locationLongitude);

    const isCityPresent = savedLocations.some(location => location.name === cityName && location.country === cityCountry);

    if (isPresent || isCityPresent) {
        UIElements.savelocationStatusBtn.textContent = "Already Saved";
        UIElements.savelocationStatusBtn.style.color = '#ffffff';
        UIElements.savelocationStatusBtn.style.backgroundColor = '#5e55e0';
        UIElements.savelocationStatusBtn.disabled = true;
        UIElements.savelocationStatusBtn.style.cursor = 'not-allowed';
    }
    else {
        UIElements.savelocationStatusBtn.textContent = "Save Location";
        UIElements.savelocationStatusBtn.style.backgroundColor = '#E5F2FF';
        UIElements.savelocationStatusBtn.style.color = '#000';
        UIElements.savelocationStatusBtn.style.backgroundColor = '#E5F2FF';
        UIElements.savelocationStatusBtn.disabled = false;
        UIElements.savelocationStatusBtn.style.cursor = 'pointer';
    }

}

UIElements.savelocationStatusBtn.addEventListener('click', async () => {

    // hide the search result and clear the search bar value after clicking save location button
    UIElements.searchBar.forEach((search) => search.value = "");
    if (UIElements.searchResultBox) UIElements.searchResultBox.style.display = 'none';
    if (UIElements.searchResultBoxMobile) UIElements.searchResultBoxMobile.style.display = 'none';
    if (UIElements.searchResultBoxLocation) UIElements.searchResultBoxLocation.style.display = 'none';

    const locationToSaveData = {
        id: `${selectedCity[0].latitude}-${selectedCity[0].longitude}`,
        name: selectedCity[0].name,
        country: selectedCity[0].country,
        latitude: selectedCity[0].latitude,
        longitude: selectedCity[0].longitude,
    }

    try {

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${locationToSaveData.latitude}&longitude=${locationToSaveData.longitude}&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto`);

        if (!response.ok) {
            const error = new Error("Failed to fetch weather for this location and unable to add to saved location");
            error.status = response.status;
            throw error;
        }

        const weatherData = await response.json();

        updateSavedLocation(locationToSaveData, weatherData);
        IsLocationSaved(locationToSaveData.latitude, locationToSaveData.longitude, locationToSaveData.name, locationToSaveData.country);
        saveState();

        // show notification that location is saved
        showAppStatus(`${locationToSaveData.name}, ${locationToSaveData.country} saved to your locations.`, "success");
    }

    catch (error) {
        console.error(error);
        getErrorMessage(error);
    }

})

UIElements.dataRefreshBtn.addEventListener('click', async () => {

    // Refresh requires a resolved location; avoid reading coordinates before initial loading finishes.
    if (!selectedCity[0]) {
        showAppStatus("Weather location is still loading. Please try again shortly.", "info");
        return;
    }

    setRefreshLoading(true);
    try {

        const { weatherData } = await cityWeather(selectedCity[0].latitude, selectedCity[0].longitude, true);
        await cityAQI(selectedCity[0].latitude, selectedCity[0].longitude, true);
        await updateRecentSearchData();
        await updateSavedLocationData();

        navigator.geolocation.getCurrentPosition(success, error, options);

        renderRecentSearch();
        renderSavedLocation();
        showAppStatus("Successfully updated latest data", "info");

    } catch (error) {
        // getErrorMessage already shows the appropriate offline, rate-limit, or service error.
        getErrorMessage(error);
    }
    finally {
        setRefreshLoading(false);
    }


})