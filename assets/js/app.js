﻿/*
app.js - A custom JavaScript for Destination Guide
It manages the behaviour of the search bar, makes the destination cards interactive, 
handles highlighting the navbar as well as embedding Google Maps on the home page.
*/

// Populate a datalist element with suggestion options
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

// Dynamically determines the base path for GitHub Pages
// This is to avoid hardcoding the repo name which causes links to become broken if the repo changes
const getBasePath = () => {
    if (window.location.hostname.includes('github.io')) {
        const path = window.location.pathname;
        const parts = path.split('/').filter(part => part.length > 0);
        if (parts.length > 0) {
            return '/' + parts[0] + '/';
        }
    }
    return '/';
};

const BASE_PATH = getBasePath();

// Shared list of example cities used for both destination cards and the search bar dropdown menu
const sampleCities = [
    {
        name: "Paris, France",
        image: BASE_PATH + "assets/images/Paris.webp",
        alt: "Eiffel Tower and skyline in Paris, France"
    },
    {
        name: "New York, USA",
        image: BASE_PATH + "assets/images/New-York.webp",
        alt: "Skyline of New York City with skyscrapers"
    },
    {
        name: "Tokyo, Japan",
        image: BASE_PATH + "assets/images/Tokyo.webp",
        alt: "Tokyo city skyline with illuminated buildings"
    },
    {
        name: "Barcelona, Spain",
        image: BASE_PATH + "assets/images/Barcelona.webp",
        alt: "View of Barcelona featuring Sagrada Familia"
    },
    {
        name: "Sydney, Australia",
        image: BASE_PATH + "assets/images/Sydney.webp",
        alt: "Sydney Opera House and harbour skyline"
    },
    {
        name: "Rome, Italy",
        image: BASE_PATH + "assets/images/Rome.webp",
        alt: "The Colosseum in Rome, Italy"
    },
    {
        name: "London, UK",
        image: BASE_PATH + "assets/images/London.webp",
        alt: "London skyline with Big Ben and the River Thames"
    },
    {
        name: "Rio de Janeiro, Brazil",
        image: BASE_PATH + "assets/images/Rio-de-Janeiro.webp",
        alt: "Christ the Redeemer statue overlooking Rio de Janeiro"
    },
    {
        name: "Madrid, Spain",
        image: BASE_PATH + "assets/images/Madrid.webp",
        alt: "Cityscape of Madrid, Spain"
    }
];

// baseCity is used to keep track of the original city the user searched for
let baseCity = '';

document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();

    // Auto-hide mobile navbar after clicking a link (uses Bootstrap's collapse)
    const navLinks = document.querySelectorAll('.navbar-collapse .nav-link');
    if (navLinks.length) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const collapseEl = document.querySelector('.navbar-collapse');
                if (collapseEl && collapseEl.classList.contains('show')) {
                    // Ensure bootstrap is loaded before calling this
                    if (typeof bootstrap !== 'undefined') {
                        const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });
                        bsCollapse.hide();
                    }
                }
            });
        });
    }

    // Populate suggestions every load (works even if #citySuggestions not present)
    populateSuggestions(sampleCities.map(city => city.name));

    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const city = document.getElementById('cityInput').value.trim();
            if (!city) {
                alert('Please Enter a City/Country Name');
                return;
            }
            // When the user types/searches manually, treat this as the new base city
            baseCity = city;
            showCityResults(city);
        });
    }

    // If on destinations page, populate the cards with sample cities
    const destList = document.getElementById('destList');
    if (destList) {
        // Also populate datalist for search bar suggestions
        populateSuggestions(sampleCities.map(c => c.name));
        
        sampleCities.forEach(city => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';

            const card = document.createElement('div');
            card.className = 'card card-destination h-100';

            card.innerHTML = `
            <img 
               src="${city.image}" 
               class="card-img-top"
               alt="${city.alt}"
               loading="lazy"
               decoding="async"
               width="600"
               height="400"
            >
            <div class="card-body d-flex flex-column">
                 <h5 class="card-title text-center">${city.name}</h5>
                <button class="btn btn-primary mt-auto search-btn">
                   Search
                </button>
            </div>
        `;

            const button = card.querySelector('.search-btn');
            button.addEventListener('click', () => {
                window.location.href = `index.html?city=${encodeURIComponent(city.name)}`;
            });

            col.appendChild(card);
            destList.appendChild(col);
        });
    }

    const params = new URLSearchParams(window.location.search);
    if (params.has('city')) {
        const cityName = params.get('city');
        const cityInput = document.getElementById('cityInput');
        if(cityInput) {
            cityInput.value = cityName;
            baseCity = cityName; 
            showCityResults(cityName);
        }
    }
});

// NOTE: Insert your Google Maps API key here
// SECURITY WARNING: Exposing API keys in client-side JS is risky. 
// For this project I have restricted the functionality to only accesssing the Maps API in the Google Cloud Console
const GMAP_API_KEY = 'AIzaSyBt7x_-AgQk4-R38JyMX6Y7RCMnZYqzBpE';

// Highlight active nav link based on current path
function setActiveNavLink() {
    const path = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('#mainNav .nav-link');
    links.forEach(a => {
        const href = a.getAttribute('href');
        const isActive = href === path || (href === 'index.html' && path === '');
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
    if (!results) return; 
    results.innerHTML = '';

    // Check API Key
    if (GMAP_API_KEY === 'YOUR_API_KEY' || !GMAP_API_KEY) {
        const warning = document.createElement('div');
        warning.className = 'alert alert-warning';
        warning.textContent = 'Google Maps API key is not set or invalid. Please configure a valid key in js/app.js';
        results.appendChild(warning);
        renderAttractionList(city);
        
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }

    const iframe = document.createElement('iframe');
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.src = `https://www.google.com/maps/embed/v1/search?key=${GMAP_API_KEY}&q=${encodeURIComponent(city)}`;

    const wrapper = document.createElement('div');
    wrapper.className = 'ratio ratio-16x9';
    wrapper.appendChild(iframe);
    results.appendChild(wrapper);

    renderAttractionList(city);

    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

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
        link.style.cursor = 'pointer';
        
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