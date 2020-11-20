const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppErr = require("./../utils/AppErr");
const factory = require("./handlerFactory")


const filterObj =(obj, ...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)){
            newObj[el] = obj[el];
        }
    })
    return newObj;
}


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


exports.updateMe = catchAsync(async (req, res, next) => {
    //1 create error if user post password data
    if(req.body.password || req.body.confirmPassword) {
        return next(new AppErr('This route is not for password updte, please use /updateMyPassword', 400));
    }

    //2 filtered out fields names that are not allowed to update 
    const filteredBody = filterObj(req.body, 'name', 'email');
    
    //3 Update document
    const updateUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new: true,
        runValidators: true
    } );


    res.status(200).json({
        status: 'success',
        data:{
            user:updateUser
        }
    })

})

exports.deleteMe = catchAsync(async(req, res, next) => {
    await User.findOneAndUpdate(req.user.id, {active:false})
    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.createUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "route is not defined",
    });
};

// exports.deleteUser = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         message: "route is not defined",
//     });
// };
exports.deleteUser = factory.deleteOne(User)

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