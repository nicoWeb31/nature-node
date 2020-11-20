const Tour = require("./../models/tourModel");
const catchAsync = require("./../utils/catchAsync");
const AppErr = require("./../utils/AppErr");
const factory = require("./handlerFactory");

////////////////////////////-----middlewre-----//////////////////////////
//plus utile id de mongo
exports.checkId = (req, res, next, value) => {
    // console.log(`Tour id is: ${value}`)
    // if (req.params.id * 1 > tours.length) {
    //     return res.status(404).json({
    //         status: "fail",
    //         message: "Invalid id",
    //     });
    // }
    next();
};

exports.checkBody = (req, res, next) => {
    // console.log(req.body)
    // if(!req.body.name || !req.body.price) {
    //     return res.status(400).json({
    //         status: "fail",
    //         data: {
    //             message: "Missing name or price",
    //         },
    //     });
    // }
    next();
};

exports.aliasTopTour = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,diffuculty";
    next();
};

//////////////////////----------------CRUD------------------//////////////////
// exports.createNewTour = catchAsync(async (req, res, next) => {

//     const newTour = await Tour.create(req.body);

//     res.status(201).json({
//         status: "success",
//         data: {
//             tour: newTour,
//         },
//     });
// });
// with factory
exports.createNewTour = factory.createNewDoc(Tour);

// exports.getOneTour = catchAsync(async (req, res, next) => {

//     //with populate firds guides
//     const tour = await await Tour.findById(req.params.id).populate('reviews');
//     //add to query middleware
//     // .populate({
//     //     path: 'guides',
//     //     select: '-__v passwordChangeAt'
//     // });

//     if(!tour){
//         return next(new AppErr('no tour found with that ID ! ',404))
//     }

//     res.status(200).json({
//         status: "success",
//         results: tour.length,
//         data: {
//             tour,
//         },
//     });
//     // try {

//     // } catch (error) {
//     //     res.status(404).json({message : 'error get one'})
//     // }
// });

exports.getOneTour = factory.getOne(Tour, "reviews");

// exports.getAllTours = catchAsync(async (req, res, next) => {
//     console.log(req.query);
//     //EXECTUT QUERY
//     const features = new APIFeature(Tour.find(), req.query)
//         .filter()
//         .sorting()
//         .limitFields()
//         .paginate();
//     const tours = await features.query;

//     //SENT RESPONSE
//     res.status(200).json({
//         status: "success",
//         results: tours.length,
//         data: {
//             tours,
//         },
//     });
// });
// with factory
exports.getAllTours = factory.getAll(Tour);

// exports.patchTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true, //return the new document
//         runValidators: true, //doit utiliser notre shema
//     });

//     if(!tour){
//         return next(new AppErr('no tour found with that ID ! ',404))
//     }

//     res.status(200).json({
//         status: "success",
//         data: {
//             tour,
//         },
//     });
// });
// with factory
exports.patchTour = factory.updateOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id);

//     if(!tour){
//         return next(new AppErr('no tour found with that ID ! ',404))
//     }

//     res.status(204).json({
//         status: "success",
//         data: null,
//     });
// });
// with factory :
exports.deleteTour = factory.deleteOne(Tour);

//agregation
exports.getToursStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                //groupe est un accumulateur
                // _id: null,//champ a accumulé null tous
                _id: { $toUpper: "$difficulty" },
                numTours: { $sum: 1 },
                numRatings: { $sum: "$ratingsQuantity" },
                avrRatting: { $avg: "$ratingAverage" }, //ici je veut la moyenne de tout les tours dans une npuvelle variable avrRatting
                averPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
            },
        },
        {
            $sort: { averPrice: 1 },
        },
        // {
        //     $match: {_id: {$ne: 'EASY'}}//ne not equal
        // }
    ]);

    res.status(200).json({
        status: "success",
        data: {
            stats,
        },
    });
});

exports.getTourWithin = catchAsync(async (req, res, next) => {
    //'/tours-within/:distance/center/:latlng/unit/:unit'
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");

    const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
        return next(
            new AppErr("please provide latitude and logitue in the format", 400)
        );
    }

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    console.log(distance, lat, lng, unit);
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            data: tours,
        },
    });
});

exports.getDistances = catchAsync(async (req, res, next) => {
    //'/distances/:latlng/unit/:unit'
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");

    if (!lat || !lng) {
        return next(
            new AppErr("please provide latitude and logitue in the format", 400)
        );
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [lng * 1, lat * 1],
                },
                distanceField: "distance",
                distanceMultiplier: 0.001,
            },
        },
        {
            $project :{
                distance: 1,
                name: 1
            }
        }
    ]);

    res.status(200).json({
        status: "success",
        data: {
            data: distances,
        },
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: "$startDates", //decompose le tableau de date et revenvoi un ogbjet complet par date
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: "$startDates" },
                numTourStarts: { $sum: 1 },
                tours: { $push: "$name" },
            },
        },
        {
            $addFields: { month: "$_id" },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: { numTourStarts: -1 },
        },
        {
            $limit: 12,
        },
    ]);

    res.status(200).json({
        status: "success",
        data: {
            plan,
        },
    });
});
