// Detect city based on known city keywords in the source name

function inferCity(placeName) {
  const place = placeName.toLowerCase();

  if (place.includes("chennai")) return "Chennai";
  if (place.includes("bengaluru") || place.includes("bangalore")) return "Bengaluru";
  if (place.includes("delhi") || place.includes("new delhi")) return "Delhi";
  if (place.includes("mumbai") || place.includes("bombay")) return "Mumbai";

  return null; // City could not be inferred
}

module.exports = inferCity;
