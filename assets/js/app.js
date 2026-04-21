﻿/*global
    window, document, localStorage, bootstrap, console, alert
*/

/*
app.js - A custom JavaScript for Destination Guide
It manages the behaviour of the search bar, makes the destination cards
interactive, handles highlighting the navbar as well as embedding Google Maps
on the home page.
*/

var baseCity = "";
var BASE_PATH;
var sampleCities;
var GMAP_API_KEY;

// Populate a datalist element with suggestion options
function populateSuggestions(list) {
    "use strict";
    var data = document.getElementById("citySuggestions");
    if (!data) {
        return;
    }
    data.innerHTML = "";
    list.forEach(function (item) {
        var opt = document.createElement("option");
        opt.value = item;
        data.appendChild(opt);
    });
}

// Dynamically determines the base path for GitHub Pages
// This is to avoid hardcoding the repo name which causes links to become
// broken if the repo changes
function getBasePath() {
    "use strict";
    var path;
    var parts;
    if (window.location.hostname.indexOf("github.io") !== -1) {
        path = window.location.pathname;
        parts = path.split("/").filter(function (part) {
            return part.length > 0;
        });
        if (parts.length > 0) {
            return "/" + parts[0] + "/";
        }
    }
    return "/";
}

BASE_PATH = getBasePath();

// Shared list of example cities used for both destination cards and the
// search bar dropdown menu
sampleCities = [
    {
        alt: "Eiffel Tower and skyline in Paris, France",
        image: BASE_PATH + "assets/images/Paris.webp",
        name: "Paris, France"
    },
    {
        alt: "Skyline of New York City with skyscrapers",
        image: BASE_PATH + "assets/images/New-York.webp",
        name: "New York, USA"
    },
    {
        alt: "Tokyo city skyline with illuminated buildings",
        image: BASE_PATH + "assets/images/Tokyo.webp",
        name: "Tokyo, Japan"
    },
    {
        alt: "View of Barcelona featuring Sagrada Familia",
        image: BASE_PATH + "assets/images/Barcelona.webp",
        name: "Barcelona, Spain"
    },
    {
        alt: "Sydney Opera House and harbour skyline",
        image: BASE_PATH + "assets/images/Sydney.webp",
        name: "Sydney, Australia"
    },
    {
        alt: "The Colosseum in Rome, Italy",
        image: BASE_PATH + "assets/images/Rome.webp",
        name: "Rome, Italy"
    },
    {
        alt: "London skyline with Big Ben and the River Thames",
        image: BASE_PATH + "assets/images/London.webp",
        name: "London, UK"
    },
    {
        alt: "Christ the Redeemer statue overlooking Rio de Janeiro",
        image: BASE_PATH + "assets/images/Rio-de-Janeiro.webp",
        name: "Rio de Janeiro, Brazil"
    },
    {
        alt: "Cityscape of Madrid, Spain",
        image: BASE_PATH + "assets/images/Madrid.webp",
        name: "Madrid, Spain"
    }
];

/**
 * Load recent searches from localStorage
 * @returns {Array} Array of recent city searches
 */
function getRecentSearches() {
    "use strict";
    var stored = localStorage.getItem("recentSearches");
    return (
        stored
        ? JSON.parse(stored)
        : []
    );
}

/**
 * Save a search to recent searches (max 5 items)
 * @param {string} city - City name to save
 */
function saveRecentSearch(city) {
    "use strict";
    var recent;
    if (!city) {
        return;
    }
    recent = getRecentSearches();
    // Remove if already exists to avoid duplicates
    recent = recent.filter(function (c) {
        return c !== city;
    });
    // Add to beginning
    recent.unshift(city);
    // Keep only last 5
    recent = recent.slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(recent));
}

// Highlight active nav link based on current path
function setActiveNavLink() {
    "use strict";
    var path = window.location.pathname.split("/").pop();
    var links = document.querySelectorAll("#mainNav .nav-link");
    links.forEach(function (a) {
        var href = a.getAttribute("href");
        var isHome = (href === "index.html" && path === "");
        var isActive = (href === path || isHome);
        a.classList.toggle("active", isActive);
        if (isActive) {
            a.setAttribute("aria-current", "page");
        } else {
            a.removeAttribute("aria-current");
        }
    });
}

function renderAttractionList(city) {
    "use strict";
    var results = document.getElementById("results");
    var attractions = [
        "Restaurants",
        "Parks",
        "Historic Sites",
        "Attractions",
        "Hotels"
    ];
    var ul = document.createElement("ul");

    if (!results) {
        return;
    }

    ul.className = "list-group mt-3";

    attractions.forEach(function (item) {
        var li = document.createElement("li");
        var displayCity = baseCity || city;
        var link = document.createElement("a");

        li.className = "list-group-item";
        link.href = "#";
        link.textContent = item + " in " + displayCity;
        link.style.cursor = "pointer";

        link.addEventListener("click", function (e) {
            var query = city;
            var lower = city.toLowerCase();
            e.preventDefault();

            // FIXED: Formulate query as "Restaurants in Paris" instead of
            // "Paris Restaurants" for better multiple-location geocoding
            if (lower.indexOf(item.toLowerCase()) === -1) {
                query = item + " in " + city;
            }

            window.showCityResults(query);
        });

        li.appendChild(link);
        ul.appendChild(li);
    });

    results.appendChild(ul);
}

/**
 * Handle map display errors
 * @param {HTMLElement} results - Results container
 * @param {string} city - City name
 */
function handleMapError(results, city) {
    "use strict";
    var errorDiv = document.createElement("div");
    results.innerHTML = "";
    errorDiv.className = "alert alert-danger";
    errorDiv.role = "alert";
    errorDiv.innerHTML = [
        "<strong>Unable to load map</strong>",
        " <p>We couldn't load the map for ",
        city,
        ". This might be due to:</p>",
        " <ul>",
        " <li>Network connectivity issues</li>",
        " <li>Google Maps API service temporarily unavailable</li>",
        " <li>Invalid search query</li>",
        " </ul>",
        " <p>Please try again or search for a different destination.</p>"
    ].join("");
    results.appendChild(errorDiv);
    renderAttractionList(city);
}

window.showCityResults = function (city) {
    "use strict";
    var results = document.getElementById("results");
    var warning;
    var mapContainer;
    var iframe;
    var baseUrl;
    var q;

    if (!results) {
        return;
    }

    // Show loading state
    results.innerHTML = [
        "<div class=\"alert alert-info d-flex align-items-center\" ",
        "role=\"status\">",
        " <span class=\"spinner-border spinner-border-sm me-2\" ",
        "aria-hidden=\"true\"></span>",
        " <span>Loading map and attractions for ",
        city,
        "...</span></div>"
    ].join("");

    // Save to recent searches
    saveRecentSearch(city);

    // Check API Key
    if (GMAP_API_KEY === "YOUR_API_KEY" || !GMAP_API_KEY) {
        results.innerHTML = "";
        warning = document.createElement("div");
        warning.className = "alert alert-warning";
        warning.innerHTML = [
            "<strong>Configuration Note:</strong> Google Maps API key is not ",
            "set or invalid. Please configure a valid key in assets/js/app.js ",
            "to display maps."
        ].join("");
        results.appendChild(warning);
        renderAttractionList(city);

        results.scrollIntoView({behavior: "smooth", block: "start"});
        return;
    }

    try {
        // Clear previous content and create map container
        results.innerHTML = "";

        mapContainer = document.createElement("div");
        mapContainer.className = "ratio ratio-16x9 mb-3";
        mapContainer.id = "map-container";

        iframe = document.createElement("iframe");
        iframe.referrerPolicy = "no-referrer-when-downgrade";
        iframe.title = "Google Map showing " + city;

        // FIXED: Use the 'search' embed mode which naturally displays
        // multiple locations/pins for broader queries
        baseUrl = "https://www.google.com/maps/embed/v1/search";
        q = window.encodeURIComponent(city);

        iframe.src = baseUrl + "?key=" + GMAP_API_KEY + "&q=" + q;

        // Add error handling for iframe
        iframe.onerror = function () {
            handleMapError(results, city);
        };

        mapContainer.appendChild(iframe);
        results.appendChild(mapContainer);

        renderAttractionList(city);

        results.scrollIntoView({behavior: "smooth", block: "start"});
    } catch (error) {
        console.error("Error displaying map:", error);
        handleMapError(results, city);
    }
};

// NOTE: Insert your Google Maps API key here
// SECURITY WARNING: Exposing API keys in client-side JS is risky.
// For this project I have restricted the functionality to only accesssing
// the Maps API in the Google Cloud Console
GMAP_API_KEY = "AIzaSyBt7x_-AgQk4-R38JyMX6Y7RCMnZYqzBpE";

document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    var navLinks = document.querySelectorAll(".navbar-collapse .nav-link");
    var searchForm = document.getElementById("searchForm");
    var destList = document.getElementById("destList");
    var params = new window.URLSearchParams(window.location.search);
    var cityName;
    var cityInput;

    setActiveNavLink();

    // Auto-hide mobile navbar after clicking a link (uses Bootstrap's collapse)
    if (navLinks.length) {
        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                var collapseEl = document.querySelector(".navbar-collapse");
                var bsCollapse;
                if (collapseEl && collapseEl.classList.contains("show")) {
                    // Ensure bootstrap is loaded before calling this
                    if (window.bootstrap !== undefined) {
                        bsCollapse = new window.bootstrap.Collapse(
                            collapseEl,
                            {toggle: false}
                        );
                        bsCollapse.hide();
                    }
                }
            });
        });
    }

    // Populate suggestions every load (works even if #citySuggestions
    // not present)
    populateSuggestions(sampleCities.map(function (city) {
        return city.name;
    }));

    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            var val = document.getElementById("cityInput").value.trim();
            e.preventDefault();
            if (!val) {
                alert("Please Enter a City/Country Name");
                return;
            }
            // When the user types/searches manually, treat this as the new
            // base city
            baseCity = val;
            window.showCityResults(val);
        });
    }

    // If on destinations page, populate the cards with sample cities
    if (destList) {
        // Also populate datalist for search bar suggestions
        populateSuggestions(sampleCities.map(function (c) {
            return c.name;
        }));

        sampleCities.forEach(function (city) {
            var col = document.createElement("div");
            var card = document.createElement("div");
            var button;

            col.className = "col-12 col-sm-6 col-md-4 mb-4";
            card.className = "card card-destination h-100";

            card.innerHTML = [
                "<img src=\"",
                city.image,
                "\" class=\"card-img-top\" alt=\"",
                city.alt,
                "\" loading=\"lazy\" decoding=\"async\" width=\"600\" ",
                "height=\"200\">",
                " <div class=\"card-body d-flex flex-column\">",
                " <h5 class=\"card-title text-center\">",
                city.name,
                "</h5>",
                " <button class=\"btn btn-primary mt-auto search-btn\">",
                " Search</button></div>"
            ].join("");

            button = card.querySelector(".search-btn");
            button.addEventListener("click", function () {
                var q = window.encodeURIComponent(city.name);
                window.location.href = "index.html?city=" + q;
            });

            col.appendChild(card);
            destList.appendChild(col);
        });
    }

    if (params.has("city")) {
        cityName = params.get("city");
        cityInput = document.getElementById("cityInput");
        if (cityInput) {
            cityInput.value = cityName;
            baseCity = cityName;
            window.showCityResults(cityName);
        }
    }
});