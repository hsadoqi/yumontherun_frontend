const truckAPI = `https://data.sfgov.org/resource/6a9r-agq8.json`
let map
let userLocation = {lat: 37.7946, lng: -122.3999}
let locationFilter = '5'
let trucks = { 
    '5': [],
    '10': [], 
    '15': []
}

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

async function fetchAllTrucks(){
    await fetch(truckAPI)
    .then(res => res.json())
    .then(trucks => {
        trucks.forEach(truck => {
            if(truck.longitude !== "0" && truck.latitude !== "0" && truck.status === "APPROVED"){
                getTruckDistance(truck)
            }
        })
    })
    showTruckResults()
}

// get distance between user & truck, store truck information

function getTruckDistance(truck){
    let truckLocation = new google.maps.LatLng(truck.location.coordinates[1], truck.location.coordinates[0])
    let newUserLocation = new google.maps.LatLng(userLocation["lat"], userLocation["lng"])
    let distance = google.maps.geometry.spherical.computeDistanceBetween(truckLocation, newUserLocation);
    truck.distanceFromUser = distance
    if(distance <= 8000){
        trucks['5'].push(truck)
    } else if(distance <= 16000 && distance > 8000){
        trucks['10'].push(truck)
    } else if(distance <= 24000 && distance > 16000){
        trucks['15'].push(truck)
    }
}

// sort trucks in object based on set filter 

function showTruckResults(){
    trucks[locationFilter].sort(compareTruckDistance)
    console.log(trucks[locationFilter])
}

// compare truck distances

function compareTruckDistance(truck1, truck2){
    let comparison = 0 
    if(truck1.distanceFromUser > truck2.distanceFromUser){
        comparison = 1
    } else if(truck1.distanceFromUser < truck2.distanceFromUser){
        comparison = -1 
    }
    return comparison
    console.log(comparison)
}

function showTruck(truck){
    let truckList = document.getElementById('truck-list')
    
}





