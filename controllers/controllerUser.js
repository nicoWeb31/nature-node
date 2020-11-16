const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')

exports.getAllUsuers = catchAsync(async(req, res,next) => {

    const users = await User.find();

    res.status(200).json({
        status: "success",
        results: users.length,
        data:{
            users
        }
    });
});

exports.createUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "route is not defined",
    });
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "route is not defined",
    });
};

exports.patchUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "route is not defined",
    });
};

exports.getOneUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "route is not defined",
    });
};