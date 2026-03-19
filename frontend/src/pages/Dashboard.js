import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard(){

const navigate = useNavigate();
const user = localStorage.getItem("user");

return (
<div>

<h2>Welcome {user}</h2>

<button onClick={()=>navigate("/predict")}>
Predict Crop
</button>

<button onClick={()=>{
localStorage.removeItem("user");
navigate("/");
}}>
Logout
</button>

</div>
);
}

export default Dashboard;