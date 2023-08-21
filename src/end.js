var previousMarker;
var interval;

function initMap() {
  clearInterval(interval);

  var map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 38.987003, lng: -76.942293 },
    zoom: 14,
    disableDefaultUI: true,
  });

  // Disable the zoom control and map type control
  map.setOptions({
    zoomControl: false,
    mapTypeControl: false,
    clickableIcons: false,
  });

  // Create a marker at the clicked location and set it as the previous marker
  previousMarker = new google.maps.Marker({
    position: event.latLng,
    map: map,
  });

  

  // Add a listener for the 'click' event
  map.addListener("click", function (event) {
    // Remove the previous marker if it exists
    if (previousMarker) {
      previousMarker.setMap(null);
    }

    // Create a marker at the clicked location and set it as the previous marker
    previousMarker = new google.maps.Marker({
      position: event.latLng,
      map: map,
    });
  });
}

// Load the Google Maps API
function loadMapScript() {
  var script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDwCIKO3h7vYxfQ22LSsDsNlaQKYomWluE&callback=initMap";
  document.body.appendChild(script);
}

window.onload = initMap;