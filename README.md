# Yum On The Run

Hungry in the SF area? Find local food trucks near you or input a specific location to view nearby food trucks on a map. 

#### [Check it out here](https://yumontherun.herokuapp.com)

## Road Map 

This project was built entirely using front-end technologies. I chose not to create a back-end because I felt it was unnecessary to store any user or location data at this point in the project. 

On load, you will be prompted to allow the browser to geolocalize them; if you do not see the prompt, please check your browser settings to allow access. If you opt out of sharing your location on load, you can always click the button next to the search input field on the bottom left of the map to trigger the geolocalization again. 

You can also manually enter an address in the input field on the bottom left of the map and find nearby food trucks to that location. 

On the right side of the map, there is a list of 20 nearby food trucks by default. Continue scrolling to see more. There are also collaborating markers on the map to indicate your location as well as the location of the food trucks. Click either the marker or the item in the list to see more information at the bottom of page. There, you will find a link to "Get Directions," which will relocate you to Google Maps for more precise directions.

If you would like to search for a particular food item, use the search bar on the top right of the truck list. This will list all the trucks nearby that serve that item. Scroll down for more results. 

If there are no food trucks within 15 miles, you will get an error requesting a new address. 

## Features 

- Geolocalize user
- Find location by geocoding address input
- Sort food trucks based on distance from user
- Show food trucks nearby based on said distance
- Search food trucks for specific food items

## Stretch Goals

Allow User to:
  - [ ] sign in
  - [ ] save favorite food trucks
  - [ ] rate food trucks
  - [ ] share location of truck straight from app
  - [ ] filter food trucks based on cuisine
  - [ ] view ratings of food truck based on yelp/google data

### Technologies/Languages:
- JavaScript 
- HTML5
- CSS

### APIs:
- [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/tutorial)
- [Geocoding API](https://developers.google.com/maps/documentation/geocoding/start)

### Sources:
- [DataSF:FoodTrucks](https://data.sfgov.org/Economy-and-Community/Mobile-Food-Facility-Permit/rqzj-sfat)

#### [Connect with me!](https://www.linkedin.com/in/hanaasadoqi/)
