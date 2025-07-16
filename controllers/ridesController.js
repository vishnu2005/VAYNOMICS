const axios = require("axios");
const getDistanceDuration = require("../utils/getORSRoute");
const calculateFuelCost = require("../utils/calculateFuelCost");
const inferCity = require("../utils/inferCity");
const transitData = require("../utils/transitData");
const rapidoFareEstimator = require("../utils/rapidoFareEstimator");

exports.getRides = async (req, res) => {
  const { sourceCoords, destCoords, sourceName, destName, mileage, fuelPrice } = req.body;

  try {
    const orsData = await getDistanceDuration(sourceCoords, destCoords);
    const city = inferCity(sourceName);
    const distanceKm = orsData.value.distance / 1000;
    const durationMin = orsData.value.duration / 60;
    const fuelCost = calculateFuelCost(distanceKm, mileage, fuelPrice);
    const rides = [];

    console.log("🔁 Received sourceCoords:", sourceCoords);
    console.log("🔁 Received destCoords:", destCoords);

    // ML Uber Go, Auto, XL fare predictions
    try {
      const rideTypes = ["uber_go", "uber_auto", "uber_xl"];
      const rideLabels = ["Uber Go", "Uber Auto", "Uber XL"];

      const mlResponses = await Promise.all(
        rideTypes.map((rideType) =>
          axios.post("https://ml-api-vaynomics.onrender.com/predict-multitype", {
            pickup_latitude: sourceCoords[0],
            pickup_longitude: sourceCoords[1],
            dropoff_latitude: destCoords[0],
            dropoff_longitude: destCoords[1],
            ride_type: rideType,
            city: city.toLowerCase()
          })
        )
      );

      mlResponses.forEach((res, i) => {
        const { fare_min, fare_max } = res.data;
        rides.push({
          service: rideLabels[i],
          price: `₹${fare_min.toFixed(2)} – ₹${fare_max.toFixed(2)}`,
          duration: durationMin.toFixed(2),
          surgeMultiplier: "ML-based"
        });
      });
    } catch (mlErr) {
      console.error("ML API Error:", mlErr.message);
    }

        // Rapido Car
    const rapidoCar = rapidoFareEstimator.getRapidoEstimate(distanceKm, "car", city);
    if (!isNaN(rapidoCar.estimatedFare)) {
      rides.push({
        service: "Rapido Car",
        price: parseFloat(rapidoCar.estimatedFare).toFixed(2),
        duration: rapidoCar.durationMin,
        surgeMultiplier: rapidoCar.surgeMultiplier
      });
    }

    // Rapido Bike
    const rapidoBike = rapidoFareEstimator.getRapidoEstimate(distanceKm, "bike", city);
    if (!isNaN(rapidoBike.estimatedFare)) {
      rides.push({
        service: "Rapido Bike",
        price: parseFloat(rapidoBike.estimatedFare).toFixed(2),
        duration: rapidoBike.durationMin,
        surgeMultiplier: rapidoBike.surgeMultiplier
      });
    }


    // Own Vehicle
    if (!isNaN(fuelCost)) {
      rides.push({
        service: "Your Vehicle",
        price: parseFloat(fuelCost).toFixed(2),
        duration: durationMin.toFixed(2)
      });
    }

    // Metro & Bus
    const cleanSource = sourceName.split(",")[0].trim().toLowerCase();
    const cleanDest = destName.split(",")[0].trim().toLowerCase();
    let metroShown = false;
    let busShown = false;

    if (city) {
      const metroFare = transitData.getMetroFare(city, cleanSource, cleanDest);
      if (metroFare) {
        rides.push({
          service: "Metro",
          price: typeof metroFare.fare !== "undefined" ? metroFare.fare : metroFare,
          duration: metroFare.duration || "-"
        });
        metroShown = true;
      }

      const busFareObj = await transitData.getBusFare(city, cleanSource, cleanDest);
      if (busFareObj) {
        rides.push({
          service: "Bus",
          price: busFareObj.fare,
          duration: busFareObj.duration || "-"
        });
        busShown = true;
      }
    }

    if (!metroShown && !busShown) {
      rides.push({
        service: "Notice",
        price: "-",
        duration: "-",
        message: "Metro/Bus not available for this route."
      });
    }

    res.json({
      rides,
      distance: orsData.distance,
      duration: orsData.duration
    });

  } catch (error) {
    console.error("Error in getRides:", error);
    res.status(500).json({ error: "Error fetching ride estimates. Please try again." });
  }
};
