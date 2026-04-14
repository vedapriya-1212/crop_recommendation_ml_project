import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("https://crop-backend-16lg.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await res.json();

      // ✅ Show message
      alert(data.message);

      // ✅ If login success
      if (res.status === 200) {
        // FIX: access user.name properly
        localStorage.setItem("username", data.user.name);

        console.log("Stored name:", data.user.name);

        navigate("/home");
      }

    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">

      <h1 className="project-title">
        🌱 Crop Recommendation System
      </h1>

      <div className="card">

        {/* LEFT SIDE */}
        <div className="left">
          <div className="logo">🌿</div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right">

          <h2>Welcome !</h2>

          <div className="input-box">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <p className="forgot">Forgot Password ?</p>

          <button onClick={handleLogin}>LOGIN</button>

          <p className="switch-text">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>Register</span>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;