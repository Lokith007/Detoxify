require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware'); 
const mainRoute = require('./routers/mainRouter');

const port = process.env.PORT || 3000; 

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'Frontend')));
app.use('/app', mainRoute);

app.use('/chat', createProxyMiddleware({
    target: 'http://localhost:5001',
    changeOrigin: true
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
