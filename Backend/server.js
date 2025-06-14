const express=require('express');
const cors =require('cors');
const mainRoute = require('./routers/mainRoute');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/app',mainRoute);

app.listen(process.env.port,(req,res)=>{
     console.log(`server is running at http://localhost:${process.env.port}`);
});