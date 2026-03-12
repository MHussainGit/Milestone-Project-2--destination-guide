# Mustak Hussain - Destination Guide

A website designed to help people search for landmarks, attractions, restuarants and other points of interests in destinations they are travelling to. The website is built using HTML and CSS but will incorporate Javascript to make the website interactive.  

## Project Overview

The goal of the Destination Guide website is to provide its users a simple to navigate interface to search a city or country and also the ability to view popular attractions on a map. The website offers a reccommendations page for users to explore called Popular Destinations which will give them easy access to search popular locales across the World.

Key focal points:
- A simple, clean website design
- Intuitive navigation elements 
- Interactive Search Functionaality
- Integrated third-party Maps API
- Clean and easily legible code structure

## User Experience (UX)

### Strategy
The target users for this project include:
- Travellers planning a trip
- Users looking for inspiration for holiday destinations
- Mobile users that want a resource to explore cities they're travelling in

The site aims to deliver users quick access to destination information via a simple and intuitive interface

## User Stories

1. **As a traveler**, I want to be able to search a city and have a map be visible with suggestions available for local attractions so that I can build an iterinary for my trip.
2. **As a casual user**, I want to have quick access to popular destinations so that I can explore holiday ideas and see what cities across the world have to offer.
3. **As a mobile user**, I want the site to be fast and adpative so that it looks and performs well on smaller screens such as phones and tablets.
4. **As a developer**, I want the documentation to be structured in a cohesive manner so that I can understand the structure of the project and I want the code to be labelled clearly so that I can update it easily if needed.

## Skeleton

The website wireframes were created using Balsamiq and are available in the following formats:

**Desktop Wireframes:**
- [Desktop - Home](assets/images/Desktop%20-%20Home.png)
- [Desktop - Popular Destinations](assets/images/Desktop%20-%20Popular%20Destinations.png)

**Mobile Wireframes:**
- [Mobile -Home](assets/images/Mobile%20-%20Home%20.png)
- [Mobile - Popular Destinations](assets/images/Mobile%20-%20Popular%20Destinations.png)

## Features

- Two pages: Home and Popular Destinations
- Consistent navigation bar and footer across both pages
- Search box on the home page with popular destination suggestions dropdown built into it as well as the ability to search other cities/countries
- Map API implemented on the home page to display Google Maps when a destination is searched
- Suggestions list present under the map once a search is completed for easy access to exploring different types of attractions and locations in a city
- A responsive layout built with Bootstrap 5.3 which ensures it is compatible with mobile, tablet and desktops
- Compatible with Github Pages
- Google Fonts (Roboto) implented as the typography across the site 
- The JavaScript includes a dynamic base path detection system, allowing the project to work correctly on GitHub Pages without hardcoding the repository name.

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

The project is deployed using GitHub Pages.

Deployment Steps:
1. Push project files to a GitHub repository
2. Navigate to repository settings
3. Select Pages
4. Choose the main branch
5. Save settings

The site will be available at:
```
https://username.github.io/repository-name/
```

## Testing

### Manual Testing

| Feature | Test | Result |
|--------|------|--------|
| Navigation links | Click each link | Correct page loads |
| Search bar | Enter city names | Map loads correct location |
| Destination cards | Click search button | Redirect works correctly |
| Mobile navigation | Expand/collapse menu | Works correctly |
| Attraction links | Click attraction type | Map query updates |

### Browser Testing

The site was tested on:
- Google Chrome
- Microsoft Edge
- Brave Browser

### HTML Validation

#### HTML Files:
[Index HTML - Validator Result](assets/validation/index-html-validator.png)
[Destinations HTML - Validator Result](assets/validation/destinations-html-validator.png)

### CSS Validation

#### CSS:
[Styles CSS Search Entry 1/2](assets/validation/css-validator-1.png)
[Styles CSS Search Entry 2/2](assets/validation/css-validator-2.png)
[Styles CSS - Validator Result](assets/validation/css-validator-pass.png)

### Responsive Testing

The website was tested across different screen sizes via:
- Chrome Developer Tools
- Mobile Phone/Tablet
- Viewport Simulations

## Performance

Website optimisations include:
- Utilised WEBP image format for faster loading
- Minimised Javascript dependencies 
- Utilised Bootstrap CDN for faster asset delivery
- Responsive image scaling

## Known Bugs

### Bug 1 - Google Maps API Key Exposure

#### Issue
The Google Maps API key is stored in the client side JavaScript file and therefore it can be viewed by users who inspect the page.

#### Resolution
To prevent the unauthorised use of the API key to call upon other Google services I have restricted it to only allow its use with the Google Maps Embed API.

### Bug 2 - Empty Search Bar Submission

#### Issue
Users were able to submit a search without typing into the search box.

#### Resolution
Added a validation check into the script so that empty searches are prevented and added a message to pop up in the browser to remind the user to type into the box.

### Bug 3 - GitHub Pages Path Issues

#### Issue
Hardcoded paths can break when deploying projects through GitHub Pages because repositories use a subdirectory.

#### Resolution
A dynamic base path detection function was implemented which ensures the site works both locally and when deployed.

## Future Improvements

Potential improvements include:
- Adding travel APIs such as TripAdvisor, GeoDB, or OpenTripMap
- Displaying multiple types of attraction markers on the map at the same time
- Allowing users to save favourite destinations
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

