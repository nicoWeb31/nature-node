const jwt = require("jsonwebtoken");
const {promisify} = require('util');
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppErr = require('./../utils/AppErr');
// const bcrypt = require('bcryptjs')

const signToken = id =>{
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN,
    });
    return token
}


exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const token =  signToken(newUser._id)

    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser,
        },
    });
});

exports.login = catchAsync(async(req, res, next) => {
    const {email,password} = req.body;

    //1) check email and password
    if(!email || !password) {
        return next(new AppErr('please provide a valid email and password',400));
    }

    //2) check if user already exists and password is correct
    const user = await User.findOne({email}).select('+password')//password est exclu du modele il faut donc presisé zxpliplictement qu'on veut le recupererer
    if(!user || !await user.correctPassword(password,user.password)) {
        return next(new AppErr('Iconnrect email or password', 401));
    }
    
    //3) if everything is ok ,sent token to client

    const token = signToken(user._id)

        res.status(200).json({
            status: 'success',
            token
        });
});


exports.protect = catchAsync(async (req, res, next)=>{
    //console.log(req.headers)
    let token;
    //1)Getting token and chrck if is exist in the header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    
    if(!token) {
        return next(new AppErr('you are not login, Please login to get access !!', 401))
    }


    //2)verification token.
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // console.log("decoded", decoded)
    

    //3)chek if user still exists

    const freshUser = await User.findById(decoded.id);
    if(!freshUser){
        return next( new AppErr('the user beloging to this token does no longer exist',401) );
    }

    //4) check if user user changed passord after the token was issued 

    if(freshUser.changePassAflter(decoded.iat)){
        return next(new AppErr('user recently change password! please login again.', 401))
    }

    //grant access to protected route
    req.user = freshUser;
    next();
});