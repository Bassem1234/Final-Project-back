const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const email = require('../models/mailSchema');



const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWORD
    },
    //secure: true // Upgrade this later with STARTTLS --change this based on the PORT
});
//1st method with MongoDb

router.post('/email', async (req, res) => {
    try {
        const createdEmail = await email.create(req.body)
        const { to, Subject, text, subject } = req.body;
        const mailData = {
            from: req.body.from,
            to: createdEmail.to,
            subject: req.body.subject,
            text: createdEmail.text,
            html: createdEmail.html
        }
        const info = await transporter.sendMail(mailData);
        res.send({ message: 'Mail.send', message_id: info.messageId });
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
})


router.get('/email', async (req, res) => {
    try {
        const createdEmail = await email.find({});
        res.json(createdEmail);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
});

router.delete('/email/:id', async (req, res) => {
    try {
        const emailDeleted = await email.findByIdAndRemove(req.params.id);
        res.json({ message: 'user deleted successfully' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/email/:id', async (req, res) => {
    try {
        const mail = await email.findById(req.params.id);
        res.json(mail);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
})






//2ème méthode without MongoDb

// router.post('/html-mail', async (req, res) => {
//     try {
//         const mailData = {
//             from: 'bassem.rbaia1@gmail.com',
//             to: 'bassem.rbaia1@gmail.com',
//             Subject: 'subject',
//             text: 'text',
//             html: '<br>Hey there! </br><br> This is our first message sent with Node mailer</br>'
//         }

//         const info = await transporter.sendMail(mailData);
//         res.send({ message: "Mail send", message_id: info.messageId });
//     }
//     catch {
//         console.log(err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


//3ème méthode without MongoDb

// router.post('/html-mail/v2', async (req, res) => {
//     try {
//         //1. read template path
//         const templatePath = path.resolve('./mail_template', 'Notification_v1.html');
//         //2. read template content
//         const content = fs.readFileSync(templatePath, {encoding: 'utf-8'});

//         const mailData = {
//             from: 'bassem.rbaia1@gmail.com',
//             to: 'bassem.rbaia1@gmail.com',
//             Subject: 'subject',
//             html: content
//         }

//         const info = await transporter.sendMail(mailData);
//         res.send({ message: "Mail send", message_id: info.messageId });
//     }
//     catch {
//         console.log(err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// //4ème méthode without MongoDb

// router.post('/html-mail/v3/:name', async (req, res) => {
//     try {
//         //1. read template path
//         const templatePath = path.resolve('./mail_template', 'Notification_v2.html');
//         //2. read template content
//         const content = fs.readFileSync(templatePath, {encoding: 'utf-8'});
//         //3. rendering template
        

//         const mailData = {
//             from: 'bassem.rbaia1@gmail.com',
//             to: 'bassem.rbaia1@gmail.com',
//             Subject: 'subject',
//             html: content
//         }

//         const info = await transporter.sendMail(mailData);
//         res.send({ message: "Mail send", message_id: info.messageId });
//     }
//     catch {
//         console.log(err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


module.exports = router;