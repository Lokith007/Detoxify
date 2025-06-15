const express=require('express');
const handler=require('../handlers/mainHandler');
const mailhandler=require('../handlers/sendmail')
const router=express.Router();

router.post('/login',handler.login);
router.post('/signup',handler.signup);
router.get('/wleaderboard',handler.wleaderboard);
router.get('/mleaderboard',handler.mleaderboard);
router.get('/completeChallenge',handler.completeChallenge);
router.post('/subscribe',handler.subscribe);
router.post('/sendmail',mailhandler.sendMail);

module.exports=router;