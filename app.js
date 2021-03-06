const express = require("express");
const app = express();
const morgan = require("morgan");
const AppErr = require("./utils/AppErr");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const cookieParser = require("cookie-parser");

//views engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// GLOBAL midelwaire
//servir les fichire statics
app.use(express.static(path.join(__dirname, "public")));

//set security http header
app.use(helmet());

//env morgan info request
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// app.use(
//     cors({
//         origin: "http://localhost:3003",
//         credentials: true,
//     })
// );
// // Set Security HTTP headers
// // app.use(helmet()) -> This is old helmet declartion.
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", "https:", "http:", "data:", "ws:"],
            baseUri: ["'self'"],
            fontSrc: ["'self'", "https:", "http:", "data:"],
            scriptSrc: ["'self'", "https:", "http:", "blob:"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
        },
    })
);

//limiter le nbre de requet---securité-----
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too  many requests from this IP, please try again !",
});
app.use("/api", limiter);

//parser limit for security
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({extended: true,limit:'10kb'}));//for form
app.use(cookieParser());



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

//test middleware
app.use((req, res, next) => {
    console.log("hello from the midelwaire ✋");
    next();
});

//test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.cookies)
    next();
});

//------------------ROUTE RENDER -------------------------------
app.use("/", require("./routes/viewsRoute"));

//------------------ROUTES Api---------------------------
app.use("/api/v1/tours", require("./routes/tourRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/reviews", require("./routes/reviewsRoutes"));
app.use("/api/v1/bookings", require("./routes/bookingsRoute"));


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
