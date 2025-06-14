require('dotenv').config();
const express=require('express');
const cors =require('cors');
const path = require('path');
const mainRoute = require('./routers/mainRouter');

const port = process.env.port ;
console.log(port);
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname,'..','Frontend')));
app.use('/app',mainRoute);

app.get('/',(req,res)=>{
     res.sendFile(path.join(__dirname,'..','Frontend','index.html'));
})
app.listen(port,(req,res)=>{
     console.log(`server is running at http://localhost:${port}`);
});