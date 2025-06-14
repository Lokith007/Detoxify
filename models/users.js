const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/Detoxify");

connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})


const Loginschema = new mongoose.Schema({
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
        unique:true,
        required: true
    },
    lastlogin:{
        type: Date,    
        default: () => new Date().toISOString().split('T')[0]

    },
    streak:{
            type:Number,
            default:0
    },
    XP:{
        type:Number,
        default:0
    },
    Apartner:{
    type:  mongoose.Schema.Types.ObjectId,
    ref :  'partners',
    default: null
    }
});


const collection = new mongoose.model("users", Loginschema);

module.exports = collection;