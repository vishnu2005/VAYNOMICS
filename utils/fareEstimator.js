// fareEstimator.js

// Estimate surge multiplier based on time of day and weekday
function estimateSurgeByTime() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // Sunday = 0, Saturday = 6

    // Peak hours: 7–10 AM, 5–9 PM (Weekday = moderate surge, Weekend = higher surge)
    if ((hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 21)) {
        return (day === 0 || day === 6) ? 1.7 : 1.4;
    }

    return 1.0; // Off-peak
}

// Basic Uber fare calculation
function estimateBaseFare(distanceKm, durationMin) {
    const baseFare = 50;                  // Flat base fare
    const costPerKm = 12;                 // Cost per kilometer
    const costPerMin = 1;                 // Cost per minute

    return baseFare + (costPerKm * distanceKm) + (costPerMin * durationMin);
}

// Final estimated fare including surge
function estimateFinalFare(distanceKm, durationMin) {
    const base = estimateBaseFare(distanceKm, durationMin);
    const surgeMultiplier = estimateSurgeByTime();
    return {
        baseFare: base.toFixed(2),
        surgeMultiplier: surgeMultiplier.toFixed(1),
        totalFare: (base * surgeMultiplier).toFixed(2)
    };
}



// Export for use in other files
module.exports = {
    estimateSurgeByTime,
    estimateBaseFare,
    estimateFinalFare
};
