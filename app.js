var map;


var markers = [];

//array of locations
var locations = [
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
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 4.652896, lng: -74.054229},
    zoom: 4
  });

  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  var viewModel = function () {
    var self = this;
    self.locations = ko.observableArray(locations);
    self.search = ko.computed(function () {
      return ko.utils.arrayFilter(self.places(), function (place) {
          return place.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
      });
    })
  };

// The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
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
