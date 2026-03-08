/*
 * app.js - custom JavaScript for Holiday Finder
 * ----------------------------------------------------
 * Manages search behavior, destination cards, navbar highlighting,
 * Google Maps embedding, and other interactive features.
 *
 * Attribution: basic DOM DOM manipulation patterns adapted from MDN docs.
 */

// -----------------------------------------------------------------------------
// Utility helpers
// -----------------------------------------------------------------------------

// populate a datalist element with suggestion options
function populateSuggestions(list) {
    const data = document.getElementById('citySuggestions');
    if (!data) return;
    data.innerHTML = '';
    list.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        data.appendChild(opt);
    });
}

// shared list of example cities used for both destinations and autocomplete
const sampleCities = [
    'Paris',
    'New York',
    'Tokyo',
    'Barcelona',
    'Sydney',
    'Rome',
    'London',
    'Rio de Janeiro',
    'Madrid',
];

// track the original city entered by the user so we can always display links
// like "Museum in Paris" even after the query string grows with suggestions.
let baseCity = '';

document.addEventListener('DOMContentLoaded', function() {
    // header and footer markup is now included directly in the HTML files
    // just run the nav highlighting helper once the DOM is ready
    setActiveNavLink();

    // auto-hide mobile navbar after clicking a link (uses Bootstrap's collapse)
    const navLinks = document.querySelectorAll('.navbar-collapse .nav-link');
    if (navLinks.length) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const collapseEl = document.querySelector('.navbar-collapse');
                if (collapseEl && collapseEl.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });
                    bsCollapse.hide();
                }
            });
        });
    }

    // populate suggestions every load (works even if #citySuggestions not present)
    populateSuggestions(sampleCities);
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const city = document.getElementById('cityInput').value.trim();
            if (!city) {
                alert('Please enter a city name');
                return;
            }
            // when the user types/searches manually, treat this as the new base city
            baseCity = city;
            showCityResults(city);
        });
    }

    // If on destinations page, populate list
    const destList = document.getElementById('destList');
    if (destList) {
        // also populate datalist for autocomplete
        populateSuggestions(sampleCities);
        sampleCities.forEach(name => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            const card = document.createElement('div');
            card.className = 'card card-destination h-100';
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">Click to search this destination</p>
                </div>
            `;
            card.addEventListener('click', () => {
                // redirect to home with query param
                window.location.href = `home.html?city=${encodeURIComponent(name)}`;
            });
            col.appendChild(card);
            destList.appendChild(col);
        });
    }

    // If Home page with query param, automatically search
    const params = new URLSearchParams(window.location.search);
    if (params.has('city')) {
        const cityName = params.get('city');
        document.getElementById('cityInput').value = cityName;
        baseCity = cityName; // initialize base for link text
        showCityResults(cityName);
    }
});

// NOTE: insert your Google Maps API key here. Without a valid key the iframe will show an error.
// You can obtain one from https://console.cloud.google.com/apis/credentials
const GMAP_API_KEY = 'AIzaSyBt7x_-AgQk4-R38JyMX6Y7RCMnZYqzBpE';

// -----------------------------------------------------------------------------
// Navigation helpers
// -----------------------------------------------------------------------------

// highlight active nav link based on current path
function setActiveNavLink() {
    const path = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('#mainNav .nav-link');
    links.forEach(a => {
        const href = a.getAttribute('href');
        const isActive = href === path || (href === 'home.html' && path === '');
        a.classList.toggle('active', isActive);
        if (isActive) {
            a.setAttribute('aria-current', 'page');
        } else {
            a.removeAttribute('aria-current');
        }
    });
}

function showCityResults(city) {
    const results = document.getElementById('results');
    if (!results) return; // nothing to render if results container is missing
    results.innerHTML = '';

    // create a map iframe embedding Google Maps; requires an API key for full functionality
    // if the key isn't configured we show a warning and skip the map to avoid rendering a broken iframe
    if (GMAP_API_KEY === 'YOUR_API_KEY' || !GMAP_API_KEY) {
        const warning = document.createElement('div');
        warning.className = 'alert alert-warning';
        warning.textContent = 'Google Maps API key is not set or invalid. Please configure a valid key in js/app.js';
        results.appendChild(warning);
        // still display attraction links below, but don't attempt to embed a map
        renderAttractionList(city);
        return;
    }

    const iframe = document.createElement('iframe');
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.src = `https://www.google.com/maps/embed/v1/search?key=${GMAP_API_KEY}&q=${encodeURIComponent(city)}`;
    // note: replace GMAP_API_KEY constant above with a real key for maps API. This usage is documented at https://developers.google.com/maps/documentation/embed/get-started

    // wrap iframe in responsive container (Bootstrap 5 ratio) so it scales to screen size
    const wrapper = document.createElement('div');
    wrapper.className = 'ratio ratio-16x9';
    wrapper.appendChild(iframe);
    results.appendChild(wrapper);

    // show the basic (mocked) attraction links below the map
    renderAttractionList(city);
}

// split out the attraction rendering so it can be reused when we bail early due to missing API key
function renderAttractionList(city) {
    const results = document.getElementById('results');
    if (!results) return;
    const attractions = ['Restaurants', 'Parks', 'Historic Sites', 'Attractions', 'Hotels'];
    const ul = document.createElement('ul');
    ul.className = 'list-group mt-3';
    attractions.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        const displayCity = baseCity || city;
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = `${item} in ${displayCity}`;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            let query = city;
            const lower = city.toLowerCase();
            if (!lower.includes(item.toLowerCase())) {
                query = `${city} ${item}`;
            }
            showCityResults(query);
        });
        li.appendChild(link);
        ul.appendChild(li);
    });
    results.appendChild(ul);
}

