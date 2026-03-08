// JavaScript for the Destination Guide

// Populate the datalist element with suggestion options
function populateSuggestions(list){
    const data=document.getElementById('citySuggestions');
    if (!data) return;
    data.innerHTML= '';
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