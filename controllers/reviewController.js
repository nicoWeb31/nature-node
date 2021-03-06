const Review = require("./../models/reviewModels");
const factory = require("./handlerFactory");

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//     let filter = {};
//     if (req.params.tourId) filter = { tour: req.params.tourId };

//     const reviews = await Review.find(filter);
//     // .populate('user').populate('tour')
//     //console.log(reviews);

//     res.status(200).json({
//         status: "success",
//         results: reviews.length,
//         data: {
//             reviews,
//         },
//     });
// });
exports.getAllReviews = factory.getAll(Review)

exports.setTourUserIds = (req, res, next) => {
    //allowed nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    next();
};

// exports.createReview = catchAsync(async (req, res, next) => {
//     //allowed nested routes
//     if (!req.body.tour) req.body.tour = req.params.tourId;
//     if (!req.body.user) req.body.user = req.user.id;
//     const newReview = await Review.create(req.body);

//     res.status(201).json({
//         status: "success",
//         data: {
//             review: newReview,
//         },
//     });
// });
//with facto 
exports.createReview = factory.createNewDoc(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
