import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "./Home.css";

// import slick styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {

  const navigate = useNavigate();

  const crops = [
    {
      name: "Rice",
      climate: "High Rainfall & Humidity",
      temp: "27°C",
      rainfall: "300mm",
      img: "https://i.pinimg.com/1200x/77/f7/07/77f707a911aa55c9ca3c21dbb6e8d4a0.jpg"
    },
    {
      name: "Wheat",
      climate: "Moderate Climate",
      temp: "20°C",
      rainfall: "100mm",
      img: "https://i.pinimg.com/1200x/5b/fc/2e/5bfc2e2b9f59e1718f4f23fbda02ab43.jpg"
    },
    {
      name: "Cotton",
      climate: "Dry Climate",
      temp: "30°C",
      rainfall: "80mm",
      img: "https://i.pinimg.com/1200x/91/58/4f/91584f5cc0f3e4fc2dd58358f5d64086.jpg"
    },
    {
      name: "Maize",
      climate: "Warm Climate",
      temp: "25°C",
      rainfall: "120mm",
      img: "https://i.pinimg.com/736x/6c/d1/ac/6cd1aca46862bf6409234963d73c865d.jpg"
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2500
  };

  return (
    <div className="home-container">

      {/* LEFT SIDE */}
      <div className="left-section">
        <h1>Crop Recommendation System</h1>

        <p>
          Using soil data, temperature, humidity, and rainfall,
          this system predicts the most suitable crop for farmers 🌱
          
            <p>
            🌾 Increase yield
            💧 Optimize water usage
            🌱 Improve sustainability</p>
        </p>

       

        <div className="buttons">
          <button onClick={() => navigate("/predict")}>
            Predict Crop
          </button>

          <button className="logout" onClick={() => navigate("/")}>
            Logout
          </button>
        </div>
      </div>

      {/* RIGHT SIDE (CAROUSEL) */}
      <div className="right-section">
        <Slider {...settings}>
          {crops.map((crop, index) => (
            <div key={index} className="slide">

              <img src={crop.img} alt={crop.name} />

              <div className="overlay">
                <h2>{crop.name}</h2>
                <p>{crop.climate}</p>

                <div className="details">
                  <span>🌡 {crop.temp}</span>
                  <span>🌧 {crop.rainfall}</span>
                </div>
              </div>

            </div>
          ))}
        </Slider>
      </div>

    </div>
  );
}

export default Home;