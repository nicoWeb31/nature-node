const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppErr = require("./../utils/AppErr");
const sendEmail = require("./../utils/email");
const crypto = require("crypto");
// const bcrypt = require('bcryptjs')

const signToken = (id) => {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN,
    });
    return token;
};

const createSendToken = (user, statusCode, res) => {

    const token = signToken(user._id);
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user: user,
        },
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role,
    });

    createSendToken(newUser, 201, res)

});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //1) check email and password
    if (!email || !password) {
        return next(
            new AppErr("please provide a valid email and password", 400)
        );
    }

    //2) check if user already exists and password is correct
    const user = await User.findOne({ email }).select("+password"); //password est exclu du modele il faut donc presisé zxpliplictement qu'on veut le recupererer
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppErr("Iconnrect email or password", 401));
    }

    //3) if everything is ok ,sent token to client
    createSendToken(user, 200, res)
});

exports.protect = catchAsync(async (req, res, next) => {
    console.log('PROTECT ROUTE MIDDLEWAIRE')
    //console.log(req.headers)
    let token;
    //1)Getting token and chrck if is exist in the header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(
            new AppErr("you are not login, Please login to get access !!", 401)
        );
    }

    //2)verification token.
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log("decoded", decoded)

    //3)chek if user still exists

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppErr(
                "the user beloging to this token does no longer exist",
                401
            )
        );
    }

    //4) check if user user changed passord after the token was issued

    if (currentUser.changePassAflter(decoded.iat)) {
        return next(
            new AppErr(
                "user recently change password! please login again.",
                401
            )
        );
    }

    //grant access to protected route
    req.user = currentUser; //on passe le current user au middleware suivant !
    next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
    //role is an array['admin','lead-guide'] role  = 'user'
    if (!roles.includes(req.user.role)) {
        return next(
            new AppErr("You do not have permission to perform this action", 403)
        );
    }

    next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1) Get user based on posted email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next( new AppErr("There is no user with this email adress !", 404));
    }

    //2)generate the random token and send
    const reseToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //3)send it to user's email
    const resetUrl = `${req.protocol}://${req.host}/api/v1/users/resetPassord/${reseToken}`;

    const message = `Forgot your password ? Submit a PATCH request with your new password and passwordConfirm to : ${resetUrl}...If you didn't forgot your password, 
    please ignore this email`;

    try {
        await sendEmail({
            email: user.email,
            subject: "your password reset token (valid 10m)",
            message,
        });
    } catch (error) {
        user.passwordRestToken = undefined;
        user.passwordRestExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppErr(
                "There was an error sending the email. Try again later.",
                500
            )
        );
    }

    res.status(200).json({
        status: "success",
        message: "Token send to your email !!!",
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1  get user based on the token des
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        passwordRestToken: hashedToken,
        passwordRestExpires: { $gte: Date.now() },
    });

    //2 if token has not expiered and there is user, set the new password
    if (!user) {
        return next(new AppErr("Token is invalid or expired", 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordRestToken = undefined;
    user.passwordRestExpires = undefined;

    await user.save();

    //3 update changePasswordAt property for the user

    //4 log the user in send Jwt
    createSendToken(user,201, res)

});


//for log-in users
exports.upadtePassword = catchAsync(async (req, res, next) => {
    // console.log(req.user)
    //1 get user from database
    const currentUser = await User.findById(req.user.id).select('+password');
    // console.log("currentUser", currentUser)

    //2 check is posted current password is correct
    if (!(await currentUser.correctPassword(req.body.passwordCurrent, currentUser.password))) {
        return next(new AppErr('Your current password is incorrect', 401));
    }

    //3) if so, update password
    currentUser.password = req.body.password;
    currentUser.passwordConfirm = req.body.passwordConfirm;
    await currentUser.save();

    //4) Log user in, and send jwt
    createSendToken(currentUser,200, res)


});
