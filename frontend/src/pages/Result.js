import React from "react";
import { useLocation } from "react-router-dom";
import "./Result.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Result() {

  const location = useLocation();
  const data = location.state;

  if (!data || !data.input_data) {
    return (
      <div className="no-data">
        <h2>⚠️ No Data Found</h2>
      </div>
    );
  }

  const input = data.input_data;

  const chartData = {
    labels: Object.keys(input),
    datasets: [
      {
        label: "Soil Parameters",
        data: Object.values(input),
        backgroundColor: "#4caf50"
      }
    ]
  };

  return (
    <div className="result-container">

      <h1>🌾 Recommended Crop: {data.crop}</h1>
      <p className="explanation">{data.explanation}</p>

      {/* 📊 SMALL CHART */}
      <div className="chart-wrapper">
        <Bar data={chartData} />
      </div>

      {/* 🌦 CLIMATE */}
      <div className="insight-card climate">
        <h2>🌦 Climate Suitability</h2>
        <p>
          ✔ Temperature is optimal for growth <br/>
          ✔ Humidity supports healthy development <br/>
          ✔ Rainfall level is suitable for cultivation
        </p>
      </div>

      {/* 🌱 YIELD */}
      <div className="insight-card yield">
        <h2>🌱 Yield Impact</h2>
        <p>
          ✔ Balanced NPK improves productivity <br/>
          ✔ Proper pH ensures nutrient absorption <br/>
          ✔ High probability of good yield 🌾
        </p>
      </div>

    </div>
  );
}

export default Result;