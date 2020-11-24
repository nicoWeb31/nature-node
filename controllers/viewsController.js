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


    res.status(200).render("tour", {
        title: tour.name,
        tour
    });
});
