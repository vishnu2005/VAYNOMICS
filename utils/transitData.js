const connectDB = require("./db");
const metroChennai = require("./metroDataChennai");
const metroBengaluru = require("./metroDataBengaluru");
const metroDelhi = require("./metroDataDelhi");
const metroMumbai = require("./metroDataMumbai");

const transitData = {

  getBusFare: async (city, source, destination) => {
    const from = source.trim().toLowerCase();
    const to = destination.trim().toLowerCase();

    const db = await connectDB();

    if (city === "Chennai") {
      const collection = db.collection("chennai_buses");
      const route = await collection.findOne({
        $expr: {
          $and: [
            { $eq: [{ $toLower: "$from" }, from] },
            { $eq: [{ $toLower: "$to" }, to] }
          ]
        }
      });
      return route ? { fare: route.fare, duration: route.duration || "-" } : null;
    }

    if (city === "Bengaluru") {
      const collection = db.collection("bengaluru_buses");
      const route = await collection.findOne({
        $expr: {
          $and: [
            { $eq: [{ $toLower: "$from" }, from] },
            { $eq: [{ $toLower: "$to" }, to] }
          ]
        }
      });
      return route ? { fare: route.fare, duration: route.duration || "-" } : null;
    }

    return null;
  },

  getMetroFare: (city, source, destination) => {
    const from = source.trim().toLowerCase();
    const to = destination.trim().toLowerCase();

    if (city === "Chennai") {
      return metroChennai.getFare(from, to);
    }
    if (city === "Bengaluru") {
      return metroBengaluru.getFare(from, to);
    }
    if (city === "Delhi") {
      return metroDelhi.getFare(from, to);
    }
    if (city === "Mumbai") {
      return metroMumbai.getFare(from, to);
    }
    return null;
  },

  getAllMetroStations: (city) => {
    if (city === "Chennai" && metroChennai.getAllStations) return metroChennai.getAllStations();
    if (city === "Bengaluru") return metroBengaluru.getAllStations();
    if (city === "Delhi" && metroDelhi.getAllStations) return metroDelhi.getAllStations();
    if (city === "Mumbai") return metroMumbai.getAllStations();
    return [];
  }
};

module.exports = transitData;
