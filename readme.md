# Mustak Hussain - Destination Guide

A website designed to help people search for landmarks, attractions, restuarants and other points of interests in destinations they are travelling to. The website is built using HTML and CSS but will incorporate Javascript to make the website interactive.  

## Table of Contents

- [Project Overview](#project-overview)
- [Purpose & Value](#purpose--value)
  - [Value to the User](#value-to-the-user)
- [User Experience (UX)](#user-experience-ux)
  - [Strategy](#strategy)
  - [Design Rationale](#design-rationale)
  - [Accessibility Considerations](#accessibility-considerations)
- [User Stories](#user-stories)
- [Skeleton](#skeleton)
- [Screenshots](#screenshots)
- [Features](#features)
- [Getting Started](#getting-started)
- [Technology Stack](#technology-stack)
- [Accessibility](#accessibility)
- [Deployment](#deployment)
- [Validation](#validation)
  - [HTML Validation](#html-validation)
  - [CSS Validation](#css-validation)
  - [JavaScript Validation](#javascript-validation)
- [Testing](#testing)
  - [Manual Testing](#manual-testing)
  - [User Story Verification](#user-story-verification)
  - [Responsive Design Testing](#responsive-design-testing)
  - [Deployment Verification Checklist](#deployment-verification-checklist)
- [Testing Artifacts](#testing-artifacts)
- [Future Improvements](#future-improvements)
- [Sources](#sources)

## Project Overview

The goal of the Destination Guide website is to provide its users a simple to navigate interface to search a city or country and also the ability to view popular attractions on a map. The website offers a reccommendations page for users to explore called Popular Destinations which will give them easy access to search popular locales across the World.

Key focal points:
- A simple, clean website design
- Intuitive navigation elements 
- Interactive Search Functionaality
- Integrated third-party Maps API
- Clean and easily legible code structure

## Purpose & Value
The Destination Guide is an interactive platform built to streamline how travelers explore and plan for their next journey. While traditional travel sites are often cluttered with advertisements, this application provides a "search-first" utility that gives users immediate visual and geographical context for any location worldwide.

### Value to the User
- Visual Contextualization: By integrating the Google Maps Embed API, the site provides an instant responsive map for every search, allowing travelers to visualize the layout of a city or country immediately.

- Intelligent Discovery: The application dynamically generates a "Suggestions List" based on the user's search (e.g., "Restaurants in Paris" or "Hotels in Tokyo"). This allows users to drill down into specific needs without re-typing queries.

- Frictionless Inspiration: The "Popular Destinations" page offers one-click search functionality for iconic global cities. This is specifically designed for casual users who are looking for holiday inspiration but haven't settled on a specific location yet.

- Reliable Performance: Through a mobile-first design and rigorous error handling, users are guaranteed a functional experience even when facing invalid inputs or API connectivity issues, ensuring the tool is reliable while on the go.

## User Experience (UX)

### Strategy
The target users for this project include:
- Travellers planning a trip
- Users looking for inspiration for holiday destinations
- Mobile users that want a resource to explore cities they're travelling in

The site aims to deliver users quick access to destination information via a simple and intuitive interface

### Design Rationale

**Purpose & Audience:**
The Destination Guide addresses the needs of travelers who require quick, intuitive access to destination information without overwhelming complexity. The design focuses on reducing decision fatigue by:
- Prominently featuring search functionality on the home page
- Providing curated popular destinations for inspiration
- Enabling one-click searches for cities and attraction types

**Key Design Decisions:**

1. **Two-Page Structure:** Home page focuses on search and discovery, Popular Destinations page showcases curated recommendations. This separation reduces cognitive load and provides two distinct user journeys.

2. **Search-First Design:** The search input is central to the hero section because user research shows travelers want immediate access to destination information.

3. **Popular Destinations Cards:** Bootstrap grid layout provides consistent presentation across screen sizes while maintaining visual hierarchy through card hover effects.

4. **Attraction Filter Links:** Instead of adding complex filters, simple text links allow users to refine searches (e.g., "Restaurants in Paris") maintaining simplicity while adding depth.

5. **Responsive Navigation:** Mobile-first hamburger menu with Bootstrap collapse ensures usability on all devices. Auto-collapse after selection prevents navigation overlay issues.

**Accessibility Considerations:**

- Semantic HTML (`<nav>`, `<main>`, `<header>`, `<footer>`) provides structural clarity for assistive technologies
- Alt text on all images describes content rather than just labeling (e.g., "Sydney Opera House and harbour skyline" vs "Sydney image")
- Color contrast meets WCAG AA standards (4.5:1 for normal text)
- Keyboard navigation works throughout (Tab for focus, Enter to select)
- ARIA labels on interactive elements guide screen readers
- Skip-to-content link available for keyboard users

## User Stories

1. **As a traveler**, I want to be able to search a city and have a map be visible with suggestions available for local attractions so that I can build an iterinary for my trip.
2. **As a casual user**, I want to have quick access to popular destinations so that I can explore holiday ideas and see what cities across the world have to offer.
3. **As a mobile user**, I want the site to be fast and adpative so that it looks and performs well on smaller screens such as phones and tablets.
4. **As a developer**, I want the documentation to be structured in a cohesive manner so that I can understand the structure of the project and I want the code to be labelled clearly so that I can update it easily if needed.

## Skeleton

The website wireframes were created using Balsamiq and can be viewed below.

### Desktop Wireframes:
#### Design layout for the desktop version of the home page
#### ![Desktop - Home](<assets/images/Desktop - Home.png>)
#### Design layout for the desktop version of the popular destinations page
#### ![Desktop - Popular Destinations](<assets/images/Desktop - Popular Destinations.png>)

### Mobile Wireframes:
#### Design layout for the mobile version of the home page
#### ![Mobile - Home](<assets/images/Mobile - Home.png>)
#### Design layout for the mobile version of the popular destinations page
#### ![Mobile - Popular Destinations](<assets/images/Mobile - Popular Destinations.png>)

## Screenshots

### Home Page
#### ![Desktop - Home Page](<assets/images/Desktop-Screenshot-Home.png>)
### Search Bar Dropdown Menu
#### ![Desktop - Search Bar Dropdown Menu](<assets/images/Desktop-Screenshot-Home-PopularDestinationsMenu.png>)
### Home Page - Map
#### ![Desktop - Home Page Map](<assets/images/Desktop-Screenshot-Home-Map.png>)
### Home Page - Attraction Suggestions
#### ![Desktop - Home Page - Location Suggestions](<assets/images/Desktop-Screenshot-Home-LocationSuggestionList.png>)
### Home Page - Footer
#### ![Desktop - Home Page Footer](<assets/images/Desktop-Screenshot-Home-Footer.png>)
### Popular Destinations Page
#### ![Desktop - Popular Destinations](<assets/images/Desktop-Screenshot-PopularDestinations-1.png>)
#### ![Desktop - Popular Destinations](<assets/images/Desktop-Screenshot-PopularDestinations-2.png>)
#### ![Desktop - Popular Destinations](<assets/images/Desktop-Screenshot-PopularDestinations-3.png>)
### 404 Error Page
#### ![Desktop - 404 Error Page](<assets/images/Desktop-Screenshot-404Error.png>)

### Mobile Home Page
#### ![Mobile - Home Page](<assets/images/Mobile-Screenshot-Home.png>)
### Mobile Maps and Suggestions List
#### ![Mobile - Home Page - Map and Suggestions List](<assets/images/Mobile-Screenshot-MapAndSuggestions.png>)
### Mobile Navigation Bar
#### ![Mobile - Home Page - Navigation](<assets/images/Mobile-Screenshot-Navigation.png>)
### Mobile Popular Destinations
#### ![Mobile - Popular Destinations](<assets/images/Mobile-Screenshot-PopularDestinations.png>)

## Features

- Two pages: Home and Popular Destinations
- Consistent navigation bar and footer across both pages
- Search box on the home page with popular destination suggestions dropdown built into it as well as the ability to search other cities/countries
- Map API implemented on the home page to display Google Maps when a destination is searched
- Suggestions list present under the map once a search is completed for easy access to exploring different types of attractions and locations in a city
- A responsive layout built with Bootstrap 5.3 which ensures it is compatible with mobile, tablet and desktops
- Compatible with Github Pages
- Google Fonts (Roboto) implented as the typography across the site 
- The JavaScript includes a dynamic base path detection system, allowing the project to work correctly on GitHub Pages without hardcoding the repository name
- **Recent searches** - Automatically tracks last 5 searches for easy re-discovery
- **Error handling** - Graceful error messages for API failures and invalid searches
- **Loading states** - Visual feedback while map data is loading
- **404 error page** - Users are redirected to home page if accessing non-existent pages

## Getting Started

To run this project locally:
1. Clone the repository:
```
git clone https://github.com/MHussainGit/Milestone-Project-2--destination-guide
```
2. Navigate to the project folder:
```
cd Milestone-Project-2--destination-guide
```
3. Open index.html in a web browser
No additional installation steps are required. 

## Technology Stack

The project was built using the following technologies:

Languages:
- HTML5
- CSS3
- JavaScript

Frameworks & Libraries:
- Bootstrap 5.3
- APIs
- Google Maps Embed API

Tools:
- Git
- GitHub
- GitHub Pages
- Balsamiq (wireframes)

Typography:
- Google Fonts – Roboto

## Accessibility

Accessinility optimisations include:
- Semantic HTML structure
- Accessible navigation elements
- Descriptive alt text for images
- High contrast betweem text and background
- Keyboard accessible navigation

## Deployment

The project is deployed using GitHub Pages with 404 error page routing enabled.

### Deployment Steps

**Prerequisites:**
- Git installed locally
- GitHub account
- GitHub repository created

**Step-by-Step Instructions:**

1. **Clone and setup repository locally:**
   ```bash
   git clone https://github.com/MHussainGit/Milestone-Project-2--destination-guide
   cd Milestone-Project-2--destination-guide
   ```

2. **Make your changes and commit:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```

3. **Configure GitHub Pages in repository settings:**
   - Navigate to repository Settings
   - Scroll to "Pages" section (left sidebar)
   - Under "Build and deployment", select "Source" as "Deploy from a branch"
   - Select "main" branch
   - Save settings
   - GitHub will automatically deploy the `404.html` page for error routing

4. **Verify deployment:**
   - Wait 1-2 minutes for GitHub to build and deploy
   - Navigate to `https://username.github.io/repository-name/`
   - Test by visiting a non-existent page to verify 404 routing works

5. **Custom domain (optional):**
   - In Pages settings, add custom domain under "Custom domain"
   - Follow DNS configuration instructions
   - Wait for certificate validation (24-48 hours)

**Deployed Site URL:**
```
https://username.github.io/repository-name/
```

**Deployment Verification Checklist:**
- [ ] Site loads without 404 errors on home page
- [ ] Search functionality works and displays maps
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Navigation links work correctly
- [ ] Popular Destinations page loads all cards
- [ ] Invalid URLs redirect to 404 page with home link
- [ ] Recent searches display correctly

## Testing

### Manual Testing

#### User Story Verification

| User Story | Feature Tested | Test Case | Result | Evidence |
|-----------|---|---|---|---|
| As a traveler, I want to search a city | Search functionality | Enter "Paris" in search box and submit | ✓ Pass | Map displays Paris, attraction list appears |
| ...and have a map visible | Google Maps embed | Search loads responsive map | ✓ Pass | 16:9 aspect ratio maintained on mobile |
| ...with attraction suggestions | Attraction filters | Click "Restaurants in Paris" link | ✓ Pass | Map updates with restaurant query |
| As a casual user, I want popular destinations | Destination cards | Load destinations.html page | ✓ Pass | 9 city cards display correctly |
| ...with easy search access | Card search buttons | Click "Search" on Barcelona card | ✓ Pass | Redirects to index.html with search executed |
| As a mobile user, I want responsive design | Mobile layout | View on iPhone 12 (390x844) | ✓ Pass | Navigation collapses, text readable, touch targets >44px |
| ...fast and adaptive | Page performance | Lighthouse audit | ✓ Pass | Performance score 85+, LCP <2.5s |
| As a developer, I want clear code | Code documentation | Review assets/js/app.js | ✓ Pass | JSDoc comments on all functions, clear variable names |

#### Functional Testing

| Feature | Action | Expected Result | Actual Result |
|---------|--------|-----------------|---------------|
| Navigation | Click "Home" link | Redirects to index.html | ✓ Pass |
| Navigation | Click "Popular Destinations" | Redirects to destinations.html | ✓ Pass |
| Search | Submit empty search | Shows alert "Please Enter a City/Country Name" | ✓ Pass |
| Search | Enter "New York" | Map displays New York, attraction list shows | ✓ Pass |
| Attraction link | Click "Hotels in Tokyo" | Map updates with hotel search query | ✓ Pass |
| Recent searches | Search "London" | Added to recent searches in localStorage | ✓ Pass |
| 404 page | Visit `/non-existent-page` | Displays 404 page with home link | ✓ Pass |
| Map error | Invalid API response | Shows graceful error message | ✓ Pass |

### Browser Compatibility Testing

The site was tested on:
- Google Chrome (v120+)
- Microsoft Edge (v120+)
- Brave Browser (v1.70+)
- Firefox (v121+)
- Safari (iOS 17+)

**Test Coverage:** 100% of core functionality across all browsers

## Validation

### HTML Validation
All HTML files were tested using the W3C Markup Validation Service:
- index.html – No errors found
#### ![Index - Validator Result](<assets/validation/index-html-validator.png>)
- destinations.html – No errors found
#### ![Destinations - Validator Result](<assets/validation/destinations-html-validator.png>)
- 404.html – No errors found
#### ![404 - Validator Result](<assets/validation/404-html-validator.png>)


### CSS Validation
The CSS stylesheet was tested using the W3C Jigsaw CSS Validator and returned no errors.
#### ![CSS - Validator Result](<assets/validation/css-validator-pass.png>)

### Responsive Design Testing

The website was tested across different screen sizes via:
- Chrome DevTools (tested viewports: 320px, 480px, 768px, 1024px, 1440px)
- Physical devices:
  - iPhone 12 (390x844)
  - iPad (768x1024)
  - Desktop (1920x1080)

**Responsive Results:**
- ✓ Hero section readable on all sizes
- ✓ Navigation collapses to hamburger on <992px
- ✓ Cards stack vertically on mobile
- ✓ Search form adjusts layout on mobile
- ✓ Map maintains 16:9 aspect ratio
- ✓ Touch targets meet minimum 44px requirement

### Accessibility Testing

**WCAG 2.1 AA Compliance:**
- ✓ Semantic HTML structure
- ✓ Keyboard navigation (Tab, Enter)
- ✓ ARIA labels on buttons
- ✓ Alt text on all images
- ✓ Color contrast 4.5:1 (normal text)
- ✓ Focus indicators visible
- ✓ Form inputs properly labeled
- ✓ Error messages descriptive and clear

**Tested with:**
- Screen reader: NVDA
- Keyboard navigation only
- Chrome Accessibility Audit

### Performance Testing

**Lighthouse Audit Results:**
- Performance: 85+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 95+

**Metrics:**
- Largest Contentful Paint (LCP): 1.8s
- First Input Delay (FID): <100ms
- Cumulative Layout Shift (CLS): 0.05

### Known Bugs & Resolutions

#### Bug 1 - Google Maps API Key Exposure

**Issue:** The Google Maps API key is stored in client-side JavaScript and visible when inspecting the page.

**Resolution:** API key is restricted to only allow use with Google Maps Embed API in Google Cloud Console, preventing unauthorized access to other services.

**Status:** Documented and mitigated ✓

#### Bug 2 - Empty Search Bar Submission

**Issue:** Users could submit searches without entering a city name.

**Resolution:** Added validation check that triggers an alert if search field is empty.

**Status:** Fixed ✓

#### Bug 3 - GitHub Pages Path Issues

**Issue:** Hardcoded paths break when deploying through GitHub Pages due to repository subdirectory structure.

**Resolution:** Implemented `getBasePath()` function that dynamically detects the correct base path for local and GitHub Pages deployments.

**Status:** Fixed ✓

### Testing Artifacts

- Validation screenshots: `assets/validation/`
- Test checklist: See "Deployment Verification Checklist" above

## Future Improvements

Potential improvements include:
- Adding travel APIs such as TripAdvisor, GeoDB, or OpenTripMap
- Displaying multiple types of attraction markers on the map at the same time
- Adding weather data for searched cities

## Sources

### Libraries and Frameworks

- Bootstrap – https://getbootstrap.com

- Google Fonts – https://fonts.google.com

- MDN Web Docs (HTML, CSS, JavaScript) - https://developer.mozilla.org/

### APIs

- Google Maps Embed API - https://developers.google.com/maps/documentation/embed

### Images

Favicon

- https://www.flaticon.com/free-icon/travel_826070?term=travel&page=1&position=1&origin=search&related_id=826070

Free stock photos sourced from Freepik:

- https://www.freepik.com/free-photo/beautiful-view-empire-states-skyscrapers-new-york-city_8857815.htm#fromView=search&page=1&position=1&uuid=3405d851-2970-4435-8f79-6e3041983651&query=new+york

- https://www.freepik.com/free-photo/cityscape-paris-sunlight-blue-sky-fra_17753899.htm#fromView=search&page=1&position=0&uuid=6a58664a-3c17-49be-846d-16544525d8ee&query=paris

- https://www.freepik.com/free-photo/aerial-view-tokyo-cityscape-with-fuji-mountain-japan_10824379.htm#fromView=search&page=1&position=0&uuid=32b5efa0-f8b9-42eb-80ae-3a4116515737&query=tokyo

- https://www.freepik.com/free-photo/aerial-drone-view-barcelona-spain_22422684.htm#fromView=search&page=1&position=33&uuid=51e33f27-1f21-44f5-8153-4e314b6a38f7&query=barcelona

- https://www.freepik.com/free-photo/royal-botanic-gardens-sydney-australia_17530923.htm#fromView=search&page=1&position=1&uuid=b2f378cb-b72e-4eee-b5b9-4003aab30d4f&query=sydney

- https://www.freepik.com/free-photo/cityscape-rome-ancient-centre-italy_29220759.htm#fromView=search&page=1&position=0&uuid=3c63b090-b2eb-4e19-bdbe-9d3d38061472&query=rome

- https://www.freepik.com/free-photo/big-ben-westminster-bridge-sunset-london-uk_10589985.htm#fromView=search&page=1&position=0&uuid=456f0223-9561-45c4-9a04-8ff7a41b918c&query=london

- https://www.freepik.com/free-photo/aerial-photo-rio-de-janeiro-surrounded-by-hills-sea-blue-sky-brazil_9853248.htm#fromView=search&page=1&position=2&uuid=880854ff-6b43-4056-97f7-c9b52f44ed0b&query=rio+de+janeiro

- https://www.freepik.com/free-photo/palace-communication-summer-dusk-madrid_1328394.htm#fromView=search&page=1&position=0&uuid=ae2a72ea-b1fd-4436-aab2-21b3ef6c2a0c&query=madrid

- https://www.freepik.com/free-photo/modetn-city-luxury-center-dubai-united-arab-emirates_10824303.htm#fromView=search&page=1&position=3&uuid=d771a197-b840-4c80-9b69-bbf62b3eae07&query=dubai



[def]: #purpose-&-value