import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const navigate = useNavigate();

  
  const rawName = localStorage.getItem("username") || "User";

const name =
  rawName.charAt(0).toUpperCase() +
  rawName.slice(1);

  const crops = [
  {
    name: "Rice",
    desc: "High rainfall crop",
    img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449"
  },
  {
    name: "Wheat",
    desc: "Moderate climate crop",
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
  },
  {
    name: "Cotton",
    desc: "Dry climate crop",
    img: "https://thumbs.dreamstime.com/b/concept-field-full-cotton-plants-green-leaves-generative-ai-289400905.jpg"
  },
  {
    name: "Maize",
    desc: "Warm climate crop",
    img: "https://static.vecteezy.com/system/resources/previews/007/446/030/non_2x/maize-or-corn-for-feeding-animal-in-farmland-free-photo.jpg"
  }
];

  const settings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2500,
  arrows: false,
  centerMode: true,
  centerPadding: "250px"   // 🔥 THIS FIXES GAP
};

  return (
    <>
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <img src="/logo.png" alt="logo" />
          <span>FarmGenius</span>
        </div>

        <div className="nav-center">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-right">
  <div className="user-info">
    <div className="avatar">
      {name.charAt(0)}
    </div>

    <span className="user-text">
      Hi,&nbsp;<b>{name}</b>
    </span>
  </div>

  <button
    onClick={() => {
      localStorage.clear();
      navigate("/");
    }}
    className="logout-btn"
  >
    Logout
  </button>
</div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <h1>
          Smart Farming with <span>AI</span>
        </h1>

        <p>
          AI-powered crop recommendation system for better yield and efficiency.
        </p>

        <button onClick={() => navigate("/predict")} className="cta-btn">
          Start Prediction
        </button>
      </section>

      {/* CAROUSEL */}
      <section className="carousel-section">
        <h2>Top Recommended Crops</h2>

        <Slider {...settings}>
          {crops.map((crop, index) => (
            <div key={index}>
              <div className="slide-card">

                <img src={crop.img} alt={crop.name} />

                <div className="card-content">
                  <h3>{crop.name}</h3>
                  <p>{crop.desc}</p>
                </div>

              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <h2 className="section-title">
  AI-Powered Farming Intelligence
</h2>

<p className="section-subtitle">
  Leveraging AI and data to improve crop yield and smarter decisions.
</p>

        <div className="feature-grid">
          <div>
            🌱 <b>Smart Prediction</b>
            <p>AI suggests best crops</p>
          </div>

          <div>
            📊 <b>Data Analysis</b>
            <p>Accurate ML insights</p>
          </div>

          <div>
            📈 <b>Better Yield</b>
            <p>Increase productivity</p>
          </div>
        </div>
      </section>

      
    </div>
    <footer className="footer" id="about">

  <div className="footer-container">

    {/* LEFT */}
    <div className="footer-brand">
      <h2>FarmGenius</h2>
      <p>
        Smart agriculture platform powered by AI to help farmers
        make better crop decisions and improve yield.
      </p>
    </div>

    {/* ABOUT */}
    <div className="footer-column">
      <h3>About</h3>
      <p>Our Mission</p>
      <p>How It Works</p>
      <p>Technology</p>
    </div>

    {/* CONTACT */}
    <div className="footer-column">
      <h3>Contact</h3>
      <p>📧 support@farmgenius.com</p>
      <p>📞 +91 98765 43210</p>
      <p>📍 Hyderabad, India</p>
    </div>

  </div>

  <div className="footer-bottom">
    © 2026 FarmGenius. All rights reserved.
  </div>

 </footer>
 </>
  );
}

export default Home;