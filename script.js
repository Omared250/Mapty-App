'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Implementing a class that keep all the methodos to manage the data
class App {
    #map;
    #mapEvent;

    constructor() {
        // Calling the private methods inside the constructor is going
        // to make that all methods been call inmediately because the constructor
        // is always call when an object is create
        this._getPosition();

        // Adding the events handlers to the constructor to charge them first
        form.addEventListener('submit', this._newWorkOut.bind(this));
        inputType.addEventListener('change', this._toggleElevationField);
    }

    _getPosition() {
        /// Use Geolocation API from the browser
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),
        function() {
        alert('Could not get your position')
        });
    }
    }

    _loadMap(position) {
        const {latitude} = position.coords;
        const {longitude} = position.coords;
    
        const coors = [latitude, longitude];
    
        // Adding the leaflet functionality
        this.#map = L.map('map').setView(coors, 13);
    
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
    
        // Handling clicks on map
        this.#map.on('click', this._showForm.bind(this));
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkOut(e) {
        e.preventDefault();

        // Clear input fields
        inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = '';
        
        // Add the marker to the map
        const {lat, lng} = this.#mapEvent.latlng;
        
        L.marker([lat, lng])
        .addTo(this.#map)
        .bindPopup(L.popup({
            maxWidth : 250,
            minWidth : 100,
            autoClose : false,
            closeOnClick : false,
            className : 'running-popup'
        }))
        .setPopupContent('Workout!')
        .openPopup();

    }
}

// creating the new object base on the App class
const app = new App();