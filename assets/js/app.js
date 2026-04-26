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

/**
 * Validates search input to prevent empty, short, or invalid formats.
 * @param {string} query - The search string
 * @returns {Object} Object containing validity boolean and error message
 */
function isValidSearchQuery(query) {
    "use strict";
    var validFormat;
    var chars;
    var isGibberish;

    if (!query || query.trim().length === 0) {
        return {
            message: "Please Enter a City/Country Name.",
            valid: false
        };
    }

    if (query.trim().length < 2) {
        return {
            message: "Destination name must be at least 2 characters long.",
            valid: false
        };
    }

    validFormat = /^[\-a-zA-Z\u00C0-\u017F\s,.'`]+$/.test(query);
    if (!validFormat) {
        return {
            message: "Please use only letters and valid punctuation.",
            valid: false
        };
    }

    chars = query.split("");
    isGibberish = chars.some(function (char, index, arr) {
        return (
            index <= arr.length - 4
            && char === arr[index + 1]
            && char === arr[index + 2]
            && char === arr[index + 3]
        );
    });

    if (isGibberish) {
        return {
            message: "Please enter a valid destination name.",
            valid: false
        };
    }

    return {
        message: "",
        valid: true
    };
}

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
        return c.toLowerCase() !== city.toLowerCase();
    });
    // Add to beginning
    recent.unshift(city);
    // Keep only last 5
    recent = recent.slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(recent));
}

/**
 * Renders the recent searches list into the UI
 */
function renderRecentSearches() {
    "use strict";
    var recent = getRecentSearches();
    var container = document.getElementById("recentSearchesContainer");
    var list = document.getElementById("recentSearchesList");

    if (!list) {
        return;
    }

    // Toggle container visibility based on whether history exists
    if (recent.length === 0) {
        if (container) {
            container.style.display = "none";
        }
        return;
    }

    if (container) {
        container.style.display = "block";
    }

    list.innerHTML = ""; // Clear current list
    recent.forEach(function (city) {
        var li = document.createElement("li");
        var btn = document.createElement("button");

        li.className = "list-inline-item me-2 mb-2";
        btn.className = "btn btn-outline-secondary btn-sm";
        btn.textContent = city;

        // Make the history item clickable
        btn.addEventListener("click", function () {
            var cityInput = document.getElementById("cityInput");
            if (cityInput) {
                cityInput.value = city;
            }
            baseCity = city;
            window.showCityResults(city);
        });

        li.appendChild(btn);
        list.appendChild(li);
    });
}

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

function handleMapError(results, city) {
    "use strict";
    var errorDiv = document.createElement("div");
    results.innerHTML = "";
    errorDiv.className = "alert alert-danger";
    errorDiv.role = "alert";
    errorDiv.innerHTML = [
        "<strong>Unable to load map</strong>",
        "<p>Connectivity issue or invalid query for ",
        city,
        ".</p>"
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
    var q;

    if (!results) {
        return;
    }

    results.innerHTML = [
        "<div class='alert alert-info'>Loading ",
        city,
        "...</div>"
    ].join("");

    // Save search and refresh the recent search UI
    saveRecentSearch(city);
    renderRecentSearches();

    if (GMAP_API_KEY === "YOUR_API_KEY" || !GMAP_API_KEY) {
        results.innerHTML = "";
        warning = document.createElement("div");
        warning.className = "alert alert-warning";
        warning.innerHTML = [
            "<strong>Configuration Note:</strong> ",
            "Invalid API Key."
        ].join("");
        results.appendChild(warning);
        renderAttractionList(city);
        return;
    }

    try {
        results.innerHTML = "";
        mapContainer = document.createElement("div");
        mapContainer.className = "ratio ratio-16x9 mb-3";
        iframe = document.createElement("iframe");
        q = window.encodeURIComponent(city);
        iframe.src = [
            "https://www.google.com/maps/embed/v1/place?key=",
            GMAP_API_KEY,
            "&q=",
            q
        ].join("");
        mapContainer.appendChild(iframe);
        results.appendChild(mapContainer);
        renderAttractionList(city);
        results.scrollIntoView({behavior: "smooth", block: "start"});
    } catch (ignore) {
        handleMapError(results, city);
    }
};

GMAP_API_KEY = "AIzaSyBt7x_-AgQk4-R38JyMX6Y7RCMnZYqzBpE";

document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    var searchForm = document.getElementById("searchForm");
    var destList = document.getElementById("destList");
    var params = new window.URLSearchParams(window.location.search);
    var cityName;
    var cityInput;
    var validation;

    setActiveNavLink();

    // Show recent searches on page load
    renderRecentSearches();

    populateSuggestions(sampleCities.map(function (city) {
        return city.name;
    }));

    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            var input = document.getElementById("cityInput");
            var val = input.value.trim();
            e.preventDefault();
            validation = isValidSearchQuery(val);
            if (!validation.valid) {
                alert(validation.message);
                return;
            }
            baseCity = val;
            window.showCityResults(val);
        });
    }

    if (destList) {
        sampleCities.forEach(function (city) {
            var col = document.createElement("div");
            var content = "";
            col.className = "col-12 col-sm-6 col-md-4 mb-4";

            content += "<div class='card h-100'>";
            content += "<img src='" + city.image + "' class='card-img-top' ";
            content += "alt='" + city.alt + "'>";
            content += "<div class='card-body d-flex flex-column'>";
            content += "<h5 class='card-title text-center'>" + city.name;
            content += "</h5><button class='btn btn-primary mt-auto ";
            content += "search-btn'>Search</button></div></div>";

            col.innerHTML = content;

            col.querySelector(".search-btn").addEventListener(
                "click",
                function () {
                    var encoded = window.encodeURIComponent(city.name);
                    window.location.href = "index.html?city=" + encoded;
                }
            );
            destList.appendChild(col);
        });
    }

    if (params.has("city")) {
        cityName = params.get("city");
        validation = isValidSearchQuery(cityName);
        if (validation.valid) {
            cityInput = document.getElementById("cityInput");
            if (cityInput) {
                cityInput.value = cityName;
            }
            baseCity = cityName;
            window.showCityResults(cityName);
        }
    }
});