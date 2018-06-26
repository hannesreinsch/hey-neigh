document.addEventListener(
  "DOMContentLoaded",
  () => {
    //autocomplete
    var placeSearch, autocomplete;
    var componentForm = {
      street_number: "short_name",
      route: "long_name",
      locality: "long_name",
      administrative_area_level_1: "short_name",
      country: "long_name",
      postal_code: "short_name"
    };

    function initAutocomplete() {
      // Create the autocomplete object, restricting the search to geographical
      // location types.
      autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */ (document.getElementById(
          "autocomplete"
        )),
        { types: ["geocode"] }
      );
      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      autocomplete.addListener("place_changed", fillInAddress);
    }

    function fillInAddress() {
      // Get the place details from the autocomplete object.
      var place = autocomplete.getPlace();
      console.log("PLACE", place);
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
    initAutocomplete();

    //draw map with as a Center my current location
    var map;
    function initMap() {
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
          },
          function() {
            console.log("Error in the geolocation service.");
          }
        );
      } else {
        console.log("Browser does not support geolocation.");
      }
    }
    initMap();

    //get addresses of posts around me
    /*function getUsersAround() {
      axios.get("http://localhost:3000/api")
      .then( response => {
        placeUsers(response.data.users)
      })
      .catch(error => {
        next(error)
      })
    }
    //geocoder
    const geocoder = new google.maps.Geocoder();

    document.getElementById("submit").addEventListener("click", function() {
      geocodeAddress(geocoder, map);
    });

    function geocodeAddress(geocoder, resultsMap) {
      let address = document.getElementById("address").value;
      console.log("address");

      geocoder.geocode({ address: address }, function(results, status) {
        if (status === "OK") {
          resultsMap.setCenter(results[0].geometry.location);
          let marker = new google.maps.Marker({
            map: resultsMap,
            position: results[0].geometry.location
          });
          document.getElementById(
            "latitude"
          ).value = results[0].geometry.location.lat();
          document.getElementById(
            "longitude"
          ).value = results[0].geometry.location.lng();
        } else {
          alert(
            "Geocode was not successful for the following reason: " + status
          );
        }
      });
    }
*/
    console.log("IronGenerator JS imported successfully!");
  },
  false
);
