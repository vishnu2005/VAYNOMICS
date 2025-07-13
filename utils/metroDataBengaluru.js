// Bengaluru Metro Routes Data (BMRCL)
// Based on Purple Line and Green Line stations with fare structure

// Purple Line Stations (36 stations)
// Purple and Green line station arrays
const purpleLineStations = [
  "Whitefield", "Channasandra", "Kadugodi", "Pattandur Agrahara", "Sri Sathya Sai Hospital",
  "Nallurhalli", "Kundalahalli", "Sitharama Palya", "Hoodi Junction", "Garudacharapalya",
  "Mahadevapura", "Krishnarajapuram", "Benniganahalli", "Baiyappanahalli", "Swami Vivekananda Road",
  "Indiranagar", "Halasuru", "Trinity", "Mahatma Gandhi Road", "Cubbon Park (Sri Chamarajendra Park)",
  "Dr. BR Ambedkar Station (Vidhana Soudha)", "Sir M. Visveshwaraya Station, Central College",
  "Nadaprabhu Kempegowda station, Majestic", "Krantivira Sangolli Rayanna Railway Station",
  "Madani Road", "Balagangadharanatha Swamiji Station, Hosahalli", "Vijayanagara", "Attitude",
  "Deepanjali Nagara", "Mysuru Road", "Nayandahalli", "Rajarajeshwari Nagar", "Jnana Bharathi",
  "Pattanagere", "Kengeri Bus Terminal", "Challaghatta"
];

const greenLineStations = [
  "Madavara", "Chikkabidarakallu", "Manjunathanagara", "Nagasandra", "Dasarahalli",
  "Jalahalli", "Peenya Industry", "Peenya", "Goraguntepalya", "Yeshwanthpur",
  "Sandal Soap Factory", "Mahalakshmi", "Rajajinagara", "Mahakavi Kuvempu Road", "Srirampura",
  "Mantri Square Sampige Road", "Nadaprabhu Kempegowda Station, Majestic", "Chikkapete",
  "Krishna Rajendra Market", "National College", "Lalbagh", "South End Circle", "Jayanagara",
  "Rashtriya Vidyalaya Road", "Banashankari", "Jayaprakash Nagara", "Yelachenahalli",
  "Konanakunte Cross", "Doddakallasandra", "Vajarahalli", "Thalaghattapura", "Silk Institute"
];

function calculateFare(stationCount) {
  if (stationCount <= 1) return 10;
  if (stationCount <= 3) return 20;
  if (stationCount <= 5) return 30;
  if (stationCount <= 7) return 40;
  if (stationCount <= 9) return 50;
  if (stationCount <= 11) return 60;
  if (stationCount <= 13) return 60;
  if (stationCount <= 15) return 60;
  if (stationCount <= 16) return 70;
  if (stationCount <= 18) return 70;
  if (stationCount <= 20) return 70;
  if (stationCount <= 22) return 80;
  if (stationCount <= 24) return 80;
  if (stationCount <= 26) return 90;
  if (stationCount <= 30) return 90;
  return 90;
}

function generateSameLineRoutes(stations, lineName) {
  const routes = [];
  for (let i = 0; i < stations.length; i++) {
    for (let j = 0; j < stations.length; j++) {
      if (i !== j) {
        const stationCount = Math.abs(j - i);
        const fare = calculateFare(stationCount);
        routes.push({
          source: stations[i].trim(),
          destination: stations[j].trim(),
          fare: fare,
          line: lineName,
          stations: stationCount
        });
      }
    }
  }
  return routes;
}

function generateInterLineRoutes() {
  const routes = [];
  const interchange = "Nadaprabhu Kempegowda station, Majestic";

  const purpleIdx = purpleLineStations.indexOf(interchange);
  const greenIdx = greenLineStations.indexOf(interchange);

  for (let i = 0; i < purpleLineStations.length; i++) {
    if (i !== purpleIdx) {
      for (let j = 0; j < greenLineStations.length; j++) {
        if (j !== greenIdx) {
          const totalStations = Math.abs(i - purpleIdx) + Math.abs(j - greenIdx);
          const fare = calculateFare(totalStations);
          routes.push({
            source: purpleLineStations[i].trim(),
            destination: greenLineStations[j].trim(),
            fare: fare,
            line: "Purple-Green",
            stations: totalStations
          });
        }
      }
    }
  }
  return routes;
}

const allRoutes = [
  ...generateSameLineRoutes(purpleLineStations, "Purple"),
  ...generateSameLineRoutes(greenLineStations, "Green"),
  ...generateInterLineRoutes(),
  ...purpleLineStations.map(station => ({
    source: station.trim(),
    destination: station.trim(),
    fare: 10,
    line: "Purple",
    stations: 0
  })),
  ...greenLineStations.map(station => ({
    source: station.trim(),
    destination: station.trim(),
    fare: 10,
    line: "Green",
    stations: 0
  }))
];

const uniqueRoutes = allRoutes.filter((route, index, self) =>
  index === self.findIndex(r =>
    r.source.toLowerCase() === route.source.toLowerCase() &&
    r.destination.toLowerCase() === route.destination.toLowerCase() &&
    r.fare === route.fare
  )
);

const metroUtils = {
  getRoutesFrom: (station) => {
    const s = station.trim().toLowerCase();
    return uniqueRoutes.filter(route => route.source.toLowerCase() === s);
  },
  getRoutesTo: (station) => {
    const s = station.trim().toLowerCase();
    return uniqueRoutes.filter(route => route.destination.toLowerCase() === s);
  },
  getFare: (source, destination) => {
    const s = source.trim().toLowerCase();
    const d = destination.trim().toLowerCase();
    const route = uniqueRoutes.find(route =>
      route.source.toLowerCase() === s && route.destination.toLowerCase() === d
    );
    return route ? route.fare : null;
  },
  getAllStations: () => {
    const stations = new Set();
    uniqueRoutes.forEach(route => {
      stations.add(route.source);
      stations.add(route.destination);
    });
    return Array.from(stations).sort();
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = metroUtils;
}
