const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },

    company:{
        type:String,
        required:true
    },

    location:{
        type:String,
        default:"Remote"
    },

    duration:{
        type:String
    },

    stipend:{
        type:String
    },

    mode:{
        type:String
    },

    description:{
        type:String
    },

    skills:[
        String
    ],

    applyLink:{
        type:String
    },

    image:{
        type:String
    }
},
{
    timestamps:true
}
);

module.exports = mongoose.model("Internship", internshipSchema);