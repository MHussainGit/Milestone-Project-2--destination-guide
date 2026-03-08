// JavaScript for the Destination Guide

// Populate the datalist element with suggestion options
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

// Shared list of example cities for suggestions and destination cards
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

// Track the original city entered by a user to provide suggestion links under the map
let baseCity = '';

document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();

    // Auto-hide mobile navbar after clicking a link
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

    // Populate suggestions on every load 
    populateSuggestions(sampleCities);
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const city = document.getElementById('cityInput').value.trim();
            if (!city) {
                alert('Please Enter A City Name');
                return;
            }
            // when the user types/searches manually, treat this as the new base city
            baseCity = city;
            showCityResults(city);
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
})