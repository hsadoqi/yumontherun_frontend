const truckAPI = `https://data.sfgov.org/resource/6a9r-agq8.json`
let map
let userLocation = {lat: 37.7946, lng: -122.3999}
let locationFilter

// on load, checks localStorage for address
// default position: downtown San Francisco 
// asks for permission to geolocalize user 

function init(){
    let address = localStorage.getItem('address')
    if(address){
        userLocation = JSON.parse(address)
    } else {
        geolocalizeUser()    
    }
    loadMap(userLocation)
}

// function invoked when user selects to geolocalize position

function geolocalizeUser(){
    navigator.geolocation.getCurrentPosition(
        function (position) {
         let userAddress = JSON.stringify({lat: position.coords.latitude, lng: position.coords.longitude})
         localStorage.setItem('address', userAddress)
         userLocation = JSON.parse(userAddress)
         loadMap(userLocation)
        });
}

// handles event listeners on app

document.addEventListener('click', (e) => {
    if(e.target.id === 'submit-btn'){
        geocodeAddress(e)
    } else if(e.target.id === 'find-btn'){
        geolocalizeUser()
    }
})

// finds lat/long of user input & loads map

function geocodeAddress(e){
    let newAddress = e.target.previousElementSibling.value 
    let geocoder = new google.maps.Geocoder()

    geocoder.geocode({'address': newAddress}, function(results, status) {
        if (status === 'OK') {
            userLocation = results[0].geometry.location
            map.setCenter(userLocation)
            loadMap(userLocation)
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
      });
}

// loads map

function loadMap(userLocation){
    map = new google.maps.Map(document.getElementById('map'), {zoom: 15, center: userLocation});
    createMarker(userLocation)
    fetchAllTrucks()
}

// creates map marker

function createMarker(position){
    new google.maps.Marker({map: map, position: position})
}

// fetch all trucks in api

function fetchAllTrucks(){
    fetch(truckAPI)
    .then(res => res.json())
    .then(trucks => {
        trucks.forEach(truck => {
            if(truck.longitude !== "0" && truck.latitude !== "0"){
                filterTruck(truck)
            }
        })
    })
}

// get distance between user & truck 
// filter based on default filter/user input

function filterTruck(truck){
    let truckLocation = new google.maps.LatLng(truck.location.coordinates[1], truck.location.coordinates[0])
    let newUserLocation = new google.maps.LatLng(userLocation["lat"], userLocation["lng"])
    let distance = google.maps.geometry.spherical.computeDistanceBetween(truckLocation, newUserLocation);
    console.log(distance)
}

function showTruckResult(truck){
    let truckList = document.getElementById('truck-list')
}




