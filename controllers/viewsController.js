const Tour = require("./../models/tourModel")
const catchAsync = require('./../utils/catchAsync')


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

exports.getOneTour = catchAsync(async(req, res) => {

    //1 get the data (include the tour guide, and reviews)
    const slug = req.params.slug;
    const tour = await Tour.findOne({slug: slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    })
    // console.log("🚀 ~ file: viewsController.js ~ line 26 ~ tour ~ tour", tour.reviews.user)


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
    res.status(200).render("login");

});