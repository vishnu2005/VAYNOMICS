from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from datetime import datetime

app = Flask(__name__)
CORS(app)

import os
if not os.path.exists("multitype_uber_model.pkl"):
    print("Model not found, downloading...")
    try:
        from download_model import download_model
        download_model()
    except Exception as e:
        print(f"❌ Could not download model: {e}")


# Load trained model
model = joblib.load("multitype_uber_model.pkl")

# Mapping used during training
ride_type_map = {
    'uber_go': 0,
    'uber_auto': 1,
    'uber_xl': 2
}

@app.route("/predict-multitype", methods=["POST"])
def predict_fare():
    data = request.get_json()

    # Extract required inputs
    pickup_lat = data["pickup_latitude"]
    pickup_lng = data["pickup_longitude"]
    dropoff_lat = data["dropoff_latitude"]
    dropoff_lng = data["dropoff_longitude"]
    ride_type_str = data["ride_type"].lower()

    # Time features
    now = datetime.now()
    hour = now.hour
    day_of_week = now.weekday()
    is_peak = 1 if 7 <= hour <= 10 or 17 <= hour <= 20 else 0

    # Encode ride type
    ride_type = ride_type_map.get(ride_type_str, 0)

    # Final 8 input features (as used during model training)
    features = [[
        pickup_lat,
        pickup_lng,
        dropoff_lat,
        dropoff_lng,
        hour,
        day_of_week,
        is_peak,
        ride_type
    ]]

    # Predict fare
    predicted_fare = model.predict(features)[0]
    min_fare = round(predicted_fare * 0.9, 2)
    max_fare = round(predicted_fare * 1.1, 2)

    return jsonify({
        "estimated_fare": round(predicted_fare, 2),
        "fare_min": min_fare,
        "fare_max": max_fare
    })

if __name__ == "__main__":
    app.run(port=5001)
