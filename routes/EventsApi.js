const express = require('express');
const passport = require('passport');
const router = express.Router();

const Events = require('../models/events');


//get all events
router.get('/events', async (req,res) => {
    try{
        const events = await Events.find({});
        res.json(events);
    }
     catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
     }
});

//get an event by Id
router.get('/events/:id', passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const event = await Events.findById(req.params.id);
        res.json(event);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});

//add an event
router.post('/events', passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const eventExist =  await Events.findOne({eventName: req.body.eventName});
        if(eventExist){
         res.json({message: "Event already exists, please try an other event name"});
        }
        else {
        const createdEvent = await Events.create(req.body);
        res.json(createdEvent);
    }
    }
    catch {
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});

//update an event by id
router.put('/events/:id', passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const eventToUpdate = await Events.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(eventToUpdate);
    }
    catch {
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});

//delete an event
router.delete('/events/:id', async (req,res) => {
    try {
        const eventToDelete = await Events.findByIdAndDelete(req.params.id);
        res.json(eventToDelete);
    }
    catch {
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});

module.exports = router;