const expressAsyncHandler=require('express-async-handler');
const bcrypt = require('bcrypt');
const body_parse=require('body-parser');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');  
const path=require("path");  
const Users=require("./models/users");

const login=expressAsyncHandler(async(req,res)=>{
        const email=req.body.email;
        const pass=req.body.pass;
        const user = await Users.findOne({Email:email});
        if(!user){
            console.log("No user found");
            return res.send({message: 'nuf' });
        }
        const saltRound=10;
        const check= await bcrypt.compare(pass,user.Password);
        if(!check){
            console.log("Wrong password");
            return res.send({message:"wp"});
        }
        const token=jwt.sign({mail:user.Email},process.env.secretkey,{expiresIn:'1h'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 3600000,
        });
        return res.send({message:"s"});
});

const signup=expressAsyncHandler(async(req,res)=>{
     const data={Email:req.body.mail,Password:'',UserName:req.body.name};
      const user=await Users.findOne({Email:data.Email});
      if(user){
        console.log('Account already exits for this Email');
        return res.send({message:'mae'});
      }
      const saltRound=10;
      data.Password= await bcrypt.hash(req.body.pass,saltRound);
      const newuser=new Users(data);
      await newuser.save();
      const token=jwt.sign({mail:data.Email},process.env.secretkey,{expiresIn:'1h'}) ;
      res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 3600000,
        });
        return res.send({message:"s"});
});

module.exports=mainHandler;