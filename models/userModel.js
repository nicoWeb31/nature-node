const validator = require('validator');
const mongoose = require("mongoose");
const Shema = mongoose.Schema;

const userShema = new Shema({
    name: {
        type: String,
        required: [true,'Please tell us your name ! ']
    },
    email: {
        type: String,
        unique: true,
        required: [true,'Please provide your email ! '],
        lowercase: true,
        validate:{
            validator: validator.isEmail,
            message: 'Please provide an vilde email address !'
        }
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required:[true,'Please provide a password !'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true,'Please comfirn your password !']
    },
});


const User = mongoose.model('User',userShema);
module.exports = User;