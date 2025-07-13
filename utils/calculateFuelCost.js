// 5. utils/calculateFuelCost.js
module.exports = function calculateFuelCost(distanceKm, mileage, fuelPrice) {
  const fuelNeeded = distanceKm / mileage;
  return fuelNeeded * fuelPrice;
};

