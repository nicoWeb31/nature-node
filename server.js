const express = require("express");
const fs = require("fs");
const app = express();
const morgan = require("morgan")

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);





//midelwaire
app.use(morgan('dev'));
//parser
app.use(express.json());
app.use((req, res, next) => {
    console.log('hello from the midelwaire ✋');
    next();
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})




//---------------------------------------------------------
const createNewTour = (req, res) => {
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

const getOneTour = (req, res) => {
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

const getAllTours = (req, res) => {
    console.log(req.requestTime)
    res.status(200).json({
        status: "success",
        results: tours.length,
        requestdAt:req.requestTime,
        data: {
            tours,
        },
    });
};
const patchTour = (req, res) => {
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

const deleteTour = (req, res) => {
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

///----------------------------------------users
const getAllUsuers = (req, res) => {
    res.status(500).json({
        status: "error",
        message:"route is not defined"
    })
}

const createUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message:"route is not defined"
    })
}

const deleteUser= (req, res) => {
    res.status(500).json({
        status: "error",
        message:"route is not defined"
    })
}

const patchUser =(req, res) => {
    res.status(500).json({
        status: "error",
        message:"route is not defined"
    })
}

const getOneUser =(req, res) => {
    res.status(500).json({
        status: "error",
        message:"route is not defined"
    })
}


// app.post("/api/v1/tours", createNewTour);

// app.get("/api/v1/tours/:id", getOneTour);

// app.patch("/api/v1/tours/:id", patchTour);

// app.get("/api/v1/tours", getAllTours);

// app.delete("/api/v1/tours/:id", deleteTour);

app.route("/api/v1/tours")
    .get(getAllTours)
    .post(createNewTour);

app.route("/api/v1/tours/:id")
    .get(getOneTour)
    .delete(deleteTour)
    .patch(patchTour);



app.route('/api/v1/users')
    .get(getAllUsuers)
    .post(createUsers)  

app.route('/api/v1/users/:id')
    .get(getOneUser)
    .patch(patchUser)
    .delete(deleteUser)    

//-------------port--------------------------------
const port = 3003;

//-----------------server---------------------------
app.listen(port, () => {
    console.log(`app run well on port ${port}.... 🙂  `);
});
