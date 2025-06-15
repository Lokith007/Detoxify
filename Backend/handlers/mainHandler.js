const expressAsyncHandler=require('express-async-handler');
const bcrypt = require('bcrypt');
const body_parse=require('body-parser');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');  
const path=require("path");  
const Users=require("../../models/users");
const Ambulance=require("../../models/ambulance");

const login=expressAsyncHandler(async(req,res)=>{
        const email=req.body.email;
        const pass=req.body.pass;
        const user = await Users.findOne({gmail:email});
        if(!user){
            console.log("No user found");
            return res.send({message: 'nuf' });
        }
        const saltRound=10;
        const check= await bcrypt.compare(pass,user.password);
        if(!check){
            console.log("Wrong password");
            return res.send({message:"wp"});
        }
        const token=jwt.sign({mail:user.Email},process.env.secretkey,{expiresIn:'48h'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 3600000,
        });
        return res.send({message:"s"});
});

const signup=expressAsyncHandler(async(req,res)=>{
     const data = {
        gmail: req.body.mail,
        password: '',
        name: req.body.name
    };

    console.log(data);

    const user = await Users.findOne({ gmail: data.gmail });

    if (user) {
        console.log('Account already exists for this Email');
        return res.send({ message: 'mae' });
    }

    const saltRound = 10;
    data.password = await bcrypt.hash(req.body.pass, saltRound);

    const newuser = new Users(data);
    await newuser.save();

    const token = jwt.sign({ mail: data.gmail }, process.env.secretkey, { expiresIn: '48h' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 3600000
    });

    return res.send({ message: "s" });
});

const wleaderboard = expressAsyncHandler(async (req, res) => {
    const topUsers = await Users.find({})
        .select('name weeklyXP streak -_id')
        .sort({ weeklyXP: -1 })
        .limit(3);
    
    
    console.log("weeklyleaderboard");
    return res.json(topUsers);
});

const mleaderboard = expressAsyncHandler(async (req, res) => {
    try {
        const topUsers = await Users.find({})
            .select('name monthlyXP streak -_id')
            .sort({ monthlyXP: -1 })
            .limit(3);

        res.status(200).json(topUsers);
    } catch (error) {
        console.error("Error fetching monthly leaderboard:", error);
        res.status(500).json({ message: 'Failed to retrieve leaderboard' });
    }
});

const appointment=expressAsyncHandler(async (req, res) => {
    const token = req.cookies.token;
    const decoded_token=jwt.verify(token,process.env.secretkey);
    const gmail=decoded_token.mail;
    const user = await Users.findOne({gmail:mail});
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({gmail:user.gmail,name:user.name});
});



const completeChallenge = expressAsyncHandler(async (req, res) => {
    const token = req.cookies.token;
    const decoded_token=jwt.verify(token,process.env.secretkey);
    const gmail=decoded_token.mail;
    const user = await Users.findOne({gmail:mail});

    // if (!gmail) {
    //     return res.status(400).json({ message: 'Email is required.' });
    // }

    // const user = await Users.findOne({ gmail });
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const lastLoginStr = new Date(user.lastlogin).toISOString().split('T')[0];

    if (lastLoginStr === todayStr) {
        return res.json({ message: 'Already completed today', streak: user.streak, XP: user.XP });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastLoginStr === yesterdayStr) {
        user.streak += 1;
    } else {
        user.streak = 1;
    }

    user.lastlogin = new Date();
    user.XP += 10;

    await user.save();

    return res.json({
        message: 'Challenge completed',
        streak: user.streak,
        XP: user.XP
    });
});

const subscribe = expressAsyncHandler(async(req,res)=>{
    const token = req.cookies.token;
    const decoded_token=jwt.verify(token,process.env.secretkey);
    const mail=decoded_token.mail;
    const user = await Users.findOne({gmail:mail});
    const subscription = req.body;
    user.subscription=subscription;
    await user.save();
    return res.send(true);
})


const addAmbulance = expressAsyncHandler(async (req, res) => {
    const {
        dname,
        Ambulancenum,
        number,
        gmail,
        aadhar,
        license_num,
        subscription
    } = req.body;

    // Optional: Check if ambulance already exists
    const existing = await Ambulance.findOne({ Ambulancenum });
    if (existing) {
        res.status(400).json({message:"Ambulance driver already present"});
    }

    const newAmbulance = await Ambulance.create({
        dname:dname,
       Ambulancenum: Ambulancenum,
       number: number,
        gmail:gmail,
        aadhar : aadhar,
        license_num : license_num,
        subscription :subscription
    });
    await newAmbulance.save();

    res.status(201).json({
        message: "Ambulance added successfully",
        data: newAmbulance
    });
});



module.exports = {
    login,
    signup,
    wleaderboard,
    mleaderboard,
    completeChallenge,
    subscribe,
    appointment,
};