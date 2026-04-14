import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    gender: "",
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
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      contact: form.contact,
      gender: form.gender,
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

        

        {/* LEFT SIDE */}
        <div className="left"></div>
          
        {/* RIGHT SIDE */}
        <div className="right">
            
          <h2>Create Account</h2>

          <div className="form-grid">

            <div className="input-box">
              <input name="firstName" placeholder="First Name" onChange={handleChange}/>
            </div>

            <div className="input-box">
              <input name="lastName" placeholder="Last Name" onChange={handleChange}/>
            </div>

            <div className="input-box">
              <input name="email" placeholder="Email" onChange={handleChange}/>
            </div>

            <div className="input-box">
              <input name="contact" placeholder="Contact Number" onChange={handleChange}/>
            </div>

            {/* ✅ Gender Dropdown (FIXED) */}
            <div className="input-box">
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
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