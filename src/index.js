const truckAPI = `https://data.sfgov.org/resource/6a9r-agq8.json`
let map
let userLocation = {lat: 37.7946, lng: -122.3999}
let trucks = []
let results = 20

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
         init()
        });
}

// handles event listeners on app

document.addEventListener('click', (e) => {
    e.preventDefault()
    if(e.target.id === 'find-btn'){
        geolocalizeUser()
    } else if(e.target.className === 'truck-item'){
        let truckId = e.target.dataset.id
        displayTruckInfo(truckId)
    } 
})

// finds lat/long of user input & loads map

function geocodeAddress(e){
    let newAddress = e.target.children[0].value 
    let geocoder = new google.maps.Geocoder()

    geocoder.geocode({'address': newAddress}, function(results, status) {
        if (status === 'OK') {
            userLocation = results[0].geometry.location
            map.setCenter(userLocation)
            localStorage.setItem('address', JSON.stringify(userLocation))
            init()
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
      });
}

// loads map

function loadMap(userLocation){
    map = new google.maps.Map(document.getElementById('map'), {zoom: 15, center: userLocation});
    createMarker(userLocation, {title: 'Your Location', id: null})

    trucks = []
    results = 20

    fetchAllTrucks()
}

// creates map marker

function createMarker(position, options){
    let marker = new google.maps.Marker({map: map, position: position, title: options['title'], id: options['id']})
    let infowindow = new google.maps.InfoWindow({ content: options["title"]})

    if(options['id'] === null){
        infowindow.open(map, marker)
    }

    marker.addListener('click', () => {
        if(marker.id !== null){
            displayTruckInfo(marker.id)
            infowindow.open(map, marker)
            setTimeout(() => {infowindow.close()}, '2000');
        }
    })
}

// fetch all trucks in api

function fetchAllTrucks(){
    fetch(truckAPI)
    .then(res => res.json())
    .then(trucks => {
        trucks.forEach(truck => {
            if(truck.longitude !== "0" && truck.latitude !== "0" && truck.status === "APPROVED"){
                getTruckDistance(truck)
            }
        })
    }).then(() => {
        if(trucks.length !== 0){
            trucks.sort(compareTruckDistance)
            showTruckResults()
        } else {
            let truckList = document.getElementById('truck-list')
            truckList.innerHTML = ''
            alert('there are no trucks nearby, please choose a different address')
        }
    })
}

// get distance between user & truck, store truck information

function getTruckDistance(truck){
    let truckLocation = new google.maps.LatLng(truck.location.coordinates[1], truck.location.coordinates[0])
    let newUserLocation = new google.maps.LatLng(userLocation["lat"], userLocation["lng"])
    let distance = google.maps.geometry.spherical.computeDistanceBetween(truckLocation, newUserLocation);

    truck.distanceFromUser = distance
    trucks.push(truck)
}

// sort trucks in object & render info for nearby trucks

function showTruckResults(search = null){
    let truckList = document.getElementById('truck-list')
    truckList.innerHTML = ''

    if(!search){
        for(let i = 0; i <= results; i++){
            truckList.innerHTML += showTruck(trucks[i])
        }
    } else {
        for(let i = 0; truckList.childElementCount <= results && i < trucks.length; i ++){
            if(trucks[i].fooditems.toLowerCase().includes(search.toLowerCase())){
                truckList.innerHTML += showTruck(trucks[i])
            }
        }
    }

    let truckResults = document.getElementById('results')

    truckResults.addEventListener('wheel', (e) => {
        if(truckResults.scrollTop === truckResults.scrollHeight - truckResults.clientHeight){
            loadMoreResults()
        }
    })
}

// load more results for nearby trucks 

function loadMoreResults(){
    results += 10 
    showTruckResults()
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
}

// display each truck's info on the results div

function showTruck(truck){
    createMarker({lat: truck.location.coordinates[1], lng: truck.location.coordinates[0]}, {title: truck.applicant, id: truck.objectid})

    return `<li data-id=${truck.objectid} class="truck-item">
    ${truck.applicant}<br><br>
    ${truck.address}<br><br>
    ${truck.fooditems}
    </li>`
    
}

// display more info for truck if selected & link to get directions to truck directly

function displayTruckInfo(truckId){
    let foundTruck = trucks.find(truck => truck.objectid === truckId)
    let truckInfo = document.getElementById('truck-info')

    truckInfo.innerHTML = `<h3>${foundTruck.applicant}</h3>
    <p>${foundTruck.address}</p>
    <a href="https://www.google.com/maps/search/?api=1&query=${foundTruck.location.coordinates[1]},${foundTruck.location.coordinates[0]}">Get Directions</a>
    <p>${foundTruck.fooditems}</p>
    `
    window.scrollTo(0, document.body.scrollHeight)
}


document.addEventListener("submit", (e) => {
    e.preventDefault()
    if(e.target.id === 'map-input'){
        geocodeAddress(e)
    } 
})

document.addEventListener('input', (e) => {
    if(e.target.parentElement.id === 'search-food'){
        showTruckResults(e.target.value)
    }
})



