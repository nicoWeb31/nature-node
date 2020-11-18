const validator = require("validator");
const crypto = require("crypto");
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
    role: {
        type: String,
        enum: ["admin", "user", "guide", "lead-guide"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "Please provide a password !"],
        minlength: 8,
        select: false, //on veut pas get le password
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
    passwordChangeAt: Date,
    passwordRestToken: String,
    passwordRestExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false, //on veut pas que le fielde soit accessible
    },
});

//mongose middleware, pre-save for passwordencrypte
userShema.pre("save", async function (next) {
    //only run this function if password was actualy modified
    if (!this.isModified("password")) return next(); //si le mdp n'a ete modifier on passe a la suite

    this.password = await bcrypt.hash(this.password, 12); //bcrypt is asynch func  pass + cout

    this.passwordConfirm = undefined; //on suprime le confirme pass de la bdd

    next();
});

//on rajouter une methods...treturn true si les passwords match
userShema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userShema.methods.changePassAflter = function (JWTTimestamp) {
    if (this.passwordChangeAt) {
        const changeTimestamp = parseInt(
            this.passwordChangeAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changeTimestamp;
    }

    //false mean not change
    return false;
};

userShema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next(); //Returns true if this document was modified, else false.
    this.passwordChangeAt = Date.now() - 1000;
    next();
});

//montre que les documents actif
userShema.pre(/^find/, function (next) {
    //this points to this current querry
    this.find({ active: { $ne: false } });
    next();
});

userShema.methods.createPasswordResetToken = function () {
    const resToken = crypto.randomBytes(32).toString("hex");

    this.passwordRestToken = crypto
        .createHash("sha256")
        .update(resToken)
        .digest("hex");

    this.passwordRestExpires = Date.now() + 10 * 60 * 1000;

    return resToken;
};

const User = mongoose.model("User", userShema);
module.exports = User;
