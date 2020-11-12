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

    try {

        //BUILD QUERY
        //const queryObject = req.query;   //return a refernence
        const queryObject = {...req.query};   //return a new object
        const excludeFields = ['page', 'sort','limit', 'fields']  //champs a exclure de la query, usable for orther finks

        //on suprime les fields de la query contenent nos mots reservé
        excludeFields.forEach(field => {
            delete queryObject[field]
        })

        //pour pouvoir chainer les differnents methode

        const query = await Tour.find(queryObject);//if query is empty return all tours; else filter by query

        //filter other option
        // const tours = await tours.find()
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy')

        
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
        const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
            new: true, //return the new document
            runValidators: true //doit utiliser notre shema
        })
        res.status(200).json({
            status: "success",
            data: {
                tour
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
        await Tour.findByIdAndDelete(req.params.id)
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
