import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Predict(){

const navigate = useNavigate();

const [form,setForm] = useState({
N:"",P:"",K:"",
temperature:"",humidity:"",
ph:"",rainfall:""
});

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const handlePredict = async ()=>{

const res = await fetch("http://127.0.0.1:5000/predict",{
method:"POST",
headers:{"Content-Type":"application/json"},
body: JSON.stringify(form)
});

const data = await res.json();

if(data.errors){
alert(data.errors.join("\n"));
}else{
navigate("/result",{state:data});
}
};

return(
<div>

<h2>Enter Soil Data</h2>

<input name="N" placeholder="Nitrogen" onChange={handleChange}/>
<input name="P" placeholder="Phosphorus" onChange={handleChange}/>
<input name="K" placeholder="Potassium" onChange={handleChange}/>
<input name="temperature" placeholder="Temperature" onChange={handleChange}/>
<input name="humidity" placeholder="Humidity" onChange={handleChange}/>
<input name="ph" placeholder="pH" onChange={handleChange}/>
<input name="rainfall" placeholder="Rainfall" onChange={handleChange}/>

<button onClick={handlePredict}>Predict</button>

</div>
);
}

export default Predict;