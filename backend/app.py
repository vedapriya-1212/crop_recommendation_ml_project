from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# ---------------------------
# MongoDB Connection
# ---------------------------

client = MongoClient("mongodb://localhost:27017/")
db = client["crop_system"]

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

    data = request.json

    username = data["username"]
    email = data["email"]
    password = data["password"]

    if users_collection.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    users_collection.insert_one({
        "username": username,
        "email": email,
        "password": password
    })

    return jsonify({"message": "Registration successful"})


# ---------------------------
# Login API
# ---------------------------

@app.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data["email"]
    password = data["password"]

    user = users_collection.find_one({
        "email": email,
        "password": password
    })

    if user:
        return jsonify({
            "message": "Login successful",
            "username": user["username"]
        })

    return jsonify({"message": "Invalid credentials"}), 401


# ---------------------------
# Prediction API
# ---------------------------

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    N = float(data["N"])
    P = float(data["P"])
    K = float(data["K"])
    temperature = float(data["temperature"])
    humidity = float(data["humidity"])
    ph = float(data["ph"])
    rainfall = float(data["rainfall"])

    errors = validate_inputs(N, P, K, temperature, humidity, ph, rainfall)

    if errors:
        return jsonify({"errors": errors})

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

    prediction = model.predict(input_data)[0]

    if label_encoder:
        prediction = label_encoder.inverse_transform([prediction])[0]

    explanation = crop_info.get(prediction.lower(), "")

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
        "crop": prediction,
        "explanation": explanation
    })

@app.route("/")
def home():
    return "Backend is running"

# ---------------------------
# Run App
# ---------------------------

if __name__ == "__main__":
    app.run(debug=True)