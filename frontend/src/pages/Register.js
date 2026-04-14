import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("https://crop-backend-16lg.onrender.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      })
    });

    const data = await res.json();
    alert(data.message);

    if (res.status === 200) {
      navigate("/");
    }
  };

  return (
    <div className="container">

      <div className="card">

        <div className="left"></div>

        <div className="right">
          <h2>Create Account</h2>

          <div className="form-grid">

            <div className="input-box">
              <input name="name" placeholder="Full Name" onChange={handleChange}/>
            </div>

            <div className="input-box">
              <input name="email" placeholder="Email" onChange={handleChange}/>
            </div>

            <div className="input-box">
              <input name="phone" placeholder="Phone Number" onChange={handleChange}/>
            </div>

            <div className="input-box">
              <input type="password" name="password" placeholder="Password" onChange={handleChange}/>
            </div>

            <div className="input-box">
              <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange}/>
            </div>

          </div>

          <button onClick={handleRegister}>REGISTER</button>

          <p className="switch-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>Login</span>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;