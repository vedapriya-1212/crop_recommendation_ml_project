import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Predict.css";

function Predict() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    N: "", P: "", K: "",
    temperature: "", humidity: "",
    ph: "", rainfall: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {

    const res = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.errors) {
      alert(data.errors.join("\n"));
    } else {
      navigate("/result", { state: data });
    }
  };

  return (
    <div className="predict-container">

      <div className="predict-card">

        <h2>🌱 Enter Soil Data</h2>

        <div className="input-group">

          {/* Nitrogen */}
          <select name="N" onChange={handleChange}>
            <option value="">Nitrogen</option>
            <option value="10">0 - 20 (Low)</option>
            <option value="50">20 - 80 (Medium)</option>
            <option value="120">80 - 140 (High)</option>
          </select>

          {/* Phosphorus */}
          <select name="P" onChange={handleChange}>
            <option value="">Phosphorus</option>
            <option value="10">0 - 30 (Low)</option>
            <option value="60">30 - 100 (Medium)</option>
            <option value="130">100 - 145 (High)</option>
          </select>

          {/* Potassium */}
          <select name="K" onChange={handleChange}>
            <option value="">Potassium</option>
            <option value="20">0 - 50 (Low)</option>
            <option value="100">50 - 150 (Medium)</option>
            <option value="180">150 - 205 (High)</option>
          </select>

          {/* Temperature */}
          <select name="temperature" onChange={handleChange}>
            <option value="">Temperature</option>
            <option value="15">0 - 20°C</option>
            <option value="25">20 - 30°C</option>
            <option value="40">30 - 50°C</option>
          </select>

          {/* Humidity */}
          <select name="humidity" onChange={handleChange}>
            <option value="">Humidity</option>
            <option value="30">0 - 40%</option>
            <option value="60">40 - 80%</option>
            <option value="90">80 - 100%</option>
          </select>

          {/* pH */}
          <select name="ph" onChange={handleChange}>
            <option value="">pH</option>
            <option value="5">0 - 6 (Acidic)</option>
            <option value="7">6 - 8 (Neutral)</option>
            <option value="9">8 - 14 (Alkaline)</option>
          </select>

          {/* Rainfall */}
          <select name="rainfall" onChange={handleChange}>
            <option value="">Rainfall</option>
            <option value="50">0 - 100 mm</option>
            <option value="200">100 - 300 mm</option>
            <option value="400">300 - 500 mm</option>
          </select>

        </div>

        <button className="predict-btn" onClick={handlePredict}>
          Predict Crop 🌾
        </button>

        <button className="predict-btn back-btn" onClick={() => navigate("/home")}>
          Back
        </button>

      </div>

    </div>
  );
}

export default Predict;