const  catchAsync  = require('./../utils/catchAsync')
const AppErr = require("./../utils/AppErr");
const APIFeature = require('./../utils/apiFeatures')

//GENERALIZATION DES METHODE

//DELETE
exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppErr("no document found with that ID ! ", 404));
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
});

//PATCH
exports.updateOne = Model =>catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true, //return the new document
        runValidators: true, //doit utiliser notre shema
    });


    if(!document){
        return next(new AppErr('no document found with that ID ! ',404))
    }

    res.status(200).json({
        status: "success",
        data: {
            document,
        },
    });
});


//CREATE ONE DOCUMENT
exports.createNewDoc = Model => catchAsync(async (req, res, next) => {

    const newDoc = await Model.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            document : newDoc,
        },
    });
});

//GET ONE document

exports.getOne = (Model, popOptions)=>catchAsync(async (req, res, next) => {

    let query = Model.findById(req.params.id);

    if(popOptions) query = query.populate(popOptions);

    const doc = await query;

    if(!doc){
        return next(new AppErr('no document found with that ID ! ',404))
    }

    res.status(200).json({
        status: "success",
        results: doc.length,
        data: {
            data : doc
        },
    });
});

//GET ALL document
exports.getAll = Model =>catchAsync(async (req, res, next) => {

    //to allow for nested get reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    //EXECTUT QUERY
    const features = new APIFeature(Model.find(filter), req.query)
        .filter()
        .sorting()
        .limitFields()
        .paginate();
    //const doc = await features.query.explain();
    const doc = await features.query;


    //SENT RESPONSE
    res.status(200).json({
        status: "success",
        results: doc.length,
        data: {
            data: doc,
        },
    });
});
