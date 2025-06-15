const express=require("express");
const bodyparser= require('body-parser');
const webpush= require('web-push');
const expressAsyncHandler=require('express-async-handler');
const user=require('../../models/users');
const ambulance = require('../../models/ambulance');

const app=express();

app.use(bodyparser.json());
app.use(express.static(path.join(__dirname,'..','..','Frontend')));

const sos = expressAsyncHandler(async(req,res)=>{
    const token = req.cookies.token;
    const user=jwt.verify(token,process.env.secretkey);
    const mail=user.mail;
    const lat= req.body.latitude;
    const long =req.body.longitude
    const data=user.findOne({Email:mail});
    const message = "Emergency Alert !";
    const payload = JSON.stringify({
            title: message,
            body: `${data.name} needs an immediate help at the location` ,
            data: {
                lat,
                long,
                url: `https://www.google.com/maps?q=${lat},${long}`
             }
         });
    
    const ambulanceUsers = await ambulance.find();

    ambulanceUsers.forEach( amb => { 
        if(amb[subscription]){
           webpush.sendNotification(amb[subscription],payload);
        }
    });
});

module.exports={
    sos
};
