const catchAsync = require("./../utils/catchAsync");
const AppErr = require("./../utils/AppErr");
const Review = require("./../models/reviewModels");

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find()
    // .populate('user').populate('tour')
    //console.log(reviews);

    res.status(200).json({
        status: "success",
        results: reviews.length,
        data: {
            reviews,
        },
    });
});

exports.createReview = catchAsync(async (req, res, next) => {
    //allowed nested routes
    if(!req.body.tour) req.body.user = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id

    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            review: newReview,
        },
    });
});
