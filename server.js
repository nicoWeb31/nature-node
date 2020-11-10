const express = require("express");
const fs = require("fs");
const app = express();

//midelwaire
//parser
app.use(express.json());

//-------------route---------------
// app.get("/", (req, res) => {
//     // res.status(200).send('hello from the server side')
//     res.status(200).json({
//         message: "hello from the server side",
//         app: "Natours",
//     });
// });

// app.post('/', (req, res) => {
// res.send("you const to this end point");

// })

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

///--------------------------------------

app.get("/api/v1/tours", (req, res) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours,
        },
    });
});
/////---------------------------------------------
app.post("/api/v1/tours", (req, res) => {
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
});
//---------------------------------------------------------
app.get("/api/v1/tours/:id", (req, res) => {///"/api/v1/tours/:a/:b/:c?"point ? optionnal param
    console.log(req.params);
    const id = req.params.id *1; //convert string to number
    const tour = tours.find(tour => tour.id === id);

    // if(id > tours.length){
        if(!tour){
        return res.status(404).json({sattus:'fail',message:'Forbiden'})
    }
        
    res.status(200).json({
        status: "success",
        results: tour.length,
        data: {
            tour,
        },
    });
});

//-------------port--------------------------------
const port = 3003;

//-----------------server---------------------------
app.listen(port, () => {
    console.log(`app run well on port ${port}.... 🙂  `);
});
