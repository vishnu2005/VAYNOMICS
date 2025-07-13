// Mumbai Metro Route and Fare Data
// Extracted from Mumbai Metro route PDF and fare table

// Fare structure based on distance slabs
const fareStructure = [
  { slab: 1, distanceRange: "0-3", minKm: 0, maxKm: 3, fare: 10 },
  { slab: 2, distanceRange: "3-12", minKm: 3, maxKm: 12, fare: 20 },
  { slab: 3, distanceRange: "12-18", minKm: 12, maxKm: 18, fare: 30 },
  { slab: 4, distanceRange: "18-24", minKm: 18, maxKm: 24, fare: 40 },
  { slab: 5, distanceRange: "24-30", minKm: 24, maxKm: 30, fare: 50 },
  { slab: 6, distanceRange: "30-36", minKm: 30, maxKm: 36, fare: 60 },
  { slab: 7, distanceRange: "36-42", minKm: 36, maxKm: 42, fare: 70 },
  { slab: 8, distanceRange: ">42", minKm: 42, maxKm: 100, fare: 80 }
];

// Metro lines with stations in order
const metroLines = {
  blueLine1: {
    name: "Blue Line - 1",
    stations: [
      "Versova",
      "D. N. Nagar",
      "Azad Nagar",
      "Andheri",
      "Chakala",
      "Airport Road",
      "Marol Naka",
      "Saki Naka",
      "Ghatkopar"
    ],
    // Approximate distances between consecutive stations (in km)
    distances: [1.2, 1.0, 1.5, 1.8, 1.3, 1.7, 1.4, 2.1]
  },
  
  yellowLine2A: {
    name: "Yellow Line - 2A",
    stations: [
      "Dahisar (E)",
      "Mogra",
      "Jogeshwari (E)",
      "Goregaon (E)",
      "Aarey",
      "Dindoshi",
      "Kurar",
      "Akurli",
      "Poisar",
      "Magathane",
      "Devipada",
      "Rashtriya Udyan",
      "Ovaripada",
      "Andheri (W)",
      "Lower Oshiwara",
      "Oshiwara",
      "Goregaon (W)",
      "Bangur Nagar",
      "Lower Malad",
      "Malad (W)",
      "Valnai",
      "Dahanukarwadi",
      "Kandivali (W)",
      "Shimpoli",
      "Borivali (W)",
      "Eksar",
      "Anand Nagar",
      "Kandarpada",
      "Mandapeshwar"
    ],
    // Approximate distances between consecutive stations (in km)
    distances: [1.5, 1.3, 1.2, 1.8, 1.0, 1.1, 1.0, 0.9, 1.2, 1.1, 1.0, 1.3, 1.7, 1.4, 1.2, 1.5, 1.3, 1.1, 1.2, 1.0, 1.1, 1.3, 1.2, 1.4, 1.0, 1.1, 1.2, 1.3]
  },
  
  redLine7: {
    name: "Red Line - 7",
    stations: [
      "Andheri (E)",
      "WEH",
      "Gundavali",
      "Versova"
    ],
    distances: [2.1, 1.8, 1.6]
  },
  
  aquaLine3: {
    name: "Aqua Line - 3",
    stations: [
      "Seepz",
      "Marol Naka",
      "NESCO",
      "Asalpha",
      "Jagruti Nagar",
      "MIDC - Andheri",
      "Sahar Road",
      "CSMI - Airport T1",
      "Santacruz Metro",
      "Bandra Colony",
      "CSMI - Airport - T2",
      "Bandra-Kurla Complex",
      "Aarey JVLR"
    ],
    distances: [1.4, 1.6, 1.3, 1.2, 1.5, 1.1, 1.3, 1.7, 1.4, 1.2, 1.8, 2.0]
  }
};

// Function to calculate fare based on distance
function calculateFare(distance) {
  for (let slab of fareStructure) {
    if (distance >= slab.minKm && distance < slab.maxKm) {
      return slab.fare;
    }
  }
  // If distance is greater than 42 km
  return fareStructure[fareStructure.length - 1].fare;
}

// Function to find distance between two stations on the same line
function getDistanceBetweenStations(line, station1, station2) {
  const stations = line.stations;
  const distances = line.distances;
  
  const index1 = stations.findIndex(s => s.trim().toLowerCase() === station1.trim().toLowerCase());
  const index2 = stations.findIndex(s => s.trim().toLowerCase() === station2.trim().toLowerCase());
  
  if (index1 === -1 || index2 === -1) {
    return null; // Station not found
  }
  
  const startIndex = Math.min(index1, index2);
  const endIndex = Math.max(index1, index2);
  
  let totalDistance = 0;
  for (let i = startIndex; i < endIndex; i++) {
    totalDistance += distances[i];
  }
  
  return parseFloat(totalDistance.toFixed(2));
}

// Generate all possible routes with fares
function generateAllRoutes() {
  const allRoutes = [];
  
  // Process each metro line
  Object.values(metroLines).forEach(line => {
    const stations = line.stations;
    
    // Generate routes between all station pairs on the same line
    for (let i = 0; i < stations.length; i++) {
      for (let j = i + 1; j < stations.length; j++) {
        const distance = getDistanceBetweenStations(line, stations[i], stations[j]);
        const fare = calculateFare(distance);
        
        // Add route in both directions
        allRoutes.push({
          from: stations[i],
          to: stations[j],
          fare: fare,
          distance: distance,
          line: line.name
        });
        
        allRoutes.push({
          from: stations[j],
          to: stations[i],
          fare: fare,
          distance: distance,
          line: line.name
        });
      }
    }
  });
  
  // Add interchange routes (approximate distances for cross-line transfers)
  const interchangeRoutes = [
    // Blue Line to Yellow Line via Andheri
    { from: "Andheri", to: "Andheri (W)", distance: 0.5, line: "Interchange" },
    { from: "Andheri (W)", to: "Andheri", distance: 0.5, line: "Interchange" },
    
    // Marol Naka interchange (Blue Line to Aqua Line)
    { from: "Marol Naka", to: "Marol Naka", distance: 0, line: "Interchange" },
    
    // Versova interchange (Blue Line to Red Line)
    { from: "Versova", to: "Versova", distance: 0, line: "Interchange" }
  ];
  
  interchangeRoutes.forEach(route => {
    const fare = calculateFare(route.distance);
    allRoutes.push({
      from: route.from,
      to: route.to,
      fare: fare,
      distance: route.distance,
      line: route.line
    });
  });
  
  return allRoutes;
}

// Generate the complete route data
const mumbaiMetroRoutes = generateAllRoutes();

// Utility functions
const metroUtils = {
  getRoutesFrom: (station) => {
    return mumbaiMetroRoutes.filter(route =>
      route.from.trim().toLowerCase() === station.trim().toLowerCase()
    );
  },
  getRoutesTo: (station) => {
    return mumbaiMetroRoutes.filter(route =>
      route.to.trim().toLowerCase() === station.trim().toLowerCase()
    );
  },
  getFare: (from, to) => {
    const route = mumbaiMetroRoutes.find(route =>
      route.from.trim().toLowerCase() === from.trim().toLowerCase() &&
      route.to.trim().toLowerCase() === to.trim().toLowerCase()
    );
    return route ? route.fare : null;
  },
  getAllStations: () => {
    const stations = new Set();
    Object.values(metroLines).forEach(line =>
      line.stations.forEach(station => stations.add(station))
    );
    return Array.from(stations).sort();
  },
  getStationsByLine: (lineName) => {
    const line = Object.values(metroLines).find(l =>
      l.name.trim().toLowerCase() === lineName.trim().toLowerCase()
    );
    return line ? line.stations : [];
  },
  calculateFareByDistance: (distance) => calculateFare(distance),
  getFareStructure: () => fareStructure
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = metroUtils;
}
