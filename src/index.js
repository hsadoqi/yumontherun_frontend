const truckAPI = `https://data.sfgov.org/resource/6a9r-agq8.json`
// checks for address in localStorage, gets address otherwise 

// automatically load map AND ask for location (add button to recheck address)

function init(){
    let address = localStorage.getItem('address')
    if(address){
        let userAddress = JSON.parse(address)
        loadMap(userAddress)
    } else {    
    navigator.geolocation.getCurrentPosition(
        function (position) {
         let userLocation = JSON.stringify({lat: position.coords.latitude, lng: position.coords.longitude})
         localStorage.setItem('address', userLocation)
         let userAddress = JSON.parse(userLocation)
         loadMap(userAddress)
        });
    }
}

document.addEventListener('click', () => {
    if(e.target.id === 'submit-btn'){
        submitAddress(e)
    }
})

// loads map based on user locatio
function submitAddress(e){
    console.log(e.target.previousElementSibling.value)
}

function loadMap(userLocation){
    let map = new google.maps.Map(document.getElementById('map'), {zoom: 15, center: userLocation});
    new google.maps.Marker({position: userLocation, map: map});

}

// submitBtn.addEventListener('submit', (e) => {
//     console.log(e.target)
// })

// get address from input and apply to map 


// fetch trucks in area based on map location 
    // fetch(truckAPI)
    // .then(res => res.json())
    // .then(trucks => {
    //     trucks.forEach(truck => {
    //         if(truck.longitude !== "0" && truck.latitude !== "0"){
    //             console.log(truck)
    //         }
    //     })
    // })

// list trucks in area 


// add markers to map of each truck's location 



