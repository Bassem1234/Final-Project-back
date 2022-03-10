const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const emailSchema = new Schema({
  from: {type: String, required: true},
  to: {type: String, required: true},
  subject:  String,
  text: String,
  html: String
}, {
    versionKey: false,
    timestamps: true
});
const Email = mongoose.model('email', emailSchema);
module.exports = Email;