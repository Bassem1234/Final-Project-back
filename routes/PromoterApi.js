const express = require('express');
const router = express.Router();
const passport = require('passport');
const Promoter = require('../models/eventPromoter');
const Events = require('../models/events');
const bcrypt = require('bcrypt');
const User = require('../models/simpleUser');
const Admin = require('../models/admin');
const multer = require('multer');
const path = require('path');

//storage for image
const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload')
    },
    filename: (req, file, cb) => {
        const newFileName = Date.now() + path.extname(file.originalname);
        cb(null, file.originalname);
    }
});
// filter function for image upload
const fileFilterFunction = (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const allowedExtension = ['.jpg', '.png', '.gif', '.jpeg'];
    cb(null, file.extname(allowedExtension.includes(fileExtension)))
}
const maxSize = 1 * 1024 * 1024;
const Multer = multer({ storage: myStorage, limits: { fileSize: maxSize } });

//get the list of promoters from a database
router.get('/promoters', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const promoter = await Promoter.find({});
        res.json(promoter);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//get one promoter by id
router.get('/promoters/:id', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const promoter = await Promoter.findById(req.params.id);
        res.json(promoter);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//add a new promoter
router.post('/promoters', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const userFound = await User.findOne({ email: req.body.email });
        const promFound = await Promoter.findOne({ email: req.body.email });
        const adminFound = await Admin.findOne({email: req.body.email});
        if (userFound || promFound || adminFound) {
            res.send({ message: 'email already exists, please choose another email' });
        }
        else {
            const hashedPwd = await bcrypt.hash(req.body.password, 10);
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
    catch (err){
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//update a promoter by id
router.put('/promoters/:id/:pass', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const promoter = await Promoter.findById(req.params.id);
const cmp = await bcrypt.compare(req.params.pass, promoter.password);
        if (cmp) {
            const promoterToUpdate = await Promoter.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json({message:'your informations are modified successfully'});
        }
        else {
            res.json({message:'wrong password'});
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//delete a promoter
router.delete('/promoters/:id', async (req, res) => {
    try {
        const promoterToUpdate = await Promoter.findByIdAndDelete(req.params.id);
        res.json(promoterToUpdate);
    }
    catch {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Affect an event to an event promoter
router.put('/promoters-event/:idProm', [passport.authenticate('bearer', { session: false }), Multer.single('file')], async (req, res) => {
    try {
        if (req.file !== undefined) {
            console.log({ message: 'File uploaded successfully' });
        }
        else {
            console.log({ message: 'File not uploaded' })
        }
        let eventExist;
        eventExist = await Events.findOne({ eventName: req.body.eventName });

        if (eventExist) {
            res.json({ message: "Event already exists, please try an other event name" });
        }
        else {
            const PromToUpdate = await Promoter.findByIdAndUpdate(req.params.idProm, { $push: { events: req.body } }, { new: true });
            PromToUpdate.events[PromToUpdate.events.length - 1].picture = req.file.filename;
            const event = await Events.create(req.body);
            res.json({message: 'Event added successfully'});
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//update an event assigned to a promoter
router.put('/edit-event/:idProm/:indice', [passport.authenticate('bearer', { session: false }), Multer.single('file')], async (req, res) => {
    try {
        evennement = await Events.findOne({ eventName: req.body.eventName });
        PromToUpdate = await Promoter.findById(req.params.idProm);
        PromToUpdate.events[req.params.indice] = req.body;
        eventExist = await Events.findOne({ eventName: req.body.eventName });
        await Promoter.findByIdAndUpdate(req.params.idProm, PromToUpdate);
        const eventToUpdate = await Events.findByIdAndUpdate(evennement.id, req.body, { new: true });
        res.json({message:'event modified successfully'});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//get all promoters with events
router.get('/pormoters-with-events', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const promoters = await Promoter.find({}).populate('events', 'name -_id createdAt');
        res.json(promoters);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;