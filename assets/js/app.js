﻿/*global
    window, document, localStorage, alert
*/

/*
app.js - A custom JavaScript for Destination Guide
It manages the behaviour of the search bar, makes the destination cards
interactive, handles highlighting the navbar as well as embedding Google Maps.
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
    var chars;
    var isGibberish;
    var validFormat;

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
            index <= arr.length - 4 &&
            char === arr[index + 1] &&
            char === arr[index + 2] &&
            char === arr[index + 3]
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
    recent = recent.filter(function (c) {
        return c.toLowerCase() !== city.toLowerCase();
    });
    recent.unshift(city);
    recent = recent.slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(recent));
}

/**
 * Renders the recent searches list into the UI
 */
function renderRecentSearches() {
    "use strict";
    var container = document.getElementById("recentSearchesContainer");
    var list = document.getElementById("recentSearchesList");
    var recent = getRecentSearches();

    if (!list) {
        return;
    }

    if (recent.length === 0) {
        if (container) {
            container.style.display = "none";
        }
        return;
    }

    if (container) {
        container.style.display = "block";
    }

    list.innerHTML = "";
    recent.forEach(function (city) {
        var btn = document.createElement("button");
        var li = document.createElement("li");

        li.className = "list-inline-item me-2 mb-2";
        btn.className = "btn btn-outline-light btn-sm opacity-75";
        btn.textContent = city;

        btn.addEventListener("click", function (e) {
            var cityInput = document.getElementById("cityInput");
            e.preventDefault();
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
    var parts;
    var path;

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
    var links = document.querySelectorAll("#mainNav .nav-link");
    var path = window.location.pathname.split("/").pop();

    links.forEach(function (a) {
        var href = a.getAttribute("href");
        var isActive;
        var isHome;

        isHome = (href === "index.html" && path === "");
        isActive = (href === path || isHome);

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
    var attractions = [
        "Restaurants",
        "Parks",
        "Historic Sites",
        "Attractions",
        "Hotels"
    ];
    var results = document.getElementById("results");
    var ul = document.createElement("ul");

    if (!results) {
        return;
    }

    ul.className = "list-group mt-3 list-group-flush shadow-sm rounded";
    ul.style.maxWidth = "800px";
    ul.style.margin = "0 auto";

    attractions.forEach(function (item) {
        var displayCity = baseCity || city;
        var li = document.createElement("li");
        var link = document.createElement("a");

        li.className = [
            "list-group-item",
            "list-group-item-action",
            "text-center",
            "fw-bold",
            "text-primary"
        ].join(" ");

        link.href = "#";
        link.textContent = "Find " + item + " in " + displayCity;
        link.style.cursor = "pointer";
        link.style.textDecoration = "none";

        link.addEventListener("click", function (e) {
            var lower = city.toLowerCase();
            var query = city;

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
    errorDiv.className = "alert alert-danger mx-auto mt-4";
    errorDiv.style.maxWidth = "800px";
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
    var iframe;
    var mapContainer;
    var q;
    var results = document.getElementById("results");
    var warning;

    if (!results) {
        return;
    }

    results.innerHTML = [
        "<div class='alert alert-info mx-auto mt-4' ",
        "style='max-width: 800px;'>Loading map for ",
        city,
        "...</div>"
    ].join("");

    if (!GMAP_API_KEY || GMAP_API_KEY === "YOUR_API_KEY") {
        results.innerHTML = "";
        warning = document.createElement("div");
        warning.className = "alert alert-warning mx-auto mt-4";
        warning.style.maxWidth = "800px";
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
            "https://www.google.com/maps/embed/v1/search?key=",
            GMAP_API_KEY,
            "&q=",
            q
        ].join("");

        iframe.allowFullscreen = true;
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
    var cityInput;
    var cityName;
    var destList = document.getElementById("destList");
    var params = new window.URLSearchParams(window.location.search);
    var searchForm = document.getElementById("searchForm");
    var validation;

    setActiveNavLink();
    renderRecentSearches();

    populateSuggestions(sampleCities.map(function (city) {
        return city.name;
    }));

    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            var input = document.getElementById("cityInput");
            var val;

            e.preventDefault();
            val = input.value.trim();
            validation = isValidSearchQuery(val);

            if (!validation.valid) {
                alert(validation.message);
                return;
            }
            baseCity = val;
            
            // MOVED HERE: Only save the search if typed into the form
            saveRecentSearch(val);
            renderRecentSearches();

            window.showCityResults(val);
        });
    }

    if (destList) {
        sampleCities.forEach(function (city) {
            var col = document.createElement("div");
            var content = "";

            col.className = "col-12 col-sm-6 col-md-4 mb-4";

            content += "<div class='card h-100 card-destination'>";
            content += "<img src='" + city.image + "' class='card-img-top' ";
            content += "alt='" + city.alt + "'>";
            content += "<div class='card-body d-flex flex-column'>";
            content += "<h5 class='card-title text-center fw-bold'>";
            content += city.name + "</h5>";
            content += "<button class='btn btn-primary mt-auto ";
            content += "search-btn w-100 fw-bold'>Explore</button></div></div>";

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