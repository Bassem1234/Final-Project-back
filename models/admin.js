const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create user schema & model

const AdminSchema = new Schema({
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
        type:String, default: 'admin'
    },
    createdAt : Date,
    messages: [],
    newMsg : {type:Number, default:0}
});

const Admin = mongoose.model('admin', AdminSchema);

module.exports = Admin;
