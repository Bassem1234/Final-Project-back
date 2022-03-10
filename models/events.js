const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    eventName: {type: String, required:true},
    title: {type: String, required:true},
    description: {type: String, required:true},
    authorFname: {type: String, required: true},
    authorLname: {type:String, required: true},
    adress: {type: String, required:true},
    picture: String,
    category: {type: String, required:true},
    startDate: Date,
    ticketAvailable: {type: Number, required:true, default: 125},
    price: Number,
    sevDays: { type: Boolean, default: false },
    endDate: Date,
    createdAt : {type:Date, default: Date.now()},
    participants: {type:Number, default:0},
    schedule: [
        // {
        //     day: Number,
        //     subEvent: [{
        //         adress: String,
        //         startTime: Date,
        //         endTime: Date,
        //         title: String,
        //         description: String,
        //         tickets: { type: Boolean, default: false },
        //         avTickets: Number,
        //         price: Number
        //     }
        //     ]
        // }
    ]
});

const Events = mongoose.model('events', eventSchema);
module.exports = Events;