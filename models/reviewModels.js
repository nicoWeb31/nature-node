// review / rating /creating at /ref to tour/ref to user
const mongoose = require("mongoose");
const Tour = require("./../models/tourModel");

reviewsShema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, "Review can not be empty !"],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        creatingAt: {
            type: Date,
            default: Date.now,
        },
        //ref User
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Review must belong to a user"],
        },
        //ref Tour
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: "Tour",
            required: [true, "Review must belong to a tour."],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

reviewsShema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'user',
    //     select: 'name photo'
    // }).populate({
    //     path: 'tour',
    //     select: 'name'
    // })

    this.populate({
        path: "user",
        select: "name photo",
    });

    next();
});

reviewsShema.index({tour: 1, user: 1}, {unique: true})

reviewsShema.statics.calcuAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: "$tour",
                nRating: { $sum: 1 },
                avgRating: { $avg: "$rating" },
            },
        },
    ]);
    // console.log(stats);
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingAverage: stats[0].avgRating,
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingAverage: 0,
        });
    }
};
reviewsShema.post("save", function () {
    //this.points to current review
    this.constructor.calcuAverageRatings(this.tour);
});

//findByIdAndUpdate
//findByIdAndDelete

reviewsShema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    console.log("reviewsShema.pre -> r", this.r);

    next();
});

reviewsShema.post(/^findOneAnd/, async function () {
    //this.r = await this.findOne(); does not exist here the query has already exectuted
    await this.r.constructor.calcuAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", reviewsShema);
module.exports = Review;
