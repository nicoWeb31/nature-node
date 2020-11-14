const APIFeature = require("./../utils/apiFeatures");
const Tour = require("./../models/tourModel");


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
exports.createNewTour = async (req, res) => {
    try {
        // const newTour = new Tour({})
        // newTour.save()
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err,
        });
    }
};

const catchAsync = fn => (req,res,next) => {
    fn(req,res,next).catch(err=>next(err))
}

exports.getOneTour = catchAsync(async(req, res,next) => {


    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
        status: "success",
        results: tour.length,
        data: {
            tour,
        },
    });

    // try {

    // } catch (error) {
    //     res.status(404).json({
    //         status: "fail",
    //         message: err,
    //     });
    // }
});

exports.getAllTours = async (req, res) => {
    console.log(req.query);

    try {
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
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
};
exports.patchTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true, //return the new document
            runValidators: true, //doit utiliser notre shema
        });
        res.status(200).json({
            status: "success",
            data: {
                tour,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error,
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error,
        });
    }
};


//agregation
exports.getToursStats = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error,
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try {
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
                    _id : 0
                }
            },
            {
                $sort:{ numTourStarts : -1 },
            },
            {
                $limit : 12
            }
        ]);

        res.status(200).json({
            status: "success",
            data: {
                plan,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error,
        });
    }
};
