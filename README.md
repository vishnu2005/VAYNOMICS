<p align="center">
  <img src="./public/logo.jpg" alt="VAYNOMICS Logo" width="220"/>
</p>
<h1 align="center">VAYNOMICS</h1>
<h3 align="center">Navigate . Calculate . Compare . Save</h3>
<p align="center"><i>Intelligent Multimodal Fare Estimator with ML + Fullstack Power</i></p>

<p align="center">
  <a href="https://github.com/vishnu2005/VAYNOMICS">
    <img src="https://img.shields.io/badge/Status-Deployed-success?style=flat-square"/>
  </a>
  <img src="https://img.shields.io/badge/Made%20With-%E2%9D%A4-red?style=flat-square" />
  <img src="https://img.shields.io/badge/Powered%20By-ML%20%26%20FullStack-blueviolet?style=flat-square" />
  <a href="https://app.netlify.com/sites/superlative-macaron-26e588/deploys">
    <img src="https://api.netlify.com/api/v1/badges/2cd1df3d-f5d9-4014-a367-8026b3ad2f0b/deploy-status" alt="Netlify Status"/>
  </a>
</p>

---

**VAYNOMICS** is a smart fare comparison web application that estimates ride fares across various transport modes—Uber, Rapido (bike/car), Metro, Bus, and even your own vehicle—based on source and destination. It combines real-time geospatial routing, machine learning, and transit fare logic to provide commuters with the most cost-effective travel options.

🌐 **Live App**: [Go LIVE](https://68779701d2d3c472a017cbf9--superlative-macaron-26e588.netlify.app/)  
🧠 **ML API**: [https://ml-api-vaynomics.onrender.com](https://ml-api-vaynomics.onrender.com)    
⚙️ **Backend API**: [https://vaynomics-backend.onrender.com](https://vaynomics-backend.onrender.com)

---

## 📌 Key Features

- 🧠 **Uber Fare Prediction via ML Model (Random Forest Regressor)**  
  Trained on a synthetic but realistic Indian Uber dataset using pickup/dropoff coordinates, time of day, ride type, and city.

- 🛵 **Rapido Fare Estimation (Car/Bike)**  
  Surge-adjusted heuristic formulas for both ride types.

- 🚌 **Metro & Bus Fare Logic (Chennai & Bengaluru)**  
  Real routes, durations, and fare stages implemented with database-backed lookups.

- ✅ **Smart City-Aware System**  
  Understands whether to apply Chennai or Bengaluru metro/bus fare logic dynamically based on location.

- ⛽ **Fuel Cost Estimator**  
  Calculates personal vehicle fuel cost using user-provided mileage and fuel price.

- 🗺️ **OpenRouteService Integration**  
  Accurate geocoding, route distance, and duration between source and destination.

- 📊 **Charts & Tables**  
  Beautiful D3.js charts and tables to compare fares & durations visually.

---

## 🛠️ Tech Stack

### Frontend (📁 `public/`)
- HTML, CSS, JavaScript
- Leaflet.js for maps
- D3.js for fare/duration charts
- Netlify deployed

### Backend (📁 `server.js`)
- Node.js with Express
- MongoDB Atlas (city transit data)
- ORS (OpenRouteService) API integration
- Render deployed

### Machine Learning API (📁 `ml-api/`)
- Flask + Gunicorn
- RandomForestRegressor (via `scikit-learn`)
- Custom Uber model trained on realistic Indian ride data
- Render deployed with dynamic port binding

---

## 🚀 How It Works

1. **User inputs**: Source, Destination, Mileage, Fuel Price
2. **ORS API**: Gets route distance/duration from OpenRouteService
3. **City Detection**: Determines if metro/bus available
4. **Fare Calculations**:
   - Uber (Go/Auto/XL) → ML model prediction
   - Rapido (bike/car) → Heuristic formula
   - Metro/Bus → MongoDB lookup (real data)
   - Own Vehicle → Based on mileage & fuel price
5. **Response**: Sorted fare table + duration chart sent back to frontend

---

## 🧪 Example Input

Source: T Nagar, Chennai  
Destination: Koyambedu, Chennai  
Mileage: 20 km/l  
Fuel Price: ₹110/litre  

## 📁 Folder Structure
```
VAYNOMICS/
├── public/           # Frontend files (index.html, script.js, style.css, assets)
├── controllers/      # Express controller for handling fare logic
├── routes/           # Express route handlers
├── utils/            # ORS integration, city infer logic, fare estimators
├── ml-api/           # Flask ML API (model + prediction route)
├── .env              # Mongo URI, ORS API key (not committed)
├── server.js         # Main backend entrypoint
├── assets/           # Dashboard images
├── README.md 
```

---

## 🧠 ML Model Details

- Model: RandomForestRegressor  
- Inputs: pickup/dropoff lat/lng, hour, weekday, peak hour, ride type  
- Outputs: Predicted base fare → returns a range [min, max] with surge consideration  
- Dataset: Custom synthetic Uber India dataset  
- Accuracy: R² ≈ 0.96+ on validation set  

---

## 📊 Real-World Fare Prediction Accuracy
VAYNOMICS goes beyond theoretical accuracy — it provides transparent dashboards to showcase how well its fare predictions align with real-world data across Indian cities.
To showcase transparency and reliability, I have also included **accuracy dashboards** for both its ML-driven and heuristic estimators.

---

### 🚖 Uber Fare Prediction – ML Model (Random Forest Regressor)

📈 **Metric**: Accuracy % vs. route-based real fares  
📍 **Test Cases**: Popular routes like T Nagar → Koyambedu, Koramangala → Majestic, etc.  
🧠 **Model**: Trained on a custom Uber-style Indian dataset using city, ride type, and time-based features  
✅ **Observed Accuracy**: ~91% average accuracy across major city routes (Uber Go, Auto, XL)  
📌 Even without real-time *paid* Uber API access, the model reliably mimics realistic fare trends and behavior.

<p align="center">
  <img src="assets/uberGo_accuracy_chart.jpg" alt="Uber Go Accuracy" width="850"/>
  <br/><em>Uber Go Accuracy Chart</em><br/><br/>
  <img src="assets/uberAuto_accuracy_chart.jpg" alt="Uber Auto Accuracy" width="850"/>
  <br/><em>Uber Auto Accuracy Chart</em><br/><br/>
  <img src="assets/uberXL_accuracy_chart.jpg" alt="Uber XL Accuracy" width="850"/>
  <br/><em>Uber XL Accuracy Chart</em>
</p>

---

### 🛵 Rapido Fare Estimator – Surge-Adjusted Heuristic

📈 **Metric**: Accuracy % vs. observed fare samples  
🧪 **Evaluation**: Real Rapido fares benchmarked in Chennai & Bengaluru (Bike and Car)  
⚙️ **Logic**: Time-based surge multipliers + city-wise base rates  
✅ **Observed Accuracy**: ~92–94% accuracy across various locations and time slots  
📌 Tuned using real fare benchmarks to closely simulate Rapido's dynamic pricing.

<p align="center">
  <img src="assets/rapido_accuracy_chart.jpg" alt="Rapido Accuracy" width="850"/>
  <br/><em>Rapido Accuracy Chart</em>
</p>

---

## ⚠️ Why No Model Can Perfectly Predict Uber Fares

Uber’s fare system is driven by a **highly dynamic and proprietary surge algorithm**, which includes variables that are:

- 🔁 Continuously changing in real time  
- 📍 Hyper-local (specific to exact pickup/drop points)  
- 🧠 Internally weighted and inaccessible to public APIs

### Key factors influencing Uber's volatile pricing:

- 🚦 Live traffic congestion  
- 🕒 Time-of-day sensitivity (rush hours vs off-peak)  
- 🌧️ Weather fluctuations  
- 📊 Rider vs driver supply-demand imbalance  
- 🧬 Non-linear surge multiplier logic

> 💡 **Conclusion**: No ML model or heuristic formula — no matter how well trained — can fully capture this volatility.

---

## 📉 Fare Volatility: Real-World Visual Proof

To validate this, **custom line graph** is included to illustrate how **Uber fares fluctuate dramatically for the *same source and destination*** depending on the time, day, and environmental context.

<p align="center">
  <img src="assets/uber_fare_volatility_chart.png" alt="Uber Fare Volatility Graph" width="850"/>
  <br/><em>Fare fluctuation for the same route (Meenambakkam → Guindy) over multiple times & days</em>
</p>

📊 This visualization clearly shows:

- 🔺 Peak-hour prices can double compared to non-peak  
- 🌀 There's no consistent pattern across days  
- 🔍 Any fixed prediction will likely be misleading or outdated

---

## ✅ VAYNOMICS: Realistic, Reliable & Thoughtfully Designed
VAYNOMICS is built to reflect real-world ride fare behavior — using ML and heuristic logic to deliver practical, city-aware, and cost-conscious fare estimates.
Rather than claiming absolute precision, it displays a realistic fare range (min – max) tailored to time, location, ride type, and traffic context.

Why This Matters:
🧠 Ride fares are inherently dynamic — influenced by surge, time-of-day, and demand

📌 Ranges reflect real user experience better than fixed predictions

⚠️ Rare edge cases (e.g., cities where a service isn't available) may show estimates due to open geographic input — but these are minimal and don’t detract from the platform's core reliability

🔍 VAYNOMICS prioritizes transparency, usability, and engineering integrity — proving that good design isn't just about perfect data, but about delivering meaningful insights with confidence.

This deliberate design choice shows maturity — balancing technical depth with user empathy.

---

## 🧠 Final Thoughts

Despite not using paid APIs or Uber’s internal pricing logic, this project was built from the ground up to **mirror real-world behavior as closely as possible**:

- 🔬 I trained a machine learning model tailored to Indian city rides  
- 🔁 Benchmarked and tuned formulas using actual field data  
- 📉 Built time-series dashboards to prove model limitations  
- 🌐 Developed full-stack integrations for a seamless user experience

> ✨ **VAYNOMICS isn't about perfect predictions — it's about intelligent, transparent, and user-focused insights.**  
It’s proof that thoughtful design and engineering **can solve complex problems with limited resources.**

---

## 📦 Setup Instructions (for developers)

```bash
# Backend (Node.js)
cd VAYNOMICS
npm install
node server.js

# ML API (Python)
cd ml-api
pip install -r requirements.txt
python app.py  # or gunicorn --bind 0.0.0.0:$PORT wsgi:app
```

## 🙋‍♀️ About the Author

Vishnu Priya
Aspiring full-stack + ML developer passionate about building smart, scalable real-world solutions.  
✉️ Open to internships, feedback & collaboration  

<h3 align="center">🚦 Navigate &nbsp; • &nbsp; 📊 Calculate &nbsp; • &nbsp; ⚖️ Compare &nbsp; • &nbsp; 💸 Save</h3>

<p align="center">
  Built with ❤️ using ML, Maps, and Practical Fare Intelligence<br/>
  <i>VAYNOMICS embodies what engineering should be — useful, transparent, and user-focused.</i>
</p>

<p align="center">
  <b>📫 Connect with me:</b>
  <a href="https://www.linkedin.com/in/vishnu-priya-243418247" target="_blank">LinkedIn</a> &nbsp;|&nbsp;
  <a href="mailto:vishnupriyavivek13@gmail.com">Email</a>
</p>

<p align="center">
  <sub>© 2025 Vishnu Priya RV • Designed with purpose, built with passion.</sub>
</p>
