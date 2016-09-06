var map;


var markers = [];

//array of locations
var initialLocations = [
  {
    title: 'Juan Valdéz', 
    location: {
      lat: 4.653642,
      lng: -74.054523
    }
  },
  {
    title: 'Philippe',
    location: {
      lat: 4.652989,
      lng: -74.05379
    }
  },
  {
    title: 'Wok',
    location: {
      lat: 4.654791,
      lng: -74.057396
    }
  },
  {
    title: 'Home Burgers',
    location: {
      lat: 4.654382,
      lng: -74.052918
    }
  },
  {
    title: 'Mordida Bistro',
    location: {
      lat: 4.655172,
      lng: -74.058377
    }
  }
];


function initMap() {

  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  var viewModel = function () {
    //Variable to keep references of "this" inside the View Model
    var self = this;

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 4.652896, lng: -74.054229},
      zoom: 4
    });

    //Create observable array for markers
    self.locations = ko.observableArray(initialLocations);

    // self.search = ko.computed(function () {
    //   return ko.utils.arrayFilter(self.places(), function (place) {
    //       return place.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
    //   });
    // })


    // The following group uses the location array to create an array of markers on initialize.
      for (var i = 0; i < self.locations.length; i++) {
        var position = self.locations[i].location;
        var title = self.locations[i].title;
        //create marker per location
        var marker = new google.maps.Marker({
          map: map,
          position: position,
          title: title,
          animation: google.maps.Animation.DROP,
          id: i
        });
        //markers array
        markers.push(marker);
        marker.addListener('click', function () {
          populateInfoWindow(this, largeInfowindow);
        });
        bounds.extend(markers[i].position);
      }
      //extend boundaries

      map.fitBounds(bounds);


      //Create a ko.computed for the filtering of the list and the markers
      self.filteredPlaces = ko.computed(function(placeItem) {
        debugger
        var filter = self.query().toLowerCase();
        //If there is nothing in the filter, return the full list and all markers are visible
        if (!filter) {
          self.markerArray().forEach(function(placeItem) {
            placeItem.marker.setVisible(true);
          });
          return self.markerArray();
        //If a search is entered, compare search data to place names and show only list items and markers that match the search value
        } 
        else {
            return ko.utils.arrayFilter(self.markerArray(), function(placeItem) {
              is_filtered = stringStartsWith(placeItem.name.toLowerCase(), filter);
              //Show markers that match the search value and return list items that match the search value
               if (is_filtered) {
                  placeItem.marker.setVisible(true);
                  console.log("clicked");
                  return is_filtered
                }
              //Hide markers that do not match the search value
               else {
                  placeItem.marker.setVisible(false);
                  return is_filtered
                }
            });
        }
      }, self);


  };
  ko.applyBindings(new viewModel());
}


function populateInfoWindow(marker, infowindow) {
  if (infowindow.marker != marker) {
    infowindow.marker = marker;

    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    infowindow.marker.setAnimation(google.maps.Animation.BOUNCE);

    infowindow.addListener('closeclick', function () {
      infowindow.marker.setAnimation(null);
    });
  }
}
