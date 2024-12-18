const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../MODELS/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:process.env.COMPANY_EMAIL,
        pass : process.env.COMPANY_PASSWORD
    }
})


router.get('/', async (req, res) =>{
    res.json({
        message: "user route is working"
    })
})

router.post('/register', async (req, res)=>{
    try{
        const { username, email, password} = req.body;
        const user = new User({username, email, password});
        await user.save();
        res.json({
            message: 'User created successfully'
        });
    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
})

router.post('/login', async (req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message : 'User not found'
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }
        const token = jwt.sign({
            userId : user._id
        }, JWT_SECRET_KEY)

        res.json({
            token, user, message: 'User logged in Successfully'
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
})

router.post('/sendotp', async (req, res)=>{
    const {email} = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    try{
        const mailOptions = {
            from: process.env.COMPANY_EMAIL,
            to: email,
            subject: 'OTP for verification',
            text: `YOur OTP for verification is ${otp}`
        }
        transporter.sendMail(mailOptions, async (err, info)=>{
            if(err){
                res.status(500).json({
                    message:err.message
                });
            }
            else{
                const user = await User.findOne({email});
                if(!user){
                    return res.status(400).json({
                        message: 'User not found'
                    });
                }

                user.otp = otp;
                res.json({
                    message: 'OTP sent successfully'
                });
            }
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
    }
})


module.exports = router;


