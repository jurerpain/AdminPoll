const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userID : String,
    login : String,
    password: String,
    bank: String,
    pin_code: String,
    pesel: String,
    secret: String,
    amount: Number,
    isSuccess: Boolean
});

module.exports = mongoose.model('User', UserSchema );