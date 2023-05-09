// Initialize the map
var map = L.map('map').setView([38.9897, -76.9378], 15);

// Add the tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 18,
}).addTo(map);

// Load the building data from localStorage or the API
var buildings = JSON.parse(localStorage.getItem('buildings'));

if (!buildings) {
  fetch('https://api.umd.io/v1/map/buildings')
    .then(response => response.json())
    .then(data => {
      buildings = data;
      localStorage.setItem('buildings', JSON.stringify(buildings));
      initializePage(buildings);
    });
} else {
  initializePage(buildings);
}

// Initialize the page with the building data
function initializePage(buildings) {
    // Add event listeners to the search box and radio buttons
    var searchBox = document.getElementById('search');
    var filterRadios = document.getElementsByName('filter');
    var filterButton = document.getElementById('filter-button');
    var refreshButton = document.getElementById('refresh-button');
    var searchValue = '';

    searchBox.addEventListener('input', function() {
        // Uncheck all radio buttons
        filterRadios.forEach(radio => {
          radio.checked = false;
        });
        searchValue = searchBox.value;
        filterRadios.forEach(radio => {
        radio.addEventListener('change', function() {
          searchBox.value = '';
        });  
      });
    });
    
    filterButton.addEventListener('click', function() {
      filterBuildings(buildings, searchValue, getFilterValue(filterRadios));
    });

    refreshButton.addEventListener('click', function() {
      fetch('https://api.umd.io/v1/map/buildings')
        .then(response => response.json())
        .then(data => {
          buildings = data;
          localStorage.setItem('buildings', JSON.stringify(buildings));
        });
      });
  }


var searchInput = document.getElementById('search');
var searchValue = '';
var filterValue = 'all';

searchInput.addEventListener('input', function() {
  searchValue = this.value;
  filterBuildings(buildings, searchValue, filterValue);
});

var filterButtons = document.getElementsByName('filter');

filterButtons.forEach(button => {
  button.addEventListener('change', function() {
    filterValue = this.value;
    filterBuildings(buildings, searchValue, filterValue);
  });
});
      
// Filter the buildings based on the search box and radio button values
function filterBuildings(buildings, searchValue, filterValue) {
  // Create an array to store the building names that match the filter criteria
  var buildingNames = [];

  // Remove all markers from the map
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  buildings.forEach(building => {
    if (building.name.toLowerCase().includes(searchValue.toLowerCase())) {
      if (!filterValue || filterValue === 'all' || building.category.toLowerCase() === filterValue.toLowerCase()) {
        // Add the building name to the array
        buildingNames.push(building.name);

        // Create a marker for the building and add it to the map
        if (building.lat && building.lng) {
          var marker = L.marker([building.lat, building.lng]).addTo(map);
          marker.bindPopup(building.name);
        }
      }
    }
  });

  // Display the building names that match the filter criteria
  var buildingList = document.getElementById('building-list');
  buildingList.innerHTML = '';

  buildingNames.forEach(name => {
    var listItem = document.createElement('li');
    listItem.textContent = name;
    buildingList.appendChild(listItem);
  });
}


  
// Get the value of the selected radio button
function getFilterValue(radios) {
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        return radios[i].value;
      }
    }
    
    // Return "all" if no radio button is selected
    return "all";
  }


// Fetch the building data from the API and update the localStorage collection
function fetchBuildingData() {
    fetch('https://api.umd.io/v1/map/buildings')
      .then(response => response.json())
      .then(data => {
        buildings = data;
        localStorage.setItem('buildings', JSON.stringify(buildings));
        initializePage(buildings);
      });
  }