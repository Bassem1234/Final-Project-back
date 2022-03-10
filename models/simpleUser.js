const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create user schema & model

const UserSchema = new Schema({
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
    profile: {
        type: {type:String, default:'Simple user'}
    },
    basket: [],
    createdAt : Date,
    tickets: [
    ]
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
