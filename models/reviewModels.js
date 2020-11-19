// review / rating /creating at /ref to tour/ref to user
const mongoose = require("mongoose");

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

const Review = mongoose.model("Review", reviewsShema);
module.exports = Review;
