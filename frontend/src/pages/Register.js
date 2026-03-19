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

  const res = await fetch("http://127.0.0.1:5000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: form.firstName + " " + form.lastName,
      email: form.email,
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

        {/* ✅ Gender Radio Buttons */}
        <div className="input-box full-width gender-box">

          <label className="gender-label">Gender:</label>

          <div className="gender-options">

            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                onChange={handleChange}
              /> Male
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                onChange={handleChange}
              /> Female
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                value="Other"
                onChange={handleChange}
              /> Other
            </label>

          </div>

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