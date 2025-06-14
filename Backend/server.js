const express=require('express');
const cors =require('cors');
const path = require('path');
const mainRoute = require('./routers/mainRouter');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname,'..','Frontend')));
app.use('/app',mainRoute);

app.get('/',(req,res)=>{
     res.sendFile(path.join(__dirname,'..','Frontend','index.html'));
})
app.listen(process.env.port,(req,res)=>{
     console.log(`server is running at http://localhost:${process.env.port}`);
});