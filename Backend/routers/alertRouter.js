const express=require('express');
const alerthandler=require('../handlers/alertHandler');
const router=express.Router();

router.post('/sos',alerthandler.sos);

module.exports=router;