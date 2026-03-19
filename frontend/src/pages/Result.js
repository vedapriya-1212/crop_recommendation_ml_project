import React from "react";
import { useLocation } from "react-router-dom";

function Result(){

const location = useLocation();
const data = location.state;

return(
<div>

<h2>Recommended Crop: {data.crop}</h2>

<p>{data.explanation}</p>

</div>
);
}

export default Result;