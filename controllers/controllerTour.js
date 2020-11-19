const APIFeature = require("./../utils/apiFeatures");
const Tour = require("./../models/tourModel");
const catchAsync = require("./../utils/catchAsync");
const AppErr = require("./../utils/AppErr");


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
exports.createNewTour = catchAsync(async (req, res, next) => {

    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            tour: newTour,
        },
    });
});

exports.getOneTour = catchAsync(async (req, res, next) => {

    //with populate firds guides
    const tour = await await Tour.findById(req.params.id)
    //add to query middleware
    // .populate({
    //     path: 'guides',
    //     select: '-__v passwordChangeAt'
    // });

    if(!tour){
        return next(new AppErr('no tour found with that ID ! ',404))
    }

    res.status(200).json({
        status: "success",
        results: tour.length,
        data: {
            tour,
        },
    });
    // try {
        
        
    // } catch (error) {
    //     res.status(404).json({message : 'error get one'})
    // }
});

exports.getAllTours = catchAsync(async (req, res, next) => {
    console.log(req.query);
    //EXECTUT QUERY
    const features = new APIFeature(Tour.find(), req.query)
        .filter()
        .sorting()
        .limitFields()
        .paginate();
    const tours = await features.query;

    //SENT RESPONSE
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours,
        },
    });
});

exports.patchTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true, //return the new document
        runValidators: true, //doit utiliser notre shema
    });


    if(!tour){
        return next(new AppErr('no tour found with that ID ! ',404))
    }

    res.status(200).json({
        status: "success",
        data: {
            tour,
        },
    });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    
    if(!tour){
        return next(new AppErr('no tour found with that ID ! ',404))
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
});

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
