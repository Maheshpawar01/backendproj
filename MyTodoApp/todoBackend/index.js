const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const todoRoutes = require('./ROUTES/TodoRoutes')
require('dotenv').config();
require('./db')

app.use(cors())
app.use(bodyParser.json());
app.use('/todosroutes', todoRoutes);
//frontend url = http://localhost:300




app.get('/', (req, res)=>{
    res.json({
        message:'The API is working'
    })
});

app.listen(PORT, ()=>{
    console.log(`server is running on PORT ${PORT}`);
})