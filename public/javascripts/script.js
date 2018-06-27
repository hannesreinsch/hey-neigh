document.addEventListener(
  "DOMContentLoaded",
  () => {
    //autocomplete
    var placeSearch, autocomplete;

    initAutocomplete();
    //draw map with as a Center my address
    initMap();
    placeUsers(users);
    console.log("IronGenerator JS imported successfully!");
  },
  false
);

//global variables

var map;

function initAutocomplete() {
  if (!document.getElementById("autocomplete")) return;
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */ (document.getElementById("autocomplete")),
    { types: ["geocode"] }
  );
  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener("place_changed", fillInAddress);
}

function fillInAddress() {
  var componentForm = {
    street_number: "short_name",
    route: "long_name",
    locality: "long_name",
    administrative_area_level_1: "short_name",
    country: "long_name",
    postal_code: "short_name"
  };
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
  for (var component in componentForm) {
    document.getElementById(component).value = "";
    document.getElementById(component).disabled = false;
  }
  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
  var lat = place.geometry.location.lat();
  var lng = place.geometry.location.lng();
  document.getElementById("lat").value = lat;
  document.getElementById("lng").value = lng;
}

function initMap() {
  markers = [];
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 41.3977381,
      lng: 2.190471916
    },
    zoom: 8
  });

  //retrieve current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const user_location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // Center map with user location
        map.setCenter(user_location);

        // Add a marker for your user location
        const myMarker = new google.maps.Marker({
          position: {
            lat: user_location.lat,
            lng: user_location.lng
          },
          map: map,
          title: "You are here"
        });

        var circle = new google.maps.Circle({
          map: map,
          radius: 500, // 500 meters
          fillColor: "#AA0000"
        });
        circle.bindTo("center", myMarker, "position");
      },
      function() {
        console.log("Error in the geolocation service.");
      }
    );
  } else {
    console.log("Browser does not support geolocation.");
  }
}

function placeUsers(users) {
  users.forEach(function(user) {
    console.log("debug user", user);
    const center = {
      lat: user.location.coordinates[1],
      lng: user.location.coordinates[0]
    };
    const pin = new google.maps.Marker({
      position: center,
      map: map,
      title: user.name
    });
    markers.push(pin);
    var infoWindow = new google.maps.InfoWindow({
      content: user.firstNeighm
    });
    pin.addListener("click", function() {
      infoWindow.open(map, pin);
    });
  });
}
