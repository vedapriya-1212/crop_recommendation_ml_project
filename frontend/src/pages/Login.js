import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const navigate = useNavigate();

const handleLogin = async () => {

const res = await fetch("http://127.0.0.1:5000/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body: JSON.stringify({email,password})
});

const data = await res.json();
alert(data.message);

if(res.status === 200){
localStorage.setItem("username", data.name);
console.log("Stored name:", data.name);
navigate("/home");
}else{
alert(data.message);
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
<div className="logo">
🌿
</div>
</div>

{/* RIGHT SIDE */}
<div className="right">

<h2>Welcome !</h2>

<div className="input-box">
<input
type="email"
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>
</div>

<div className="input-box">
<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
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