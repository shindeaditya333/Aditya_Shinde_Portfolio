const Internship = require("../models/Internship");

// Get All
const getInternships = async(req,res)=>{
try{

const internships = await Internship.find();

res.json(internships);

}
catch(err){

res.status(500).json({
message:err.message
});

}

};


// Add Internship
const addInternship = async(req,res)=>{
try{

const internship = new Internship(req.body);

await internship.save();

res.status(201).json(internship);

}
catch(err){

res.status(500).json({
message:err.message
});

}

};

module.exports = { getInternships, addInternship };