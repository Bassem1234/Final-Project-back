const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create user schema & model

const PromoterSchema = new Schema({
    fName: {
        type: String,
        required: [true, 'First name field is required']
    },
    lName: {
        type: String,
        required: [true, 'Last name field is required']
    },
    phone: {
        type: Number,
        required: [true, 'Phone field is required']
    },
    email: {
        type: String,
        required: [true, 'Email field is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    adress: {
        type: String,
        required: [true, 'Adress is required']
    },
    profile: {type:String, default: 'Event promoter'},
    createdAt : {type:Date, required:true},
    events: [
        {
            eventName: String,
            title: String,
            description: String,
            adress: String,
            authorFname: String,
            authorLname: String,
            picture: String,
            category: String,
            startDate: Date,
            ticketAvailable: Number,
            price: Number,
            sevDays: {type:Boolean, default: false},
            endDate: Date,
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
        }
    ]
});

const Promoter = mongoose.model('promoter', PromoterSchema);

module.exports = Promoter;