const express=require('express');
const handler=require('../handlers/mainHandler');
const router=express.Router();

router.post('/login',handler.login);
router.post('/signup',handler.signup);
router.get('/leaderboard',handler.leaderboard);
module.exports=router;