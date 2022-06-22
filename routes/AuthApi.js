const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {google} = require('googleapis');
//require model
const User = require('../models/simpleUser');
const Promoter = require('../models/eventPromoter');
const Admin = require('../models/admin');

// require bcrypt and require the salt
const bcrypt = require('bcrypt');
const passport = require('passport');
router.post('/register', async (req, res) => {
    try {
        const userFound = await User.findOne({ email: req.body.email });
        const promFound = await Promoter.findOne({ email: req.body.email });
        const adminFound = await Admin.findOne({email: req.body.email});
        if (userFound || promFound || adminFound) {
            res.send({ message: 'email already exists, please choose another email' });
        }

        else {
            const hashedPwd = await bcrypt.hash(req.body.password, 10);
            if (req.body.profile == 'Simple user') {
                const createdUser = await User.create({
                    fName: req.body.fName,
                    lName: req.body.lName,
                    phone: req.body.phone,
                    email: req.body.email,
                    password: hashedPwd,
                    profile: req.body.profile,
                    adress: req.body.adress,
                    createdAt : Date.now()
                });
                res.json({message:'User added successfully'});
            }
            else if(req.body.profile == 'admin'){
                const createdAdmin = await Admin.create({
                    fName: req.body.fName,
                    lName: req.body.lName,
                    phone: req.body.phone,
                    email: req.body.email,
                    password: hashedPwd,
                    profile: req.body.profile,
                    adress: req.body.adress,
                    createdAt : Date.now()
                });
                res.json({message: 'admin added successfully'});
            }
            else {
                const createdPromoter = await Promoter.create({
                    fName: req.body.fName,
                    lName: req.body.lName,
                    phone: req.body.phone,
                    email: req.body.email,
                    password: hashedPwd,
                    profile: req.body.profile,
                    adress: req.body.adress,
                    createdAt : Date.now()
                });
                res.json({message: 'Promoter added successfully'});
            }
            
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email});
        const promoter = await Promoter.findOne({email: req.body.email});
        const admin = await Admin.findOne({email: req.body.email});
        console.log(req.body.password)
        if (user) {
            const cmp = await bcrypt.compare(req.body.password, user.password);
            if(cmp) {
                // create jwt token
                const tokenData = {
                    userId: user._id,
                    email: user.email
                };
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
                res.send({message: 'Auth Successful', token: token, user: user, id: user._id});
            } 
            else {
                res.send({message: "Wrong email or password"});
            }
        }
        else if(promoter){
            const cmp = await bcrypt.compare(req.body.password, promoter.password);
            if(cmp) {
                //create jwt token
                const tokenData = {
                    promoterId: promoter._id,
                    email: promoter.email
                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
                res.send({message: 'Auth Sucessful', token: token, user: promoter, id: promoter._id});
            }
            else {
                res.send({message: "Wrong email or password"});
            }
        }
        else if(admin){
            const cmp = await bcrypt.compare(req.body.password, admin.password);
            if(cmp) {
                //create jwt token
                const tokenData = {
                    adminId: admin._id,
                    email: admin.email
                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
                res.send({message: 'Auth Sucessful', token: token, user: admin, id: admin._id});
            }
            else {
                res.send({message: "Wrong email or password"});
            }
        }
        else {
            res.send({message: "Wrong email or password"});
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = router;