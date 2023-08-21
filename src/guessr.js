var previousMarker;
var interval;
var result;

let name;

function initMap() {
  clearInterval(interval);

  let myMatches = document.cookie.match(/([A-Za-z0-9]+)\=([A-Za-z]+)/);
  name = myMatches[1];
  let difficulty = myMatches[2];

  let radius = 0.785;
  if (difficulty == "easy") {
    radius = 0.585;
  } else if (difficulty == "medium") {
    radius = 0.685;
  }

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

  

  result = getRandomLocation({ lat: 38.987003, lng: -76.942293 }, radius);

  const panorama = new google.maps.StreetViewPanorama(document.getElementById("pano"), {
    position: { lat: result.lat, lng: result.lng },
    pov: { heading: 165, pitch: 0 },
    zoom: 1,

    linksControl: false,
    panControl: false,
    addressControl: false,
    enableCloseButton: false,
    zoomControl: false,
    fullscreenControl: false,
    enableCloseButton: false,
    showRoadLabels: false,
  });

  var map;
  var timerElement = document.getElementById("timer");
  var counter = 20;
  if (difficulty == "easy") {
    counter = 40;
  } else if (difficulty == "medium") {
    counter = 30;
  }

  // Start the timer update interval
  interval = setInterval(updateTimer, 1000);

  function updateTimer() {
    // Update the timer display
    if (counter != -1) {
      timerElement.innerHTML = counter;
      counter--;
    } else {
      //window.location = "./end.html";
      clearInterval(interval);
      noGuess();
    }
  }  

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
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
      },
    });
  });
}

// Load the Google Maps API
function loadMapScript() {
  var script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDwCIKO3h7vYxfQ22LSsDsNlaQKYomWluE&callback=initMap";
  document.body.appendChild(script);
}

function getRandomLocation(center, radius) {
  // center is an object with properties lat and lng
  const lat = center.lat + ((Math.random() * 2 - 1) * radius) / 111;
  const lng = center.lng + ((Math.random() * 2 - 1) * radius) / (111 * Math.cos((center.lat * Math.PI) / 180));
  return { lat, lng };
}

function getUserLocation() {
  clearInterval(interval);
  var position = previousMarker.getPosition();
  var lat = position.lat();
  var lng = position.lng();
  var lat2 = result.lat;
  var lng2 = result.lng;

  var distanceFrom = distance(lat, lng, lat2, lng2);
  console.log(distanceFrom);
  distanceFrom = distanceFrom * 5280;
  distanceFrom = distanceFrom.toFixed(0);
  console.log(distanceFrom);

  function distance(lat1, lon1, lat2, lon2) {
    var R = 3958.8; // Radius of the Earth in miles
    var dLat = toRadians(lat2 - lat1);
    var dLon = toRadians(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var dist = R * c;
    return dist;
  }

  function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  document.querySelector("body").innerHTML = "";
  let newInfo = "";

  newInfo += 
  `<style> 
    html {
      height: 100%;
      background: linear-gradient(to top, rgb(204, 183, 183), rgb(240, 150, 150), rgb(229, 22, 22)); 
      background-size: cover;
    }`;

  newInfo += 
  `#container {
    background-color: white;
    margin: auto;

    border: 1rem solid black;
    border-radius: 10%;
    height: 95%;
    width: 90%;
  }`;

  newInfo += 
  `#resultmap {
    height: 30rem;
    width: 40rem;
    margin: auto;
  }
  #playagain {
    margin-left: 45%;
    font-size: 2rem;
    border: 0.5rem solid black;
    border-radius: 10%;
  }
  
  #distance {
    font-size: 2rem;
    text-align: center;
  }`;
  newInfo += `</style>`;

  newInfo += 
  `
  <div id="container">
    <h1 id="title" style="text-align:center; font-size: 240%"> Round Over! </h1>
    <div id="resultmap"></div>
    <br>
    <div id="distance"></div>
    <br>
    <br>
    <a href = "./home.html"> <input type="button" id="playagain" value="Play Again!"> </a>
  </div>
  `

  document.writeln(newInfo);

  newInfo +=  `<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDwCIKO3h7vYxfQ22LSsDsNlaQKYomWluE"></script>`;


  const standardMap = new google.maps.Map(document.getElementById("resultmap"), {
    center: { lat: 38.987003, lng: -76.942293 },
    zoom: 15,
    disableDefaultUI: true,
  });

  // Disable the zoom control and map type control
  standardMap.setOptions({
    zoomControl: false,
    mapTypeControl: false,
    clickableIcons: false,
  });

  userMarker = new google.maps.Marker({
    position: previousMarker.getPosition(),
    map: standardMap,
    icon: {
      url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    },
  });

  actualMarker = new google.maps.Marker({
    position: result,
    map: standardMap,
  });

  const lineCoordinates = [
    result,
    previousMarker.getPosition()
  ];
  
  const lineOptions = {
    path: lineCoordinates,
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2
  };
  
  document.getElementById("distance").innerHTML = `User ${name} guessed ${distanceFrom} feet away from the actual location!`;

  const line = new google.maps.Polyline(lineOptions);
  line.setMap(standardMap);

  //window.location = "./end.html";
  //document.getElementById("score").innerHTML = `<div style = "background-color: white;"> SAMICKY </div>`;
  //document.querySelector("#score").setAttribute('z-index', '150');
  //document.writeln(`<div id='score' class='gradient'> lol </div>`);
  return { lat, lng };
}

function noGuess() {
  document.querySelector("body").innerHTML = "";
  let newInfo = "";

  newInfo += 
  `<style> 
    html {
      height: 100%;
      background: linear-gradient(to top, rgb(204, 183, 183), rgb(240, 150, 150), rgb(229, 22, 22)); 
      background-size: cover;
    }`;

  newInfo += 
  `#container {
    background-color: white;
    margin: auto;

    border: 1rem solid black;
    border-radius: 10%;
    height: 95%;
    width: 90%;
  }`;

  newInfo += 
  `#resultmap {
    height: 30rem;
    width: 40rem;
    margin: auto;
  }
  
  #playagain {
    margin-left: 45%;
    font-size: 2rem;
    border: 0.5rem solid black;
    border-radius: 10%;
  }`;
  newInfo += `</style>`;

  newInfo += 
  `
  <div id="container">
    <h1 id="title" style="text-align:center; font-size: 240%"> You didn't make a guess! </h1>
    <h1 id="subtitle" style="text-align:center; "> (Here's the location) </h1>
    <div id="resultmap"></div>
    <br>
    <br>
    <a href = "./home.html"> <input type="button" id="playagain" value="Play Again!"> </a>
  </div>
  `

  document.writeln(newInfo);

  newInfo +=  `<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDwCIKO3h7vYxfQ22LSsDsNlaQKYomWluE"></script>`;


  const standardMap = new google.maps.Map(document.getElementById("resultmap"), {
    center: { lat: 38.987003, lng: -76.942293 },
    zoom: 15,
    disableDefaultUI: true,
  });

  // Disable the zoom control and map type control
  standardMap.setOptions({
    zoomControl: false,
    mapTypeControl: false,
    clickableIcons: false,
  });

  actualMarker = new google.maps.Marker({
    position: result,
    map: standardMap,
  });
  
  return { lat, lng };
}

// Call the loadMapScript function when the page loads
window.onload = initMap;
