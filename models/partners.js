const mongoose = require('mongoose');


const Partnerschema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gmail : {
        type : String,
        required: true
    },
    advisor : {
        type :mongoose.Schema.Types.ObjectId,
        ref :'users' ,
        default: null
    },
    number :{
        type:Number,
        default:null
    },
    Subscription :{
        type:Object
    }
});

module.exports=new mongoose.model("partners", Partnerschema);