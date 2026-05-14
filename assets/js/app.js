﻿/*global window, document, localStorage, URLSearchParams, console, fetch */

/*
app.js - A custom JavaScript for Destination Guide
It manages the behaviour of the search bar, makes the destination cards
interactive, handles highlighting the navbar as well as embedding Google Maps.
*/

let baseCity = "";

// Restrict API key in Google Cloud Console to your specific domain!
const GMAP_API_KEY = "AIzaSyBt7x_-AgQk4-R38JyMX6Y7RCMnZYqzBpE";

function getBasePath() {
    if (window.location.hostname.includes("github.io")) {
        const parts = window.location.pathname.split("/").filter(
            function (part) {
                return part.length > 0;
            }
        );
        if (parts.length > 0) {
            return `/${parts[0]}/`;
        }
    }
    return "/";
}

const BASE_PATH = getBasePath();

const sampleCities = [
    {
        alt: "Eiffel Tower and skyline in Paris, France",
        image: `${BASE_PATH}assets/images/Paris.webp`,
        name: "Paris, France"
    },
    {
        alt: "Skyline of New York City with skyscrapers",
        image: `${BASE_PATH}assets/images/New-York.webp`,
        name: "New York, USA"
    },
    {
        alt: "Tokyo city skyline with illuminated buildings",
        image: `${BASE_PATH}assets/images/Tokyo.webp`,
        name: "Tokyo, Japan"
    },
    {
        alt: "View of Barcelona featuring Sagrada Familia",
        image: `${BASE_PATH}assets/images/Barcelona.webp`,
        name: "Barcelona, Spain"
    },
    {
        alt: "Sydney Opera House and harbour skyline",
        image: `${BASE_PATH}assets/images/Sydney.webp`,
        name: "Sydney, Australia"
    },
    {
        alt: "The Colosseum in Rome, Italy",
        image: `${BASE_PATH}assets/images/Rome.webp`,
        name: "Rome, Italy"
    },
    {
        alt: "London skyline with Big Ben and the River Thames",
        image: `${BASE_PATH}assets/images/London.webp`,
        name: "London, UK"
    },
    {
        alt: "Christ the Redeemer statue overlooking Rio de Janeiro",
        image: `${BASE_PATH}assets/images/Rio-de-Janeiro.webp`,
        name: "Rio de Janeiro, Brazil"
    },
    {
        alt: "Cityscape of Madrid, Spain",
        image: `${BASE_PATH}assets/images/Madrid.webp`,
        name: "Madrid, Spain"
    }
];

/**
 * Validates search input to prevent empty, short, or invalid formats.
 */
function isValidSearchQuery(query) {
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

    const validFormat = /^[\-a-zA-Z\u00C0-\u017F\s,.'`]+$/.test(query);
    if (!validFormat) {
        return {
            message: "Please use only letters and valid punctuation.",
            valid: false
        };
    }

    const matches = query.match(/[aeiouy\u00C0-\u017F]/gi);
    const vowelCount = (
        matches
        ? matches.length
        : 0
    );
    if (vowelCount === 0) {
        return {
            message: "Please enter a real city or country name.",
            valid: false
        };
    }

    const longConsonantRun = /[^aeiouy\W\d_]{4,}/i.test(query);
    if (longConsonantRun) {
        return {
            message: "Please enter a valid destination name.",
            valid: false
        };
    }

    const consecutiveVowels = /[aeiouy]{3,}/i.test(query);
    if (consecutiveVowels) {
        return {
            message: "Please enter a valid destination name.",
            valid: false
        };
    }

    const chars = query.split("");
    const isGibberish = chars.some(function (char, index, arr) {
        const match1 = char === arr[index + 1];
        const match2 = char === arr[index + 2];
        const match3 = char === arr[index + 3];
        return index <= arr.length - 4 && match1 && match2 && match3;
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

function populateSuggestions(list) {
    const data = document.getElementById("citySuggestions");
    if (!data) {
        return;
    }

    data.innerHTML = "";
    list.forEach(function (item) {
        const opt = document.createElement("option");
        opt.value = item;
        data.appendChild(opt);
    });
}

function getRecentSearches() {
    const stored = localStorage.getItem("recentSearches");
    return (
        stored
        ? JSON.parse(stored)
        : []
    );
}

function saveRecentSearch(city) {
    if (!city) {
        return;
    }

    let recent = getRecentSearches();
    recent = recent.filter(function (c) {
        return c.toLowerCase() !== city.toLowerCase();
    });
    recent.unshift(city);
    recent = recent.slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(recent));
}

function renderRecentSearches() {
    const container = document.getElementById("recentSearchesContainer");
    const list = document.getElementById("recentSearchesList");
    const recent = getRecentSearches();

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
        const btn = document.createElement("button");
        const li = document.createElement("li");

        li.className = "list-inline-item me-2 mb-2";
        btn.className = "btn btn-outline-light btn-sm opacity-75";
        btn.textContent = city;

        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const cityInput = document.getElementById("cityInput");
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

function setActiveNavLink() {
    const links = document.querySelectorAll("#mainNav .nav-link");
    const path = window.location.pathname.split("/").pop();

    links.forEach(function (a) {
        const href = a.getAttribute("href");
        const isHome = (href === "index.html" && path === "");
        const isActive = (href === path || isHome);

        a.classList.toggle("active", isActive);
        if (isActive) {
            a.setAttribute("aria-current", "page");
        } else {
            a.removeAttribute("aria-current");
        }
    });
}

function renderAttractionList(city) {
    const attractions = [
        "Restaurants",
        "Parks",
        "Historic Sites",
        "Attractions",
        "Hotels"
    ];
    const results = document.getElementById("results");

    if (!results) {
        return;
    }

    const ul = document.createElement("ul");
    ul.className = "list-group mt-3 list-group-flush shadow-sm rounded";
    ul.style.maxWidth = "800px";
    ul.style.margin = "0 auto";

    attractions.forEach(function (item) {
        const displayCity = baseCity || city;
        const li = document.createElement("li");
        const link = document.createElement("a");

        li.className = [
            "list-group-item",
            "list-group-item-action",
            "text-center",
            "fw-bold",
            "text-primary"
        ].join(" ");

        link.href = "#";
        link.textContent = `Find ${item} in ${displayCity}`;
        link.style.cursor = "pointer";
        link.style.textDecoration = "none";

        link.addEventListener("click", function (e) {
            e.preventDefault();
            const lower = city.toLowerCase();
            let query = `${item} in ${city}`;
            if (lower.includes(item.toLowerCase())) {
                query = city;
            }
            window.showCityResults(query);
        });

        li.appendChild(link);
        ul.appendChild(li);
    });

    results.appendChild(ul);
}

function handleMapError() {
    window.location.href = "404.html";
}

function displaySearchError(message) {
    const results = document.getElementById("results");
    if (!results) {
        return;
    }

    results.innerHTML = [
        "<div class='alert alert-warning alert-dismissible fade show ",
        "mx-auto mt-4' style='max-width: 800px;' role='alert'>",
        "<strong>Oops!</strong> ",
        message,
        "<button type='button' class='btn-close' data-bs-dismiss='alert' ",
        "aria-label='Close'></button>",
        "</div>"
    ].join("");

    results.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

window.showCityResults = function (city) {
    const results = document.getElementById("results");
    if (!results) {
        return;
    }

    results.innerHTML = "";
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "alert alert-info mx-auto mt-4";
    loadingDiv.style.maxWidth = "800px";
    loadingDiv.textContent = `Loading map for ${city}...`;
    results.appendChild(loadingDiv);

    if (!GMAP_API_KEY || GMAP_API_KEY === "YOUR_API_KEY") {
        window.location.href = "404.html";
        return;
    }

    try {
        results.innerHTML = "";

        const mapContainer = document.createElement("div");
        mapContainer.className = "ratio ratio-16x9 mb-3";

        const iframe = document.createElement("iframe");
        const q = window.encodeURIComponent(city);

        iframe.src = [
            "https://www.google.com/maps/embed/v1/search?key=",
            GMAP_API_KEY,
            "&q=",
            q
        ].join("");

        iframe.loading = "lazy";
        iframe.allowFullscreen = true;

        mapContainer.appendChild(iframe);
        results.appendChild(mapContainer);
        renderAttractionList(city);

        results.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } catch (ignore) {
        handleMapError();
    }
};

/**
 * Validates destination name via Nominatim (OpenStreetMap) API.
 * Checks if the destination exists as a real location.
 */
function validateWithNominatim(query) {
    return new Promise(function (resolve) {
        const url = [
            "https://nominatim.openstreetmap.org/search?q=",
            window.encodeURIComponent(query),
            "&format=json&limit=1"
        ].join("");

        fetch(url, {
            headers: {
                "User-Agent": "Destination-Guide-App"
            }
        }).then(function (response) {
            if (!response.ok) {
                throw new Error("Nominatim API unavailable");
            }
            return response.json();
        }).then(function (data) {
            if (data && data.length > 0) {
                resolve({
                    message: "",
                    valid: true
                });
            } else {
                resolve({
                    message: "Destination not found. " +
                    "Please try another city or country.",
                    valid: false
                });
            }
        }).catch(function (error) {
            console.warn("Nominatim validation failed:", error.message);
            resolve({
                message: "",
                valid: true
            });
        });
    });
}


document.addEventListener("DOMContentLoaded", function () {
    const destList = document.getElementById("destList");
    const searchForm = document.getElementById("searchForm");
    const params = new URLSearchParams(window.location.search);

    setActiveNavLink();
    renderRecentSearches();

    populateSuggestions(sampleCities.map(function (city) {
        return city.name;
    }));

    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const input = document.getElementById("cityInput");
            const val = (
                input
                ? input.value.trim()
                : ""
            );
            const validation = isValidSearchQuery(val);

            if (!validation.valid) {
                displaySearchError(validation.message);
                return;
            }

            const results = document.getElementById("results");
            if (results) {
                results.innerHTML = "";
                const loadingDiv = document.createElement("div");
                loadingDiv.className = "alert alert-info mx-auto mt-4";
                loadingDiv.style.maxWidth = "800px";
                loadingDiv.textContent = "Validating destination...";
                results.appendChild(loadingDiv);
            }

            validateWithNominatim(val).then(function (geoRes) {
                if (!geoRes.valid) {
                    displaySearchError(geoRes.message);
                    return;
                }

                baseCity = val;
                saveRecentSearch(val);
                renderRecentSearches();
                window.showCityResults(val);
            });
        });
    }

    if (destList) {
        sampleCities.forEach(function (city) {
            const col = document.createElement("div");
            col.className = "col-12 col-sm-6 col-md-4 mb-4";

            col.innerHTML = [
                "<div class='card h-100 card-destination'>",
                "<img src='",
                city.image,
                "' class='card-img-top' loading='lazy' ",
                "alt='",
                city.alt,
                "'>",
                "<div class='card-body d-flex flex-column'>",
                "<h5 class='card-title text-center fw-bold'>",
                city.name,
                "</h5>",
                "<button class='btn btn-primary mt-auto search-btn ",
                "w-100 fw-bold'>Explore</button>",
                "</div></div>"
            ].join("");

            col.querySelector(".search-btn").addEventListener(
                "click",
                function () {
                    const encoded = window.encodeURIComponent(city.name);
                    window.location.href = `index.html?city=${encoded}`;
                }
            );

            destList.appendChild(col);
        });
    }

    if (params.has("city")) {
        const cityName = params.get("city");
        const validation = isValidSearchQuery(cityName);

        if (!validation.valid) {
            displaySearchError(validation.message);
            return;
        }

        const cityInput = document.getElementById("cityInput");
        if (cityInput) {
            cityInput.value = cityName;
        }

        baseCity = cityName;

        validateWithNominatim(cityName).then(function (geoRes) {
            if (!geoRes.valid) {
                displaySearchError(geoRes.message);
                return;
            }

            window.showCityResults(cityName);
        });
    }
});