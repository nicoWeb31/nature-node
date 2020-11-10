
const fs = require("fs");
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);


exports.createNewTour = (req, res) => {
    //console.log(req.body)

    const newID = tours[tours.length - 1].id + 1;
    const newTours = Object.assign({ id: newID }, req.body);

    tours.push(newTours);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: "success",
                data: {
                    tour: newTours,
                },
            });
        }
    );
};

exports.getOneTour = (req, res) => {
    ///"/api/v1/tours/:a/:b/:c?"point ? optionnal param
    console.log(req.params);
    const id = req.params.id * 1; //convert string to number
    const tour = tours.find((tour) => tour.id === id);

    // if(id > tours.length){
    if (!tour) {
        return res.status(404).json({ sattus: "fail", message: "Forbiden" });
    }

    res.status(200).json({
        status: "success",
        results: tour.length,
        data: {
            tour,
        },
    });
};

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: "success",
        results: tours.length,
        requestdAt: req.requestTime,
        data: {
            tours,
        },
    });
};
exports.patchTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            sattus: "fail",
            message: "Forbiden",
        });
    }

    res.status(200).json({
        status: "success",
        data: {
            tour: "<Updated here...>",
        },
    });
};

exports.deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            sattus: "fail",
            message: "Forbiden",
        });
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
};
