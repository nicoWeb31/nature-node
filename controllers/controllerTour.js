// const fs = require("fs");
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//model
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


exports.aliasTopTour =(req, res, next)=>{
    
} 

//////////////////////----------------CRUD------------------//////////////////
exports.createNewTour = async (req, res) => {
    //pour fichier
    //console.log(req.body)
    // const newID = tours[tours.length - 1].id + 1;
    // const newTours = Object.assign({ id: newID }, req.body);

    // tours.push(newTours);

    // fs.writeFile(
    //     `${__dirname}/dev-data/data/tours-simple.json`,
    //     JSON.stringify(tours),
    //     (err) => {
    //         res.status(201).json({
    //             status: "success",
    //             data: {
    //                 tour: newTours,
    //             },
    //         });
    //     }
    // );

    //pour mongodb

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
            message: "Invalid data send",
        });
    }
};

exports.getOneTour = async (req, res) => {
    ///"/api/v1/tours/:a/:b/:c?"point ? optionnal param
    //console.log(req.params);
    // const id = req.params.id * 1; //convert string to number
    // const tour = tours.find((tour) => tour.id === id);

    // // if(id > tours.length){
    // if (!tour) {
    //     return res.status(404).json({ sattus: "fail", message: "Forbiden" });
    // }

    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: "success",
            results: tour.length,
            data: {
                tour,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
};

exports.getAllTours = async (req, res) => {
    // console.log(req.requestTime);
    console.log(req.query);

    try {
        //BUILD QUERY
        //1) Filtering
        //const queryObject = req.query;   //return a refernence
        const queryObject = { ...req.query }; //return a new object
        const excludeFields = ["page", "sort", "limit", "fields"]; //champs a exclure de la query, usable for orther finks

        //on suprime les fields de la query contenent nos mots reservé
        excludeFields.forEach((field) => delete queryObject[field]);

        //1B)Advence filtering with key
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(
            /(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        ); //on rajoute le $ a nos mots clés
        console.log(JSON.parse(queryString));

        //pour pouvoir chainer les differnents methode
        let query = Tour.find(JSON.parse(queryString));
        //if query is empty return all tours; else filter by query //let for chain

        //filter other option
        // const tours = await tours.find()
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy')

        //2)Sorting

        if (req.query.sort) {
            console.log("toto");
            // console.log(query)
            const sortBy = req.query.sort.replace(/,/g, " ");
            // console.log("sortBy", sortBy);
            query = query.sort(sortBy);
            //sort('price' raitingAverage)
        } else {
            query = query.sort("-createdAt");
        }

        //3) field liminting choix des champs retourner par l'api
        if (req.query.fields) {
            const fields = req.query.fields.replace(/,/g, " "); //je les separe par un espace pour pouvoir les passer a mon select
            query = query.select(fields);
        } else {
            query = query.select("-__V"); //le moins est une exclusion ici on exclu V qui est utiliser par mongodb
        }

        //4)paginations
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;

        const skip = (page - 1) * limit;

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) {
                throw new Error("This page does not exist !!");
            }
        }
        //page=2&limit=10   1-10 page1 .11-20....
        query = query.skip(skip).limit(limit);

        //EXECTUT QUERY
        const tours = await query;

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
