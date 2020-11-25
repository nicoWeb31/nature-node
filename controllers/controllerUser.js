const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppErr = require("./../utils/AppErr");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");

/////MULTER CONFIG + MIDLLEWARE ---- UPLOAD IMG////////

//storage
// const multerSorage = multer.diskStorage({
//     destination: (req, file, callbackNext) => {
//         callbackNext(null, "public/img/users");
//     },
//     filename: (req, file, callbackNext) => {
//         //user-234234id-12313'.ext
//         const ext = file.mimetype.split("/")[1];
//         callbackNext(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     },
// });
const multerSorage = multer.memoryStorage();

//filter
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else cb(new AppErr("Not a valid format for image ! ", 400), false);
};

//multer midllware
const upload = multer({
    storage: multerSorage,
    fileFilter: multerFilter
});

exports.uploadMulter = upload.single("photo");

//resize photo with sharp libreary
exports.resizePhoto = (req,res, next)=>{
    if(!req.file) return next();
    
    //after buffer set in req
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`
    
    sharp(req.file.buffer)
    .resize(500,500)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/img/users/${req.file.filename}`);
    
    console.log(req.file)
    next();
    
}

//////////////////// FIN MULTER /////////////////////////////////////

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

//recupere les infos du current user, on utilise get one mais avec l'id provenent du current user
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

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
    if (req.body.password || req.body.confirmPassword) {
        return next(
            new AppErr(
                "This route is not for password updte, please use /updateMyPassword",
                400
            )
        );
    }

    //2 filtered out fields names that are not allowed to update
    const filteredBody = filterObj(req.body, "name", "email");
    
    //add photo name in bdd
    if(req.file) filteredBody.photo = req.file.filename;

    //3 Update document
    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: "success",
        data: {
            user: updateUser,
        },
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findOneAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: "success",
        data: null,
    });
});

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
exports.deleteUser = factory.deleteOne(User);

// exports.patchUser = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         message: "route is not defined",
//     });
// };
//do not update password with this!!!
exports.patchUser = factory.updateOne(User);

// exports.getOneUser = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         message: "route is not defined",
//     });
// };
exports.getOneUser = factory.getOne(User);
