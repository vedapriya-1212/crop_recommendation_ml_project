from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import numpy as np
import joblib
import pandas as pd


import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

# ---------------------------
# MongoDB Connection
# ---------------------------

mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    raise ValueError("MONGO_URI not set")

client = MongoClient(mongo_uri)
db = client["crop_system"]

# Test connection
try:
    client.admin.command('ping')
    print("MongoDB Connected Successfully")
except Exception as e:
    print("MongoDB Connection Error:", e)

users_collection = db["users"]
predictions_collection = db["predictions"]

# ---------------------------
# Load ML Model
# ---------------------------

MODEL_FILENAME = "crop_model.pkl"
model_path = os.path.join(os.path.dirname(__file__), MODEL_FILENAME)

loaded = joblib.load(model_path)

if isinstance(loaded, dict) and "model" in loaded:
    model = loaded["model"]
    label_encoder = loaded.get("label_encoder")
else:
    model = loaded
    label_encoder = None

# ---------------------------
# Crop Explanation Dictionary
# ---------------------------

crop_info = {
    "rice": "Rice grows well in high humidity and high rainfall areas.",
    "maize": "Maize prefers moderate rainfall and balanced soil nutrients.",
    "chickpea": "Chickpea grows well in moderate temperature and well-drained soil.",
    "kidneybeans": "Kidney beans require moderate rainfall and fertile soil.",
    "pigeonpeas": "Pigeon peas grow well in warm temperatures with moderate rainfall.",
    "mothbeans": "Moth beans are drought-resistant crops.",
    "mungbean": "Mung beans require warm temperatures and moderate humidity.",
    "blackgram": "Black gram grows best in warm climates.",
    "lentil": "Lentils prefer cooler temperatures and moderate rainfall.",
    "pomegranate": "Pomegranate grows well in warm climates.",
    "banana": "Bananas require high humidity and rainfall.",
    "mango": "Mango trees thrive in warm temperatures.",
    "grapes": "Grapes grow well in warm climates with balanced soil nutrients.",
    "watermelon": "Watermelons require warm temperatures and sunlight.",
    "muskmelon": "Muskmelons grow best in warm temperatures and moderate humidity.",
    "apple": "Apples prefer cooler climates.",
    "orange": "Oranges grow well in warm climates with moderate rainfall.",
    "papaya": "Papayas require warm temperatures and fertile soil.",
    "coconut": "Coconuts thrive in tropical climates.",
    "cotton": "Cotton requires warm temperatures and moderate rainfall.",
    "jute": "Jute grows well in warm climates with high rainfall.",
    "coffee": "Coffee grows best in moderate temperatures."
}

# ---------------------------
# Input Validation
# ---------------------------

def validate_inputs(N, P, K, temperature, humidity, ph, rainfall):

    errors = []

    if not (0 <= N <= 140):
        errors.append("Nitrogen value is unrealistic")

    if not (0 <= P <= 145):
        errors.append("Phosphorus value is unrealistic")

    if not (0 <= K <= 205):
        errors.append("Potassium value is unrealistic")

    if not (0 <= temperature <= 50):
        errors.append("Temperature must be between 0–50°C")

    if not (0 <= humidity <= 100):
        errors.append("Humidity must be between 0–100")

    if not (0 <= ph <= 14):
        errors.append("pH must be between 0–14")

    if not (0 <= rainfall <= 500):
        errors.append("Rainfall value unrealistic")

    return errors


# ---------------------------
# Register API
# ---------------------------

@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        print("Mongo URI:", os.getenv("MONGO_URI"))

        print("Register Data:", data)

        if not data:
            return jsonify({"message": "No data received"}), 400

        if not data.get("email") or not data.get("password"):
            return jsonify({"message": "Missing fields"}), 400

        

        if users_collection.find_one({"email": data.get("email")}):
            return jsonify({"message": "User already exists"}), 400

        user = {
            "firstName": data.get("firstName"),
            "lastName": data.get("lastName"),
            "email": data.get("email"),
            "contact": data.get("contact"),
            "gender": data.get("gender"),
            "password": data.get("password")
        }

        users_collection.insert_one(user)

        return jsonify({"message": "Registration successful"}), 200

    except Exception as e:
        print("Register Error:", str(e))
        return jsonify({"message": "Server error"}), 500


# ---------------------------
# Login API
# ---------------------------

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        print("Login Data:", data)

        user = users_collection.find_one({"email": data.get("email")})

        if not user:
            return jsonify({"message": "User not found"}), 404

        if user["password"] != data.get("password"):
            return jsonify({"message": "Invalid password"}), 401

        return jsonify({
            "message": "Login successful",
            "name": user["firstName"],   # 👈 ADD THIS
            "email": user["email"]
        }), 200

    except Exception as e:
        print("Login Error:", str(e))
        return jsonify({"message": "Server error"}), 500


# ---------------------------
# Prediction API
# ---------------------------

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        N = float(data["N"])
        P = float(data["P"])
        K = float(data["K"])
        temperature = float(data["temperature"])
        humidity = float(data["humidity"])
        ph = float(data["ph"])
        rainfall = float(data["rainfall"])

        # Validate inputs
        errors = validate_inputs(N, P, K, temperature, humidity, ph, rainfall)
        if errors:
            return jsonify({"errors": errors})

        # Create dataframe
        input_data = pd.DataFrame(
            [[N, P, K, temperature, humidity, ph, rainfall]],
            columns=[
                "Nitrogen",
                "phosphorus",
                "potassium",
                "temperature",
                "humidity",
                "ph",
                "rainfall"
            ]
        )

        # ✅ Predict probabilities
        probs = model.predict_proba(input_data)[0]

        # ✅ Get prediction
        prediction = model.predict(input_data)[0]

        # ✅ Decode label if encoder exists
        if label_encoder:
            prediction = label_encoder.inverse_transform([prediction])[0]

        # ✅ Get crop names
        if label_encoder:
            crop_names = label_encoder.classes_
        else:
            crop_names = model.classes_

        # ✅ Create probability dictionary
        probabilities = {
            crop_names[i]: round(float(probs[i]) * 100, 2)
            for i in range(len(crop_names))
        }

        # ✅ Explanation
        explanation = crop_info.get(prediction.lower(), "")

        # Save to DB
        predictions_collection.insert_one({
            "N": N,
            "P": P,
            "K": K,
            "temperature": temperature,
            "humidity": humidity,
            "ph": ph,
            "rainfall": rainfall,
            "prediction": prediction
        })

        return jsonify({
            "prediction": prediction,
            "explanation": explanation,
            "probabilities": probabilities,
            "input_data": {
                "N": N,
                "P": P,
                "K": K,
                "temperature": temperature,
                "humidity": humidity,
                "ph": ph,
                "rainfall": rainfall
            }
        })

    except Exception as e:
        print("Prediction Error:", str(e))
        return jsonify({"message": "Server error"}), 500

# ---------------------------
# Home Route
# ---------------------------

@app.route("/")
def home():
    return "Backend is running"


# ---------------------------
# Run App
# ---------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 10000)))