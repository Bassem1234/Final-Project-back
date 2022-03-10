const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Promoter = require('../models/eventPromoter');
passport = require('passport');

fileUpload = require('express-fileupload');
//multer Storage Options
const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload')
    },
    filename: (req, file, cb) => {
        const newFileName = Date.now() +  path.extname(file.originalname);
        cb(null, newFileName);
    }
});


const fileFilterFunction = (req, file, cb) => {
const fileExtension = path.extname(file.originalname);
const allowedExtension = ['.jpg', '.png', '.gif', '.jpeg'];
cb(null, file.extname(allowedExtension.includes(fileExtension)))
}
const maxSize = 1*1024*1024;
const Multer = multer({ storage: myStorage, limits: {fileSize: maxSize}});

router.post('/upload', Multer.single('file'), async (req, res) => {
console.log(req.file);
        if(req.file !== undefined){
            promoter = await Promoter.findById('62122d5d033715f6c8f733af');
            promoter.events[0].eventName = req.file;
            console.log(promoter.events[0]);
            res.send({ message: 'File uploaded successfully'});
        }
        else {
            res.status(400).send({message: 'File not uploaded'})
        }
});


module.exports = router;