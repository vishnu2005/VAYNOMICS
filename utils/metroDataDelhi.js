// Delhi Metro Station Fares Data
// Based on DMRC fare structure: Distance-based pricing

// Fare calculation function based on distance
function calculateFare(distanceKm, isWeekend = false) {
    if (distanceKm <= 2) {
        return 10;
    } else if (distanceKm <= 5) {
        return isWeekend ? 10 : 20;
    } else if (distanceKm <= 12) {
        return isWeekend ? 20 : 30;
    } else if (distanceKm <= 21) {
        return isWeekend ? 30 : 40;
    } else if (distanceKm <= 32) {
        return isWeekend ? 40 : 50;
    } else {
        return isWeekend ? 50 : 60;
    }
}

// Station coordinates approximated based on Delhi Metro network topology
// For accurate implementation, GPS coordinates would be needed
const stationCoordinates = {
    // Red Line (Line 1)
    "Rithala": { line: "Red", position: 0, coords: [77.1, 28.7] },
    "Rohini East": { line: "Red", position: 1.2, coords: [77.11, 28.7] },
    "Rohini West": { line: "Red", position: 2.4, coords: [77.12, 28.69] },
    "Rohini Sector 18-19": { line: "Red", position: 3.6, coords: [77.13, 28.68] },
    "Haiderpur Badli Mor": { line: "Red", position: 4.8, coords: [77.14, 28.67] },
    "Jahangirpuri": { line: "Red", position: 6.0, coords: [77.15, 28.66] },
    "Adarsh Nagar": { line: "Red", position: 7.2, coords: [77.16, 28.65] },
    "Azadpur": { line: "Red", position: 8.4, coords: [77.17, 28.64] },
    "Model Town": { line: "Red", position: 9.6, coords: [77.18, 28.63] },
    "GTB Nagar": { line: "Red", position: 10.8, coords: [77.19, 28.62] },
    "Vishwavidyalaya": { line: "Red", position: 12.0, coords: [77.20, 28.61] },
    "Vidhan Sabha": { line: "Red", position: 13.2, coords: [77.21, 28.60] },
    "Civil Lines": { line: "Red", position: 14.4, coords: [77.22, 28.59] },
    "Kashmere Gate": { line: "Red", position: 15.6, coords: [77.23, 28.58] },
    "Tis Hazari": { line: "Red", position: 16.8, coords: [77.24, 28.57] },
    "Pulbangash": { line: "Red", position: 18.0, coords: [77.25, 28.56] },
    "Pratap Nagar": { line: "Red", position: 19.2, coords: [77.26, 28.55] },
    "Shastri Park": { line: "Red", position: 20.4, coords: [77.27, 28.54] },
    "Seelampur": { line: "Red", position: 21.6, coords: [77.28, 28.53] },
    "Welcome": { line: "Red", position: 22.8, coords: [77.29, 28.52] },
    "Shahdara": { line: "Red", position: 24.0, coords: [77.30, 28.51] },

    // Yellow Line (Line 2) - Major stations
    "Samaypur Badli": { line: "Yellow", position: 0, coords: [77.13, 28.72] },
    "Rohini Sector 36": { line: "Yellow", position: 2.1, coords: [77.14, 28.71] },
    "Majlis Park": { line: "Yellow", position: 4.2, coords: [77.15, 28.70] },
    "Netaji Subhash Place": { line: "Yellow", position: 6.3, coords: [77.16, 28.69] },
    "Kohat Enclave": { line: "Yellow", position: 8.4, coords: [77.17, 28.68] },
    "Pitampura": { line: "Yellow", position: 10.5, coords: [77.18, 28.67] },
    "Prashant Vihar": { line: "Yellow", position: 12.6, coords: [77.19, 28.66] },
    "Ashok Park Main": { line: "Yellow", position: 14.7, coords: [77.20, 28.65] },
    "Satguru Ram Singh Marg": { line: "Yellow", position: 16.8, coords: [77.21, 28.64] },
    "Inderlok": { line: "Yellow", position: 18.9, coords: [77.22, 28.63] },
    "Kanhaiya Nagar": { line: "Yellow", position: 21.0, coords: [77.23, 28.62] },
    "Keshav Puram": { line: "Yellow", position: 23.1, coords: [77.24, 28.61] },
    "Netaji Subhash Place": { line: "Yellow", position: 25.2, coords: [77.25, 28.60] },
    "Rajouri Garden": { line: "Yellow", position: 27.3, coords: [77.26, 28.59] },
    "Ramesh Nagar": { line: "Yellow", position: 29.4, coords: [77.27, 28.58] },
    "Moti Nagar": { line: "Yellow", position: 31.5, coords: [77.28, 28.57] },
    "Kirti Nagar": { line: "Yellow", position: 33.6, coords: [77.29, 28.56] },
    "Shadipur": { line: "Yellow", position: 35.7, coords: [77.30, 28.55] },
    "Patel Nagar": { line: "Yellow", position: 37.8, coords: [77.31, 28.54] },
    "Rajiv Chowk": { line: "Yellow", position: 39.9, coords: [77.32, 28.53] },
    "New Delhi": { line: "Yellow", position: 42.0, coords: [77.33, 28.52] },
    "Central Secretariat": { line: "Yellow", position: 44.1, coords: [77.34, 28.51] },
    "Udyog Bhawan": { line: "Yellow", position: 46.2, coords: [77.35, 28.50] },
    "Lok Kalyan Marg": { line: "Yellow", position: 48.3, coords: [77.36, 28.49] },

    // Blue Line (Line 3) - Major stations
    "Dwarka Sector 21": { line: "Blue", position: 0, coords: [77.05, 28.55] },
    "Dwarka Sector 8": { line: "Blue", position: 2.8, coords: [77.07, 28.56] },
    "Dwarka Sector 9": { line: "Blue", position: 5.6, coords: [77.09, 28.57] },
    "Dwarka Sector 10": { line: "Blue", position: 8.4, coords: [77.11, 28.58] },
    "Dwarka Sector 11": { line: "Blue", position: 11.2, coords: [77.13, 28.59] },
    "Dwarka Mor": { line: "Blue", position: 14.0, coords: [77.15, 28.60] },
    "Nawada": { line: "Blue", position: 16.8, coords: [77.17, 28.61] },
    "Uttam Nagar West": { line: "Blue", position: 19.6, coords: [77.19, 28.62] },
    "Uttam Nagar East": { line: "Blue", position: 22.4, coords: [77.21, 28.63] },
    "Janakpuri West": { line: "Blue", position: 25.2, coords: [77.23, 28.64] },
    "Janakpuri East": { line: "Blue", position: 28.0, coords: [77.25, 28.65] },
    "Tilak Nagar": { line: "Blue", position: 30.8, coords: [77.27, 28.66] },
    "Subhash Nagar": { line: "Blue", position: 33.6, coords: [77.29, 28.67] },
    "Tagore Garden": { line: "Blue", position: 36.4, coords: [77.31, 28.68] },
    "Rajouri Garden": { line: "Blue", position: 39.2, coords: [77.33, 28.69] },
    "Ramesh Nagar": { line: "Blue", position: 42.0, coords: [77.35, 28.70] },
    "Moti Nagar": { line: "Blue", position: 44.8, coords: [77.37, 28.71] },
    "Kirti Nagar": { line: "Blue", position: 47.6, coords: [77.39, 28.72] },
    "Shadipur": { line: "Blue", position: 50.4, coords: [77.41, 28.73] },
    "Patel Nagar": { line: "Blue", position: 53.2, coords: [77.43, 28.74] },
    "Rajiv Chowk": { line: "Blue", position: 56.0, coords: [77.45, 28.75] },

    // Green Line (Line 5) - Major stations
    "Kirti Nagar": { line: "Green", position: 0, coords: [77.15, 28.66] },
    "Satguru Ram Singh Marg": { line: "Green", position: 2.9, coords: [77.17, 28.67] },
    "Inderlok": { line: "Green", position: 5.8, coords: [77.19, 28.68] },
    "Ashok Park Main": { line: "Green", position: 8.7, coords: [77.21, 28.69] },
    "Punjabi Bagh": { line: "Green", position: 11.6, coords: [77.23, 28.70] },
    "Shivaji Park": { line: "Green", position: 14.5, coords: [77.25, 28.71] },
    "Madipur": { line: "Green", position: 17.4, coords: [77.27, 28.72] },
    "Paschim Vihar East": { line: "Green", position: 20.3, coords: [77.29, 28.73] },
    "Paschim Vihar West": { line: "Green", position: 23.2, coords: [77.31, 28.74] },
    "Peeragarhi": { line: "Green", position: 26.1, coords: [77.33, 28.75] },
    "Udyog Nagar": { line: "Green", position: 29.0, coords: [77.35, 28.76] },

    // Airport Express Line - Major stations
    "New Delhi": { line: "Airport", position: 0, coords: [77.20, 28.64] },
    "Shivaji Stadium": { line: "Airport", position: 7.2, coords: [77.22, 28.62] },
    "Dhaula Kuan": { line: "Airport", position: 14.1, coords: [77.24, 28.60] },
    "Delhi Aerocity": { line: "Airport", position: 18.9, coords: [77.26, 28.58] },
    "Airport T3": { line: "Airport", position: 22.3, coords: [77.28, 28.56] },
};

// Calculate distance between two stations using coordinates
function calculateDistance(station1, station2) {
    const coord1 = stationCoordinates[station1]?.coords;
    const coord2 = stationCoordinates[station2]?.coords;
    
    if (!coord1 || !coord2) {
        return null; // Station not found
    }
    
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

// Generate fare data for station pairs
function generateFareData() {
    const stationNames = Object.keys(stationCoordinates);
    const fareData = [];
    
    for (let i = 0; i < stationNames.length; i++) {
        for (let j = i + 1; j < stationNames.length; j++) {
            const from = stationNames[i];
            const to = stationNames[j];
            const distance = calculateDistance(from, to);
            
            if (distance !== null) {
                const weekdayFare = calculateFare(distance, false);
                const weekendFare = calculateFare(distance, true);
                
                // Add both directions
                fareData.push({
                    from: from,
                    to: to,
                    distance: distance,
                    weekdayFare: weekdayFare,
                    weekendFare: weekendFare,
                    fare: weekdayFare // Default to weekday fare
                });
                
                fareData.push({
                    from: to,
                    to: from,
                    distance: distance,
                    weekdayFare: weekdayFare,
                    weekendFare: weekendFare,
                    fare: weekdayFare // Default to weekday fare
                });
            }
        }
    }
    
    return fareData;
}

// Main fare data array
const delhiMetroFares = generateFareData();

// Sample of common routes with manually verified distances
const commonRoutes = [
    { from: "New Delhi", to: "Rajiv Chowk", distance: 1.2, fare: 10 },
    { from: "Rajiv Chowk", to: "Central Secretariat", distance: 0.8, fare: 10 },
    { from: "Kashmere Gate", to: "Red Fort", distance: 1.5, fare: 10 },
    { from: "Dwarka Sector 21", to: "Rajiv Chowk", distance: 18.5, fare: 40 },
    { from: "Airport T3", to: "New Delhi", distance: 22.3, fare: 40 },
    { from: "Noida Sector 18", to: "Rajiv Chowk", distance: 19.2, fare: 40 },
    { from: "Gurgaon", to: "Rajiv Chowk", distance: 28.4, fare: 50 },
    { from: "Rohini East", to: "Kashmere Gate", distance: 14.4, fare: 30 },
    { from: "Tilak Nagar", to: "Rajouri Garden", distance: 8.4, fare: 30 },
    { from: "Kirti Nagar", to: "Inderlok", distance: 5.8, fare: 30 },
    { from: "Uttam Nagar East", to: "Janakpuri West", distance: 2.8, fare: 20 },
    { from: "Dwarka Sector 8", to: "Dwarka Sector 21", distance: 2.8, fare: 20 },
    { from: "Paschim Vihar East", to: "Paschim Vihar West", distance: 2.9, fare: 20 },
    { from: "Vishwavidyalaya", to: "Civil Lines", distance: 1.2, fare: 10 },
    { from: "Jahangirpuri", to: "Adarsh Nagar", distance: 1.2, fare: 10 }
];

// Fare function with lowercasing
function getFare(from, to, isWeekend = false) {
    const s = from.trim().toLowerCase();
    const d = to.trim().toLowerCase();

    const route = delhiMetroFares.find(r =>
        r.from.trim().toLowerCase() === s && r.to.trim().toLowerCase() === d
    );

    if (route) return isWeekend ? route.weekendFare : route.weekdayFare;

    const commonRoute = commonRoutes.find(r =>
        (r.from.trim().toLowerCase() === s && r.to.trim().toLowerCase() === d) ||
        (r.from.trim().toLowerCase() === d && r.to.trim().toLowerCase() === s)
    );

    return commonRoute ? calculateFare(commonRoute.distance, isWeekend) : null;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { getFare };
}


