// utils/rapidoFareEstimator.js

// Surge multiplier based on time
function getRapidoSurgeMultiplier() {
  const hour = new Date().getHours();

  if (hour >= 7 && hour < 10) return 1.3;     // Morning peak
  if (hour >= 17 && hour < 21) return 1.4;    // Evening peak
  if (hour >= 22 || hour < 5) return 1.2;     // Night
  return 1.0;                                 // Off-peak
}

// Fare config by city and type
const fareConfig = {
  chennai: {
    bike: { base: 20, perKm: 6.5, perMin: 0.75 },
    car: { base: 35, perKm: 11, perMin: 1.5 }
  },
  bengaluru: {
    bike: { base: 25, perKm: 7, perMin: 1 },
    car: { base: 40, perKm: 12, perMin: 2 }
  },
    mumbai: {
    bike: { base: 25, perKm: 7.5, perMin: 1.2 },
    car:  { base: 45, perKm: 13, perMin: 2.2 }
  },
  delhi: {
    bike: { base: 30, perKm: 7, perMin: 1 },
    car: { base: 50, perKm: 12.5, perMin: 2.5 }
  }
};

// Estimate duration based on average speed (25 km/h)
function estimateRapidoDuration(distanceKm) {
  const avgSpeed = 25; // km/h
  const durationMin = (distanceKm / avgSpeed) * 60;
  return Math.round(durationMin);
}

// Main function to estimate fare
function getRapidoEstimate(distanceKm, type = "bike", city = "chennai") {
  const surge = getRapidoSurgeMultiplier();
  const durationMin = estimateRapidoDuration(distanceKm);
  const cityKey = city.toLowerCase();

  const cityRates = fareConfig[cityKey] || fareConfig["chennai"];
  const rates = cityRates[type] || cityRates["bike"];

  const rawFare = rates.base + (rates.perKm * distanceKm) + (rates.perMin * durationMin);
  const finalFare = rawFare * surge;

  return {
    distanceKm: distanceKm.toFixed(2),
    durationMin,
    estimatedFare: Math.round(finalFare),
    surgeMultiplier: surge
  };
}

module.exports = {
  getRapidoEstimate,
  getRapidoSurgeMultiplier,
  estimateRapidoDuration
};
