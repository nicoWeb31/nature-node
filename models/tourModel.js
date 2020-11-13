const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require('validator');

const tourShema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "the tour must have a name"],
            unique: true,
            trim: true,
            maxLength: [50, 'A tour name must have less or equal 40 characters'],
            minLength: [10, 'A tour name must have more or equal 10 characters'],
            validate:{
                validator:validator.isAlpha,//avec la libreary validator
                message: 'Name must have just a string'
            }

        },
        duration: {
            type: Number,
            required: [, "A tour must have a duration"],
        },
        maxGroupSize: {
            type: Number,
            required: [true, "A tour must have a group size"],
        },
        difficulty: {
            type: String,
            required: [true, "A tour must have a difficulty"],
            enum : {
                values: ['easy','medium','difficult'],
                message: 'difficulty is either: easy, medium or difficult !',
            },
        },    
        ratingAverage: {
            type: Number,
            default: 4.5,
            min: [1,'Rating must be above 1.0'],
            max: [5,'Rating must be below 5.0']
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: true,
        },
        priceDiscount: {
            type: Number,
            validate :{
                validator :function(val){
                    return val>this.price ? false : true;// ou val < this.price
                },
                message:'Discount price ({VALUE}) should be below regular price'
            },
        },    
        summary: {
            type: String,
            trim: true,
            required: [, true, "A tour must have a summary !!!"],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, "A tour must have a cover image"],
        },
        slug: String,
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
        secreteTour: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

//data virtuel non sauvé en bdd
tourShema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
});

//-----------------DOCUMENT middlewre------------ run only befere .save() or .create()
//moogose possede aussi des middlewre, pour exectuter des tache avant ou  apres avoir save en bdd.
tourShema.pre("save", function (next) {
    //console.log(this)
    //creation slug
    this.slug = slugify(this.name, { lower: true });

    next();
});
// tourShema.pre("save", function (next) {
//     console.log('will save document....')
//     next();
// })

// //Apres avoir sauvé en bdd.
// tourShema.post("save", function (doc,next) {
//     console.log(doc)
//     next();
// })

//QUREY MIDELLWARE
// tourShema.pre("find", function (next) {
//     //queryObject
//     this.find({ secreteTour: { $ne: true } });

//     next();
// });
tourShema.pre(/^find/, function (next) {//tous ce qui commence par find
    //queryObject
    this.start = Date.now();
    this.find({ secreteTour: { $ne: true } });

    next();
});

tourShema.post(/^find/,function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds`)
    console.log("tourShema.pre -> docs", docs)
    next();
})

//AGGREGATION MIDDLEWARE
tourShema.pre('aggregate',function(next){
    this.pipeline().unshift({ $match : {secreteTour : {$ne : true}}})
    console.log(this)//fait reference a l'aggregate
    next();
})



const Tour = mongoose.model("Tour", tourShema);
module.exports = Tour;
