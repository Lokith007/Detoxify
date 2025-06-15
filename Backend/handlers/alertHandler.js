const express=require("express");
const bodyparser= require('body-parser');
const webpush= require('web-push');
const expressAsyncHandler=require('express-async-handler');
const Users=require('../../models/users');
const ambulance = require('../../models/ambulance');

const app=express();

app.use(bodyparser.json());
app.use(express.static(path.join(__dirname,'..','..','Frontend')));

const sos = expressAsyncHandler(async(req,res)=>{
    const token = req.cookies.token;
    const decoded_token=jwt.verify(token,process.env.secretkey);
    const mail=decoded_token.mail;
    const lat= req.body.latitude;
    const long =req.body.longitude;
    const user=Users.findOne({gmail:mail});
    const message = "Emergency Alert !";
    const payload = JSON.stringify({
            title: message,
            body: `${data.name} needs an immediate help at the location below ,call to : ${user.number}` ,
            data: {
                contact_number : user.number,
                lat,
                long,
                url: `https://www.google.com/maps?q=${lat},${long}`
             }
         });
    
    const ambulanceUsers = await ambulance.find();

    ambulanceUsers.forEach( amb => { 
        if(amb.subscription){
           webpush.sendNotification(amb.subscription,payload);
        }
    });
});

const getkey = ((req,res) =>{
    res.send(process.env.publickey)
});


module.exports={
    sos,
    getkey
};
