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
        select: false //on veut pas get le password
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
    passwordChangeAt: Date
});


//mongose middleware, pre-save for passwordencrypte
userShema.pre('save',async function(next){
    //only run this function if password was actualy modified
    if(!this.isModified('password')) return next(); //si le mdp n'a ete modifier on passe a la suite

    this.password = await bcrypt.hash(this.password,12);//bcrypt is asynch func  pass + cout

    this.passwordConfirm = undefined; //on suprime le confirme pass de la bdd

    next();
})


//on rajouter une methods...treturn true si les passwords match
userShema.methods.correctPassword = async function(candidatePassword,userPassword) {

    return await bcrypt.compare(candidatePassword,userPassword);
}

userShema.methods.changePassAflter = function(JWTTimestamp){
    
    if(this.passwordChangeAt){
        const changeTimestamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
        return JWTTimestamp < changeTimestamp ; 
    }
    
    //false mean not change
    return false
}



const User = mongoose.model("User", userShema);
module.exports = User;
