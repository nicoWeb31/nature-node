const catchAsync = require("./../utils/catchAsync");
const AppErr = require("./../utils/AppErr");
const Review = require("./../models/reviewModels");

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();
    console.log(reviews);

    res.status(200).json({
        status: "success",
        data: {
            reviews,
        },
    });
});

exports.newReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            review: newReview,
        },
    });
});
