var map;

const initialLocations = [
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

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 4.652896, lng: -74.054229},
      zoom: 4
    });

    var self = this;

    self.locations = ko.observableArray(initialLocations);

    // CREATE MARKERS
    for (var i = 0; i < initialLocations.length; i++) {
      var marker = new google.maps.Marker({
        map: map,
        position: initialLocations[i].location,
        title: initialLocations[i].title,
        animation: google.maps.Animation.DROP,
      });

      initialLocations[i].marker= marker;

      marker.addListener('click', function () {
        populateInfoWindow(this, largeInfowindow);
      });

      bounds.extend(initialLocations[i].marker.position);
    }

    map.fitBounds(bounds);

    // INPUT SEARCH
    self.query= ko.observable('');

    self.sitesFilter = ko.computed(function(site) {
      var search = self.query().toLowerCase();
      if (!search) {
        for (var i = 0; i < initialLocations.length; i++)
          initialLocations[i].marker.setVisible(true);

        return self.locations();
      } 
      else {
        return ko.utils.arrayFilter(self.locations(), function(site) {
          site.title = site.title.toLowerCase();
          filtered = filter(site.title, search);
          if (filtered) site.marker.setVisible(true);
          else site.marker.setVisible(false);
          return filtered
        });
      }
    }, self);

  };
  ko.applyBindings(new viewModel());
}

function filter (site, letters) {
  site = site || '';
  if (letters.length > site.length) return false;
  return site.substring(0, letters.length) === letters;
};

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
