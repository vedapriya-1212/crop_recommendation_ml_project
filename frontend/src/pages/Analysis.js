import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./Analysis.css";

function Analysis() {
  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state;

  if (!data || !data.probabilities) {
    return <h2>No Data Found</h2>;
  }

  // 🔥 Sort data (important for good graph)
  const sorted = Object.entries(data.probabilities)
    .sort((a, b) => b[1] - a[1]);

  const crops = sorted.map(item => item[0]);
  const probs = sorted.map(item => item[1]);

  const chartData = {
    labels: crops,
    datasets: [
      {
        label: "Crop Probability (%)",
        data: probs,
        backgroundColor: probs.map((p, i) =>
          i === 0 ? "#2e7d32" : "#81c784"
        )
      }
    ],
  };

  return (
    <div className="analysis-page">
      <div className="analysis-card">

        <h2>📊 Crop Probability Analysis</h2>

        <Bar data={chartData} />

        <button
          className="result-btn"
          onClick={() => navigate("/result", { state: data })}
        >
          View Final Result 🌾
        </button>

      </div>
    </div>
  );
}

export default Analysis;