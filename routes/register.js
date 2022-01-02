const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
    const {username, password} = req.body;
    
    if (!username || !password) return res.status(401).json({message:'Invalid Username or Password.'})

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username: username,
        password: hashPassword
    }) 

    try {

        const newUser = await user.save();
        res.status(201).json(newUser);

    } catch (err) {

        if (err.code === 11000){
            return res.status(409).json(
                { message: 'Username already in use.' }
            );
        }
        
        res.status(401).json({message: 'Invalid Username or Password.'})

    }
})

module.exports = router;

