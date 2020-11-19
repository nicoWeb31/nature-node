const express = require("express");
const app = express();
const morgan = require("morgan");
const AppErr = require("./utils/AppErr");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

// GLOBAL midelwaire
//set security http header
app.use(helmet());

//env morgan info request
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

//limiter le nbre de requet---securité-----
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too  many requests from this IP, please try again !",
});
app.use("/api", limiter);

//parser limit for security
app.use(express.json({ limit: "10kb" }));

//Data sanatization against noSql injection
app.use(mongoSanitize());

//Data saniitization against xss
app.use(xss());

//http-- prevent param polution, si plusieur param prend en compte le dernier
app.use(
    hpp({
        whiteList: [
            "duration",
            "price",
            "ratingAverage",
            "ratingsQuantity",
            "maxGroupSize",
            "difficulty",
        ],
    })
);

//servir les fichire statics
app.use(express.static(`${__dirname}/public`));

//test middleware
app.use((req, res, next) => {
    console.log("hello from the midelwaire ✋");
    next();
});

//test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


//------------------ROUTES---------------------------
app.use("/api/v1/tours", require("./routes/tourRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/reviews", require("./routes/reviewsRoutes"));

//autres route 404
app.all("*", function (req, res, next) {
    // res.status(404).json({
    //     status: 'fail',
    //     message:`Can't find ${req.originalUrl} on this server !`
    // });

    // const err = new Error(`Can't find ${req.originalUrl} on this server !`);
    // err.status = 'fail';
    // err.statusCode = 404;
    // next(err);

    next(new AppErr(`Can't find ${req.originalUrl} on this server !`, 404));
});

//err midlleware
app.use(require("./controllers/errorController"));

module.exports = app;
