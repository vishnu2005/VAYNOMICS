const axios = require("axios");

async function getDistanceDuration(source, destination) {
  // Handle string or array inputs
  const [srcLat, srcLng] = typeof source === 'string' ? source.split(',') : source;
  const [destLat, destLng] = typeof destination === 'string' ? destination.split(',') : destination;

  const apiKey = "5b3ce3597851110001cf62481545ba1355e1484db88065198cb96d17";

  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${srcLng},${srcLat}&end=${destLng},${destLat}`;

  const response = await axios.get(url);
  const route = response.data.features[0];

  return {
    distance: (route.properties.summary.distance / 1000).toFixed(2), // km
    duration: (route.properties.summary.duration / 60).toFixed(2),   // min
    value: {
      distance: route.properties.summary.distance,
      duration: route.properties.summary.duration
    }
  };
}

module.exports = getDistanceDuration;
