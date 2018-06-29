document.addEventListener(
  "DOMContentLoaded",
  () => {
    //autocomplete
    var placeSearch, autocomplete;

    initAutocomplete();
    //draw map with as a Center my address
    initMap();

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
  //console.log("userRad LAT in script", userRadiusLat);
  //console.log("userRad LNG in script", userRadiusLng);
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: userRadiusLat,
      lng: userRadiusLng
    },
    zoom: 14
  });
  // Add a marker for your user location
  const myMarker = new google.maps.Marker({
    position: {
      lat: userRadiusLat,
      lng: userRadiusLng
    },
    map: map,
    title: "You live here"
  });

  // Center map with user location
  var circle = new google.maps.Circle({
    map: map,
    radius: 2000, // 500 meters
    fillColor: "#AA0000"
  });
  circle.bindTo("center", myMarker, "position");
  var myWindow = new google.maps.InfoWindow({
    content: "This is my home!!"
  });
  myMarker.addListener("click", function() {
    console.log("this should work");
    myWindow.open(map, myMarker);
  });

  users.forEach(function(user) {
    if (
      user.location.coordinates[1] !== userRadiusLat &&
      user.location.coordinates[0] !== userRadiusLng
    ) {
      const center = {
        lat: user.location.coordinates[1],
        lng: user.location.coordinates[0]
      };
      const pin = new google.maps.Marker({
        position: center,
        map: map,
        title: user.name,
        url: "/profile/user._id"
      });
      var userId = user._id;
      console.log("debug userid", user._id.toString());
      var contentString =
        '<h1 id="firstHeading" class="firstHeading">' +
        user.firstNeighm +
        " " +
        user.lastNeighm +
        "</h1>" +
        "<p>Wanna know what your neighbour is up to tonight??</p>" +
        "<a href=/profile/" +
        userId +
        ">" +
        "Check it out here!" +
        "</a>";
      // console.log("debug contentS", contentString);
      markers.push(pin);
      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      pin.addListener("click", function() {
        infowindow.open(map, pin);
      });
    }
  });
}
