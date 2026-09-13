console.log("Welcome to Breezely weather app");

// HTML Elements
UIElements.scrollUpBtn.title = "Scroll to top";

function openSettings() {
    UIElements.secondBgOverlay.style.display = 'flex';
    UIElements.settingsContainer.style.display = 'flex';
}

function closeSettings() {
    UIElements.settingsContainer.style.display = 'none';
    UIElements.secondBgOverlay.style.display = 'none';
}

function openLocation() {
    UIElements.secondBgOverlay.style.display = 'flex';
    UIElements.locationContainer.style.display = 'flex';
    [UIElements.searchResultBox, UIElements.searchResultBoxMobile, UIElements.searchResultBoxLocation].forEach((boxes) => boxes.style.display = 'none');
}

function closeLocation() {
    UIElements.locationContainer.style.display = 'none';
    UIElements.secondBgOverlay.style.display = 'none';
    [UIElements.searchResultBox, UIElements.searchResultBoxMobile, UIElements.searchResultBoxLocation].forEach((boxes) => boxes.style.display = 'none');
    UIElements.searchBar.forEach((search) => {
        search.value = "";
    });
}

function scrollUp() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

UIElements.settingsBtn.addEventListener('click', () => {
    openSettings();
});

const closeSettingsElements = [UIElements.settingsCloseBtn, UIElements.settingsCloseIcon];

closeSettingsElements.forEach((elements) => {
    elements.addEventListener('click', () => {
        closeSettings();
    })
});

UIElements.myLocationBtn.addEventListener('click', () => {
    openLocation();
});

UIElements.locationCloseIcon.addEventListener('click', () => {
    closeLocation();
});

UIElements.clearallLocationBtn.addEventListener('click', () => {
    UIElements.thirdBgOverlay.style.display = 'flex';
    UIElements.clearallSavedLocationsPopup.style.display = 'block';
});

UIElements.popupCloseIcons.forEach((popupCloseIcons) => {
    popupCloseIcons.addEventListener('click', () => {
        UIElements.deleteSaveLocationPopup.style.display = 'none';
        UIElements.clearallSavedLocationsPopup.style.display = 'none';
        UIElements.clearallRecentSearchPopup.style.display = 'none';
        UIElements.thirdBgOverlay.style.display = 'none';
    })
});

UIElements.popupCloseBtns.forEach((popupCloseBtns) => {
    popupCloseBtns.addEventListener('click', () => {
        UIElements.deleteSaveLocationPopup.style.display = 'none';
        UIElements.clearallSavedLocationsPopup.style.display = 'none';
        UIElements.clearallRecentSearchPopup.style.display = 'none';
        UIElements.thirdBgOverlay.style.display = 'none';
    })
});


UIElements.hamburgerIcon.addEventListener('click', () => {
    UIElements.mobileSiteHeader.style.display = 'flex';
    UIElements.backgroundOverlay.style.display = 'flex';
    setTimeout(() => {
        UIElements.mobileSiteHeader.classList.add('is-open');
    }, 0);
});

UIElements.mobileSiteHeaderCloseBtn.addEventListener('click', () => {
    UIElements.backgroundOverlay.style.display = 'none';
    UIElements.mobileSiteHeader.classList.remove('is-open');
    UIElements.mobileSiteHeader.addEventListener('transitionend', (event) => {
        if (event.propertyName === 'transform' && !UIElements.mobileSiteHeader.classList.contains('is-open')) {
            UIElements.mobileSiteHeader.style.display = 'none';
        }
    }, { once: true });
    [UIElements.searchResultBox, UIElements.searchResultBoxMobile, UIElements.searchResultBoxLocation].forEach((boxes) => boxes.style.display = 'none');
    UIElements.searchBar.forEach((search) => {
        search.value = "";
    });
});

UIElements.mobileSiteHeaderSetttings.addEventListener('click', () => {
    openSettings();
});

UIElements.mobileSiteHeaderlocation.addEventListener('click', () => {
    openLocation();
});

UIElements.recentsearchClearBtn.addEventListener('click', () => {
    UIElements.clearallRecentSearchPopup.style.display = 'block';
    UIElements.thirdBgOverlay.style.display = 'block';
});

UIElements.scrollUpBtn.addEventListener(('click'), () => {

    scrollUp();

})

// window scroll logic, if hero section is NOT visible in viewport show scrollTopBtn : Hide.
window.addEventListener('scroll', () => {

    const heroBottom = UIElements.heroSection.getBoundingClientRect().bottom;

    if (heroBottom <= 0) {
        UIElements.scrollUpBtn.classList.add('show');
        UIElements.feedbackBtn.classList.add('show');
    }
    else {
        UIElements.scrollUpBtn.classList.remove('show');
        UIElements.feedbackBtn.classList.remove('show');
    }

});

// event listener on escape button to close modals.

const deleteSaveLocationPopup = document.getElementById('delete-save-location-popup');
const clearAllSavedLocationPopup = document.getElementById('clearall-saved-locations-popup');

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {

        if ((UIElements.locationContainer.style.display === 'flex') && (deleteSaveLocationPopup.style.display === 'block')) {
            UIElements.deleteSaveLocationPopup.style.display = 'none';
            UIElements.thirdBgOverlay.style.display = 'none';
            UIElements.locationContainer.style.display = 'flex';
        }
        else if ((UIElements.locationContainer.style.display === 'flex') && (clearAllSavedLocationPopup.style.display === 'block')) {
            UIElements.clearallSavedLocationsPopup.style.display = 'none';
            UIElements.thirdBgOverlay.style.display = 'none';
            UIElements.locationContainer.style.display = 'flex';
        }
        else {
            closeSettings();
            closeLocation();
            UIElements.thirdBgOverlay.style.display = 'none';
            UIElements.clearallSavedLocationsPopup.style.display = 'none';
            UIElements.clearallRecentSearchPopup.style.display = 'none';
        }
    }
});