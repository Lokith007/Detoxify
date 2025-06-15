const express=require('express');
const alerthandler=require('../handlers/alertHandler');
const router=express.Router();

router.post('/sos',alerthandler.sos);
router.get('/getkey',alerthandler.getkey);

module.exports=router;