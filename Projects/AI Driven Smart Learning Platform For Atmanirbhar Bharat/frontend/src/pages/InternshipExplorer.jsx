import { useEffect, useState } from "react";
import axios from "axios";
import "../components/InternshipExplorer.css";

function InternshipExplorer(){

const [internships,setInternships]=useState([]);

useEffect(()=>{

fetchInternships();

},[]);

const fetchInternships=async()=>{

const res=await axios.get(
"http://localhost:5000/api/internships"
);

setInternships(res.data);

};

return(

<div className="internship-page">

<h1>Internships</h1>

<div className="internship-grid">

{
internships.map((item)=>(

<div className="internship-card" key={item._id}>

<img
src={item.image}
alt=""
/>

<h2>{item.title}</h2>

<h3>{item.company}</h3>

<p>{item.location}</p>

<p>{item.duration}</p>

<p>{item.stipend}</p>

<p>{item.mode}</p>

<p>{item.description}</p>

<div className="skills">

{
item.skills.map((skill,index)=>(

<span key={index}>
{skill}
</span>

))
}

</div>

<a
href={item.applyLink}
target="_blank"
rel="noreferrer"
>

Apply Now

</a>

</div>

))
}

</div>

</div>

);

}

export default InternshipExplorer;