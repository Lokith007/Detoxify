const expressAsyncHandler=require('express-async-handler');
const bcrypt = require('bcrypt');
const body_parse=require('body-parser');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');  
const path=require("path");  
const Users=require("../../models/users");

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

    const token = jwt.sign({ mail: data.gmail }, process.env.secretkey, { expiresIn: '1h' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 3600000
    });

    return res.send({ message: "s" });
});

const leaderboard = expressAsyncHandler(async (req, res) => {
    const topUsers = await Users.find({})
        .select('name XP streak -_id')
        .sort({ XP: -1 })
        .limit(10);
    const result = [...topUsers];
    const missing = 10 - result.length;

    for (let i = 0; i < missing; i++) {
        result.push({
            name: '—',
            XP: 0,
            streak: 0
        });
    }
    return res.json(result);
});

const completeChallenge = expressAsyncHandler(async (req, res) => {
    const { gmail } = req.body;

    if (!gmail) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await Users.findOne({ gmail });
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




module.exports = {
    login,
    signup,
    leaderboard
};