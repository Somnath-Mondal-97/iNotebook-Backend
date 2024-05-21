const express = require('express');
const User = require('../models/User');
const fetchUser = require('../middleware/fetchUser')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// jwt key for authenticating user
const JWT_KEY = process.env.JWT_KEY


// Create a user using a POST request
router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        let success = false
        if (!errors.isEmpty()) {
            return res.status(400).json({success, errors: errors.array() });
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({success, error: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        const payload = {
            user: {
                id: newUser.id
            }
        };

        const jwtToken = jwt.sign(payload,JWT_KEY);
        success = true
        res.status(201).json({success, token: jwtToken });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
});

// Authenticate an user using Post Request

router.post('/loginUser',[
    body('email').isEmail(),
    body('password').exists()
],async (req,res) => {
    try {
        const errors = validationResult(req);
        let success = false
        if (!errors.isEmpty()) {
            return res.status(400).json({success, errors: errors.array() });
        }
        const {email,password} = req.body
        try {
            let user = await User.findOne({email})
            if(!user){
                return res.status(400).json({success, error:"Please try to login with correct credentials"})
            }
            const passwordCompare = await bcrypt.compare(password,user.password)
            if(!passwordCompare){
                return res.status(400).json({success, error:"Please try to login with correct credentials"})
            }
            const payload = {
                user:{
                    id:user.id
                }
            }
            const jwtToken = jwt.sign(payload,JWT_KEY);
            success = true
            res.status(201).json({success, token: jwtToken });
            console.log("User Validated")
        } catch (error) {
            console.log(error.message)
            res.status(500).send("Error Authenticating user")
        }
    } catch (error) {
        console.log(error.message)
            res.status(500).send("Some error occured")
    }
})

// Get user details using get method '/getUser'

router.post('/getUser',fetchUser,async (req,res) => {
    try {
        const userId = req.user.id
        let user = await User.findById(userId).select("-password")
        res.status(200).send(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Error Authenticating user")
    }
})

module.exports = router;
