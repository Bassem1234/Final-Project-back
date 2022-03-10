const express = require('express');
const passport = require('passport');
const Admin = require('../models/admin');
const router = express.Router();
const User = require('../models/simpleUser');
const Promoter = require('../models/eventPromoter');

const bcrypt = require('bcrypt');
//get the list of admins from a database
router.get('/admins' ,passport.authenticate('bearer', {session: false}),async (req,res) => {
try{
    const admins = await Admin.find({});
    res.json(admins);
}
 catch(err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
 }
});

//get one admin by id
router.get('/admins/:id', passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        res.json(admin);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});


//add a new admin
router.post('/admins',  passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const createdAdmin = await Admin.create(req.body);
        res.json(createdAdmin);
    }
    catch {
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});


//update an admin by id
router.put('/admins/:id', passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const userFound = await User.findOne({ email: req.body.email });
        const promFound = await Promoter.findOne({ email: req.body.email });
        const adminFound = await Admin.findOne({email: req.body.email});
        const admin = await Admin.findById(req.params.id);
        if (userFound || promFound || (adminFound && adminFound.email != admin.email)) {
            res.send({ message: 'email already exists, please choose another email' });
        }
        else {
            const hashedPwd = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPwd;
        const adminToUpdate = await Admin.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json({ message:"your informations are modified successfully"});
        }
    }
    catch (err){
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});

//delete an admin
router.delete('/admins/:id', async (req,res) => {
    try {
        const adminToDelete = await Admin.findByIdAndDelete(req.params.id);
        res.json(adminToDelete);
    }
    catch {
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});


//send a message to the admin
router.put('/message/:id', passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        //const adminToUpdate = await Admin.findByIdAndUpdate(req.params.id,{$push: {messages: req.body}});
        const adminToUpdate  = await Admin.findById(req.params.id);
        adminToUpdate.newMsg = adminToUpdate.newMsg + 1; 
        adminToUpdate.messages.push(req.body)
        await Admin.findByIdAndUpdate(req.params.id,adminToUpdate);
        res.json("your message has been sent");

    }
    catch (err){
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});

//reintialize new messages
router.put('/rein-message/:id', passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const adminToUpdate = await Admin.findByIdAndUpdate(req.params.id,{newMsg : 0});
        res.json("your message has been sent");

    }
    catch (err){
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});


module.exports = router;