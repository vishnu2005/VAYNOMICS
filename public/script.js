// let map;
// let routeLayer = null;
// let markerSource = null;
// let markerDest = null;
// let priceChartInstance = null;
// let durationChartInstance = null;
// let globalRides = [];

// window.onload = function () {
//   map = L.map('map').setView([12.9716, 77.5946], 10);
//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
// };

// async function getRoute() {
//   const sourcePlace = document.getElementById("source").value;
//   const destPlace = document.getElementById("destination").value;
//   const mileage = parseFloat(document.getElementById("mileage").value);
//   const fuelPrice = parseFloat(document.getElementById("fuelPrice").value);

//   if (!mileage || !fuelPrice) {
//     alert("Please enter both mileage and fuel price.");
//     return;
//   }
//   if (!sourcePlace || !destPlace) {
//     alert("Please enter both source and destination.");
//     return;
//   }

//   try {
//     const coordsSource = await geocodePlace(sourcePlace);
//     const coordsDest = await geocodePlace(destPlace);

//     if (!coordsSource || !coordsDest) {
//       alert("Could not find coordinates for entered locations.");
//       return;
//     }

//     addMarkers(coordsSource, coordsDest);
//     await drawRoute(coordsSource, coordsDest);

//     const res = await fetch("http://localhost:5000/rides", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         sourceCoords: [coordsSource.lat, coordsSource.lng],
//         destCoords: [coordsDest.lat, coordsDest.lng],
//         sourceName: sourcePlace,
//         destName: destPlace,
//         mileage,
//         fuelPrice
//       })
//     });

//     const data = await res.json();
//     if (data.rides) {
//       renderRides(data.rides);
//       generateCharts(data.rides);
//     } else {
//       alert("Failed to fetch ride options.");
//     }

//   } catch (err) {
//     console.error(err);
//     alert("An error occurred while fetching route or rides.");
//   }
// }

// async function geocodePlace(place) {
//   const apiKey = "5b3ce3597851110001cf62481545ba1355e1484db88065198cb96d17";
//   const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(place)}`;

//   const res = await fetch(url);
//   const data = await res.json();
//   if (data.features && data.features.length > 0) {
//     return {
//       lat: data.features[0].geometry.coordinates[1],
//       lng: data.features[0].geometry.coordinates[0]
//     };
//   }
//   return null;
// }

// function addMarkers(source, destination) {
//   if (markerSource) map.removeLayer(markerSource);
//   if (markerDest) map.removeLayer(markerDest);

//   markerSource = L.marker([source.lat, source.lng]).addTo(map).bindPopup("Source").openPopup();
//   markerDest = L.marker([destination.lat, destination.lng]).addTo(map).bindPopup("Destination").openPopup();
// }

// async function drawRoute(source, destination) {
//   if (routeLayer) map.removeLayer(routeLayer);

//   const apiKey = "5b3ce3597851110001cf62481545ba1355e1484db88065198cb96d17";
//   const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${source.lng},${source.lat}&end=${destination.lng},${destination.lat}`;

//   const res = await fetch(url);
//   const data = await res.json();

//   const coords = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
//   routeLayer = L.polyline(coords, { color: "blue" }).addTo(map);
//   map.fitBounds(routeLayer.getBounds());
// }

// function renderRides(rides) {
//   globalRides = rides;

//   const container = document.getElementById("ride-options");
//   container.innerHTML = `
//     <table class="ride-table">
//       <thead>
//         <tr>
//           <th>Service</th>
//           <th>Price (₹)</th>
//           <th>Duration (min)</th>
//           <th>Note</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${rides.map(ride => {
//           let note = ride.message || "";
//           if (ride.service.toUpperCase().includes("RAPIDO CAR")) {
//             note = "Cab Economy / Lowest Fare Option";
//           }
//           return `
//             <tr>
//               <td>${ride.service}</td>
//               <td>${ride.price}</td>
//               <td>${ride.duration}</td>
//               <td>${note}</td>
//             </tr>
//           `;
//         }).join('')}
//       </tbody>
//     </table>
//   `;

//   generateExternalLinks();
// }


// function generateExternalLinks() {
//   const source = document.getElementById("source").value.trim();
//   const destination = document.getElementById("destination").value.trim();
//   const linksContainer = document.getElementById("external-links");

//   if (!source || !destination) {
//     linksContainer.innerHTML = "";
//     return;
//   }

//   const uberURL = `https://m.uber.com/?pickup=&dropoff[formatted_address]=${encodeURIComponent(destination)}`;
//   const rapidoURL = `https://www.rapido.bike/`;

//   linksContainer.innerHTML = `
//     <h3>Want to Book Directly?</h3>
//     <div class="card-container">
//       <div class="link-card">
//         <h4>Book with Uber</h4>
//         <p>View your route & fare on Uber's platform.</p>
//         <a href="${uberURL}" target="_blank">Go to Uber</a>
//       </div>
//       <div class="link-card">
//         <h4>Book with Rapido</h4>
//         <p>Explore Rapido's bike & car options.</p>
//         <a href="${rapidoURL}" target="_blank">Go to Rapido</a>
//       </div>
//     </div>
//   `;
// }

// function sortRides() {
//   const sortValue = document.getElementById("sortOptions").value;
//   let sortedRides = [...globalRides];

//   const extractLowerFare = (priceStr) => {
//     if (typeof priceStr !== 'string') return parseFloat(priceStr);
//     if (priceStr.includes("–")) {
//       return parseFloat(priceStr.split("–")[0].replace(/[₹\s]/g, ""));
//     }
//     return parseFloat(priceStr.replace(/[₹\s]/g, ""));
//   };

//   if (sortValue === "priceLow") {
//     sortedRides.sort((a, b) => extractLowerFare(a.price) - extractLowerFare(b.price));
//   } else if (sortValue === "priceHigh") {
//     sortedRides.sort((a, b) => extractLowerFare(b.price) - extractLowerFare(a.price));
//   } else if (sortValue === "durationLow") {
//     sortedRides.sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration));
//   } else if (sortValue === "durationHigh") {
//     sortedRides.sort((a, b) => parseFloat(b.duration) - parseFloat(a.duration));
//   }

//   renderRides(sortedRides);
//   generateCharts(sortedRides);
// }

// function generateCharts(rides) {
//   const labels = rides.map(ride => ride.service);
//   const prices = rides.map(ride => {
//     const match = typeof ride.price === "string" && ride.price.includes("–")
//       ? ride.price.split("–")[0].replace(/[₹\s]/g, "")
//       : ride.price;
//     const p = parseFloat(match);
//     return isNaN(p) ? 0 : p;
//   });
//   const durations = rides.map(ride => {
//     const d = parseFloat(ride.duration);
//     return isNaN(d) ? 0 : d;
//   });

//   if (priceChartInstance) priceChartInstance.destroy();
//   if (durationChartInstance) durationChartInstance.destroy();

//   const ctxPrice = document.getElementById("priceChart").getContext("2d");
//   priceChartInstance = new Chart(ctxPrice, {
//     type: 'bar',
//     data: {
//       labels,
//       datasets: [{
//         label: 'Price (₹)',
//         data: prices,
//         backgroundColor: 'rgba(54, 162, 235, 0.7)',
//         borderColor: 'rgba(54, 162, 235, 1)',
//         borderWidth: 1
//       }]
//     },
//     options: {
//       scales: { y: { beginAtZero: true } }
//     }
//   });

//   const ctxDuration = document.getElementById("durationChart").getContext("2d");
//   durationChartInstance = new Chart(ctxDuration, {
//     type: 'bar',
//     data: {
//       labels,
//       datasets: [{
//         label: 'Duration (minutes)',
//         data: durations,
//         backgroundColor: 'rgba(255, 159, 64, 0.7)',
//         borderColor: 'rgba(255, 159, 64, 1)',
//         borderWidth: 1
//       }]
//     },
//     options: {
//       scales: { y: { beginAtZero: true } }
//     }
//   });
// }

// Enhanced Error Handling System for VAYNOMICS

let map;
let routeLayer = null;
let markerSource = null;
let markerDest = null;
let priceChartInstance = null;
let durationChartInstance = null;
let globalRides = [];

// Valid cities for the application
const VALID_CITIES = ['chennai', 'bengaluru', 'mumbai', 'delhi'];

window.onload = function () {
  map = L.map('map').setView([12.9716, 77.5946], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  
  // Add event listeners for real-time validation
  addInputValidationListeners();
};

function addInputValidationListeners() {
  const sourceInput = document.getElementById('source');
  const destInput = document.getElementById('destination');
  const mileageInput = document.getElementById('mileage');
  const fuelInput = document.getElementById('fuelPrice');
  
  // Real-time validation on input change
  sourceInput.addEventListener('input', () => validateInput('source'));
  destInput.addEventListener('input', () => validateInput('destination'));
  mileageInput.addEventListener('input', () => validateInput('mileage'));
  fuelInput.addEventListener('input', () => validateInput('fuelPrice'));
  
  // Clear errors on focus
  sourceInput.addEventListener('focus', () => clearError('source'));
  destInput.addEventListener('focus', () => clearError('destination'));
  mileageInput.addEventListener('focus', () => clearError('mileage'));
  fuelInput.addEventListener('focus', () => clearError('fuelPrice'));
}

function validateInput(inputId) {
  const input = document.getElementById(inputId);
  const value = input.value.trim();
  
  switch(inputId) {
    case 'source':
    case 'destination':
      return validateLocationInput(inputId, value);
    case 'mileage':
    case 'fuelPrice':
      return validateNumericInput(inputId, value);
    default:
      return true;
  }
}

function validateLocationInput(inputId, value) {
  const input = document.getElementById(inputId);
  const errorElement = document.getElementById(`${inputId}-error`);
  
  if (!value) {
    return true; // Don't show error for empty field until form submission
  }
  
  // Check format: should contain comma
  if (!value.includes(',')) {
    showError(inputId, 'Please enter in correct format: Placename,Cityname');
    return false;
  }
  
  // Extract city name (after comma)
  const parts = value.split(',');
  if (parts.length < 2) {
    showError(inputId, 'Please enter in correct format: Placename,Cityname');
    return false;
  }
  
  const cityName = parts[1].trim().toLowerCase();
  
  // Check if city is valid
  if (!VALID_CITIES.includes(cityName)) {
    showError(inputId, 'Please enter only valid cities: Chennai, Bengaluru, Mumbai, Delhi');
    return false;
  }
  
  // If all validations pass, clear any existing error
  clearError(inputId);
  return true;
}

function validateNumericInput(inputId, value) {
  const input = document.getElementById(inputId);
  
  if (!value) {
    return true; // Don't show error for empty field until form submission
  }
  
  const numValue = parseFloat(value);
  if (isNaN(numValue) || numValue <= 0) {
    const fieldName = inputId === 'mileage' ? 'mileage' : 'fuel cost';
    showError(inputId, `Please enter a valid ${fieldName}`);
    return false;
  }
  
  clearError(inputId);
  return true;
}

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorElement = document.getElementById(`${inputId}-error`);
  
  // Add error styling to input
  input.classList.add('error-input');
  
  // Show error message
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

function clearError(inputId) {
  const input = document.getElementById(inputId);
  const errorElement = document.getElementById(`${inputId}-error`);
  
  // Remove error styling
  input.classList.remove('error-input');
  
  // Hide error message
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}

function showMapError(message) {
  const mapErrorElement = document.getElementById('map-error');
  if (mapErrorElement) {
    mapErrorElement.textContent = message;
    mapErrorElement.style.display = 'block';
  }
}

function clearMapError() {
  const mapErrorElement = document.getElementById('map-error');
  if (mapErrorElement) {
    mapErrorElement.textContent = '';
    mapErrorElement.style.display = 'none';
  }
}

function validateForm() {
  const sourcePlace = document.getElementById("source").value.trim();
  const destPlace = document.getElementById("destination").value.trim();
  const mileage = document.getElementById("mileage").value.trim();
  const fuelPrice = document.getElementById("fuelPrice").value.trim();
  
  let isValid = true;
  
  // Clear previous map errors
  clearMapError();
  
  // Validate source
  if (!sourcePlace) {
    showError('source', 'Please enter source location');
    isValid = false;
  } else if (!validateLocationInput('source', sourcePlace)) {
    isValid = false;
  }
  
  // Validate destination
  if (!destPlace) {
    showError('destination', 'Please enter destination location');
    isValid = false;
  } else if (!validateLocationInput('destination', destPlace)) {
    isValid = false;
  }
  
  // Validate mileage
  if (!mileage) {
    showError('mileage', 'Please enter mileage of your vehicle');
    isValid = false;
  } else if (!validateNumericInput('mileage', mileage)) {
    isValid = false;
  }
  
  // Validate fuel price
  if (!fuelPrice) {
    showError('fuelPrice', 'Please enter fuel cost per litre');
    isValid = false;
  } else if (!validateNumericInput('fuelPrice', fuelPrice)) {
    isValid = false;
  }
  
  return isValid;
}

async function getRoute() {
  // Validate form before proceeding
  if (!validateForm()) {
    return;
  }
  
  const sourcePlace = document.getElementById("source").value.trim();
  const destPlace = document.getElementById("destination").value.trim();
  const mileage = parseFloat(document.getElementById("mileage").value);
  const fuelPrice = parseFloat(document.getElementById("fuelPrice").value);

  try {
    // Clear any previous map errors
    clearMapError();
    
    const coordsSource = await geocodePlace(sourcePlace);
    const coordsDest = await geocodePlace(destPlace);

    if (!coordsSource || !coordsDest) {
      showMapError("We're not currently serving this location 📍");
      return;
    }

    addMarkers(coordsSource, coordsDest);
    
    try {
      await drawRoute(coordsSource, coordsDest);
    } catch (routeError) {
      showMapError("Unable to calculate route between the specified locations. Please try different locations.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCoords: [coordsSource.lat, coordsSource.lng],
          destCoords: [coordsDest.lat, coordsDest.lng],
          sourceName: sourcePlace,
          destName: destPlace,
          mileage,
          fuelPrice
        })
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      if (data.rides && data.rides.length > 0) {
        renderRides(data.rides);
        generateCharts(data.rides);
      } else {
        showMapError("No ride options available for this route. Please try a different route.");
      }
    } catch (serverError) {
      showMapError("Unable to fetch ride information at the moment. Please try again later.");
    }

  } catch (err) {
    console.error('Error in getRoute:', err);
    showMapError("An unexpected error occurred. Please check your internet connection and try again.");
  }
}

async function geocodePlace(place) {
  const apiKey = "5b3ce3597851110001cf62481545ba1355e1484db88065198cb96d17";
  const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(place)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Geocoding API error: ${res.status}`);
    }
    
    const data = await res.json();
    if (data.features && data.features.length > 0) {
      return {
        lat: data.features[0].geometry.coordinates[1],
        lng: data.features[0].geometry.coordinates[0]
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

function addMarkers(source, destination) {
  if (markerSource) map.removeLayer(markerSource);
  if (markerDest) map.removeLayer(markerDest);

  markerSource = L.marker([source.lat, source.lng]).addTo(map).bindPopup("Source").openPopup();
  markerDest = L.marker([destination.lat, destination.lng]).addTo(map).bindPopup("Destination").openPopup();
}

async function drawRoute(source, destination) {
  if (routeLayer) map.removeLayer(routeLayer);

  const apiKey = "5b3ce3597851110001cf62481545ba1355e1484db88065198cb96d17";
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${source.lng},${source.lat}&end=${destination.lng},${destination.lat}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Routing API error: ${res.status}`);
    }
    
    const data = await res.json();
    
    if (!data.features || data.features.length === 0) {
      throw new Error('No route found');
    }

    const coords = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
    routeLayer = L.polyline(coords, { color: "blue" }).addTo(map);
    map.fitBounds(routeLayer.getBounds());
  } catch (error) {
    console.error('Route drawing error:', error);
    throw error; // Re-throw to handle in getRoute()
  }
}

function renderRides(rides) {
  globalRides = rides;

  const container = document.getElementById("ride-options");
  container.innerHTML = `
    <table class="ride-table">
      <thead>
        <tr>
          <th>Service</th>
          <th>Price (₹)</th>
          <th>Duration (min)</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        ${rides.map(ride => {
          let note = ride.message || "";
          if (ride.service.toUpperCase().includes("RAPIDO CAR")) {
            note = "Cab Economy / Lowest Fare Option";
          }
          return `
            <tr>
              <td>${ride.service}</td>
              <td>${ride.price}</td>
              <td>${ride.duration}</td>
              <td>${note}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;

  generateExternalLinks();
}

function generateExternalLinks() {
  const source = document.getElementById("source").value.trim();
  const destination = document.getElementById("destination").value.trim();
  const linksContainer = document.getElementById("external-links");

  if (!source || !destination) {
    linksContainer.innerHTML = "";
    return;
  }

  const uberURL = `https://m.uber.com/?pickup=&dropoff[formatted_address]=${encodeURIComponent(destination)}`;
  const rapidoURL = `https://www.rapido.bike/`;

  linksContainer.innerHTML = `
    <h3>Want to Book Directly?</h3>
    <div class="card-container">
      <div class="link-card">
        <h4>Book with Uber</h4>
        <p>View your route & fare on Uber's platform.</p>
        <a href="${uberURL}" target="_blank">Go to Uber</a>
      </div>
      <div class="link-card">
        <h4>Book with Rapido</h4>
        <p>Explore Rapido's bike & car options.</p>
        <a href="${rapidoURL}" target="_blank">Go to Rapido</a>
      </div>
    </div>
  `;
}

function sortRides() {
  const sortValue = document.getElementById("sortOptions").value;
  let sortedRides = [...globalRides];

  const extractLowerFare = (priceStr) => {
    if (typeof priceStr !== 'string') return parseFloat(priceStr);
    if (priceStr.includes("–")) {
      return parseFloat(priceStr.split("–")[0].replace(/[₹\s]/g, ""));
    }
    return parseFloat(priceStr.replace(/[₹\s]/g, ""));
  };

  if (sortValue === "priceLow") {
    sortedRides.sort((a, b) => extractLowerFare(a.price) - extractLowerFare(b.price));
  } else if (sortValue === "priceHigh") {
    sortedRides.sort((a, b) => extractLowerFare(b.price) - extractLowerFare(a.price));
  } else if (sortValue === "durationLow") {
    sortedRides.sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration));
  } else if (sortValue === "durationHigh") {
    sortedRides.sort((a, b) => parseFloat(b.duration) - parseFloat(a.duration));
  }

  renderRides(sortedRides);
  generateCharts(sortedRides);
}

function generateCharts(rides) {
  const labels = rides.map(ride => ride.service);
  const prices = rides.map(ride => {
    const match = typeof ride.price === "string" && ride.price.includes("–")
      ? ride.price.split("–")[0].replace(/[₹\s]/g, "")
      : ride.price;
    const p = parseFloat(match);
    return isNaN(p) ? 0 : p;
  });
  const durations = rides.map(ride => {
    const d = parseFloat(ride.duration);
    return isNaN(d) ? 0 : d;
  });

  if (priceChartInstance) priceChartInstance.destroy();
  if (durationChartInstance) durationChartInstance.destroy();

  const ctxPrice = document.getElementById("priceChart").getContext("2d");
  priceChartInstance = new Chart(ctxPrice, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Price (₹)',
        data: prices,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } }
    }
  });

  const ctxDuration = document.getElementById("durationChart").getContext("2d");
  durationChartInstance = new Chart(ctxDuration, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Duration (minutes)',
        data: durations,
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } }
    }
  });
}