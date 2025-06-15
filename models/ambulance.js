const mongoose = require('mongoose');


const Ambulancechema = new mongoose.Schema({
    dname: {
        type:String,
        required: true
    },
    Abulancenum: {
        type: String,
        required: true
    },
    number :{
        type:Number,
        default:null
    },
    gmail : {
        type : String,
        required: true
    },
    aadhar : {
        type : String,
        required: true
    },
    license_num : {
        type : String,
        required: true
    },
    subscription:{
        type : Object      
    }
});

module.exports=new mongoose.model("ambulance", Ambulancechema);