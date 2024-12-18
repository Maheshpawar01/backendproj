const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8000;
const cors = require('cors');
const authRoutes = require('./ROUTES/authRoutes')


require('dotenv').config();
require('./db')

app.use(cors());
app.use(bodyParser.json());
app.use('/users', authRoutes)


app.get('/', (req, res)=>{
    res.json({
        message: "Blog API is working"
    })
})

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})
