const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppErr = require("./../utils/AppErr");
const factory = require("./handlerFactory");
const multer = require('multer');



//multer
const upload = multer({dest: 'public/img/users'})

exports.uploadMulter = upload.single('photo')


const filterObj =(obj, ...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)){
            newObj[el] = obj[el];
        }
    })
    return newObj;
}


//recupere les infos du current user, on utilise get one mais avec l'id provenent du current user
exports.getMe = (req,res,next) => {
    req.params.id = req.user.id
    next();
}


// exports.getAllUsuers = catchAsync(async(req, res,next) => {

//     const users = await User.find();

//     res.status(200).json({
//         status: "success",
//         results: users.length,
//         data:{
//             users
//         }
//     });
// });
// with factory
exports.getAllUsuers = factory.getAll(User);


exports.updateMe = catchAsync(async (req, res, next) => {

    console.log(req.file)
    console.log(req.body)
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
        message: "route is not defined ! please use /signup instead",
    });
};


// exports.deleteUser = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         message: "route is not defined",
//     });
// };
exports.deleteUser = factory.deleteOne(User)

// exports.patchUser = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         message: "route is not defined",
//     });
// };
//do not update password with this!!!
exports.patchUser = factory.updateOne(User)

// exports.getOneUser = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         message: "route is not defined",
//     });
// };
exports.getOneUser = factory.getOne(User)