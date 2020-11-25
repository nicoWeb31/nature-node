const Tour = require("./../models/tourModel")
const catchAsync = require('./../utils/catchAsync')
const AppErr = require("./../utils/AppErr");
const User = require("./../models/userModel")


exports.getOverview = catchAsync(async(req, res, next) => {
    //1) get tour from collection
    const tours = await Tour.find();
    
    //2 Build templates
    //3 render the template using data from 1

    res.status(200).render("overview", {
        title: "All tours",
        tours: tours
    });
});

exports.getOneTour = catchAsync(async(req, res,next) => {

    //1 get the data (include the tour guide, and reviews)
    const slug = req.params.slug;
    const tour = await Tour.findOne({slug: slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    })
    // console.log("🚀 ~ file: viewsController.js ~ line 26 ~ tour ~ tour", tour.reviews.user)


    if(!tour){
        return next(new AppErr('There is no tour find with this name ! ', 404))
    }

    res.status(200)
    .set(
        'Content-Security-Policy',
        'connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com')
        .render("tour", {
        title: `${tour.name} Tour`,
        tour
    });
});


exports.getLoginForm = catchAsync(async (req,res,next) => {
    res.status(200).render("login",{
        title: "log into your account "
    });

});

exports.getAccount = async (req,res,next) => {
    res.status(200).render("account",{
        title: 'Your account'
    });
}

//UPDATE SETTING WHIOUT API
// exports.updateUserData = catchAsync(async (req,res,next) => {
//     console.log(req.body)
//     const updateUser = await User.findByIdAndUpdate(req.user.id,{
//         name : req.body.name,
//         email : req.body.email
//     },{
//         new: true,
//         runValidators: true
//     });

//     res.status(200).render("account",{
//         title: 'Your account',
//         user: updateUser
//     });
// })
