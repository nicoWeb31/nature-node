const express = require("express");
const app = express();
const morgan = require("morgan");



//midelwaire
if(process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}


//parser
app.use(express.json());
//servir les fichire statics
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    console.log("hello from the midelwaire ✋");
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});



app.use('/api/v1/tours',require('./routes/tourRoutes'));
app.use('/api/v1/users',require('./routes/userRoutes'));



module.exports = app