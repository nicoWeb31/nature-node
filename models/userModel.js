const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Shema = mongoose.Schema;


const userShema = new Shema({
    name: {
        type: String,
        required: [true, "Please tell us your name ! "],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please provide your email ! "],
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email ! "],
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please provide a password !"],
        minlength: 8,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please comfirn your password !"],
        validate: {
            //only work on create and save !!!
            validator: function (el) {
                return el === this.password; //return true or false renvoie une error
            },
            message: "Password doesn't match !!",
        },
    },
});


//mongose middleware, pre-save for passwordencrypte
userShema.pre('save',async function(next){
    //only run this function if password was actualy modified
    if(!this.isModified('password')) return next(); //si le mdp n'a ete modifier on passe a la suite

    this.password = await bcrypt.hash(this.password,12);//bcrypt is asynch func  pass + cout

    this.passwordConfirm = undefined; //on suprime le confirme pass de la bdd

    next();
})


const User = mongoose.model("User", userShema);
module.exports = User;
