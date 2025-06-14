const express=require('express');
const handler=require('../handlers/mainHandler');
const router=express.Router();

router.post('/login',handler.login);
router.post('/signup',handler.signup);

module.exports=mainRouter;