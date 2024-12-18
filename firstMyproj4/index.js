const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 8000;
require('dotenv').config();
const app = express();
require('./db');
const User = require('./MODELS/UserSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());



function authenticateToken(req, res, next){
    const token = req.headers.authorization.split(' ')[1];
    // const { id } = req.body;

    // console.log('token', token)

    if(!token) {
        const error = new Error('Token not found');
        next(error)
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userid = decoded.id;
        req.id = userid;
        next();
    } catch (err) {
        // console.log(err);
        // res.status(500).json({message: 'Invalid Token'});
        next(err)
    }
}

app.get('/', (req, res)=>{
    res.json({message: 'The API is working'});

});

app.post('/register', async (req, res)=>{
    try {
        const {name, password, email, age, gender} = req.body;
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(409).json({message:'Email already exists'})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // console.log('salt', salt);
        // console.log('hashedPassword', hashedPassword);

        const newUser =new User({
            name,
            password: hashedPassword,
            email,
            age,
            gender,
        });

        await newUser.save();
        res.status(201).json({
            message: 'user registered successfully'
        })
        
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})



app.post('/login', async (req, res, next)=>{
    try {
        const {email, password} = req.body;
        const existingUser = await User.findOne({email});

        if(!existingUser){
            return res.status(401).json({message: 'invalid credentials'});
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect){
            return res.status(401).json({message:'Invalid credentials'});
        }

            // Inside the /login route

            //GETTING OUR FIRST ACCESS AND REFRESH TOKEN AFTER LOGIN
            const accesstoken = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
                expiresIn: "1hr"
            });

            const refreshToken = jwt.sign({ id: existingUser._id }, process.env.JWT_REFRESH_SECRET_KEY);
            existingUser.refreshToken = refreshToken;
            await existingUser.save();
            res.cookie('refreshToken', refreshToken, { httpOnly: true, path:'/refresh_token'})

        res.status(200).json({
            accesstoken,
            refreshToken,
            message : " User logged in Successfully"
        })
        
    } catch (err) {
        next(err);
        
    }
})


app.get('/getmyprofile', authenticateToken, async (req, res) => {
    // const userId = req.body; // Extract user ID from the decoded token
    const id = req.id;
    const user = await User.findById(id);

    // if (!user) {
    //     return res.status(404).json({ message: 'User not found' });
    // }

    user.password = undefined;
    res.status(200).json({ user });
});

app.get('/refresh_token', async(req, res, next)=>{
    const token = req.cookies.refreshToken;
    // res.send(token)

    if(!token){
        const error = new Error('Token Not found');
        next(error);
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY, async (err, decoded)=>{
        if(err){
            const error = new Error('Invalid token');
            next(error)
        }

        const id = decoded.id;
        const existingUser = await User.findById(id);

        if(!existingUser || token !== existingUser.refreshToken){
            const error = new Error('Invalid toke ');
            next(error);

        }

        //GETTING TOKEN AFTER 40 SEC AFTER FIRST TOKEN EXPIRES

        const accesstoken = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "1hr"
        })

        const refreshToken = jwt.sign({ id: existingUser._id }, process.env.JWT_REFRESH_SECRET_KEY);
        existingUser.refreshToken = refreshToken;
        await existingUser.save();
        res.cookie('refreshToken', refreshToken, { httpOnly: true, path:'/refresh_token'})

        res.status(200).json({
            accesstoken,
            refreshToken,
            message : " token refresh successfully"
        })
    })

})



//ERROR HANDLING MIDDLEWARE

app.use((err, req, res, next) => {
    console.log('error midddleware called', err);
    res.status(500).json({message: err.message})
})



app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
})

