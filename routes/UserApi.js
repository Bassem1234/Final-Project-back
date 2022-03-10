const express = require('express');
const passport = require('passport');
const Promoter = require('../models/eventPromoter');
const router = express.Router();
const Admin = require('../models/admin');
//require model
const User = require('../models/simpleUser');
const Event = require('../models/events');
const bcrypt = require('bcrypt');
//get the list of users from a database
router.get('/users' ,passport.authenticate('bearer', {session: false}),async (req,res) => {
try{
    const users = await User.find({});
    res.json(users);
}
 catch(err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
 }
});

//get one user by id
router.get('/users/:id', passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});


//add a new user
router.post('/users',  passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const userFound = await User.findOne({ email: req.body.email });
        const promFound = await Promoter.findOne({ email: req.body.email });
        const adminFound = await Admin.findOne({email: req.body.email});
        if (userFound || promFound || adminFound) {
            res.send({message:'email already exists, please choose another email'});
        }
        else{
        const hashedPwd = await bcrypt.hash(req.body.password, 10);
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
                res.send({message:'User added successfully'})
        }
    }
    catch (err){
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});

//update a user by id with an event to basket
router.put('/users/:id', passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        const userToUpdate = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json({message:"event added to your basket successfully"});
    }
    catch (err){
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});
//update a user by id with an event validated
router.put('/users-ticket/:id/:fName/:lName', passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        const userToUpdate = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        const promoter = await Promoter.findOne({fName: req.params.fName});
        console.log(promoter)
        for(let i = 0; i < promoter.events.length; i++){
            if(promoter.events[i].eventName == req.body.tickets[req.body.tickets.length -1].event.eventName){
                promoter.events[i].participants += req.body.tickets[req.body.tickets.length -1].ticketNumber;
            }
        }
        await Promoter.findByIdAndUpdate(promoter.id, promoter);
         let event = await Event.findOne({eventName: req.body.tickets[req.body.tickets.length-1].event.eventName});
         event.participants += req.body.tickets[req.body.tickets.length -1].ticketNumber;
         console.log(event.participants);
         console.log(event.id);
        await Event.findByIdAndUpdate(event.id, event);
        res.json({message:"Tickets validated successfully"});
    }
    catch (err){
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});


//update a user by id
router.put('/users/:id/:pass', passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        const cmp = await bcrypt.compare(req.params.pass, user.password);
                if (cmp) {
        const userToUpdate = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json({message:"your informations are modified successfully"});}
        else {
            res.json({message:"wrong password"});
        }
    }
    catch (err){
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});

//delete a user
router.delete('/users/:id', async (req,res) => {
    try {
        const userToUpdate = await User.findByIdAndDelete(req.params.id);
        res.json(userToUpdate);
    }
    catch {
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});

module.exports = router;