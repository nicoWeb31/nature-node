const AppErr = require("./../utils/AppErr");

const handleCastError = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppErr(message, 400);
};

const handleDuplicateFieldDB = (err) => {
    console.log(err);
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
    const message = `Duplicate field value : ${value} please use another value !`;
    return new AppErr(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input Data. ${errors.join(". ")}`;
    return new AppErr(message, 400);
};

const handleJwtError = () =>
    new AppErr("Invalid token, please try login again", 401);

const handleTokenExpiredError = () =>
    new AppErr("Your token has expired ! Please log in again !", 401);

const sendErrorDev = (err, req, res) => {
    //api
    if (req.originalUrl.startsWith("/api")) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
            name: err.name,
        });
        //view render
    } else {
        //render error
        res.status(err.statusCode).render("error", {
            title: "Something went wrong ! ",
            msg: err.message,
        });
    }
};

const sendErrorProd = (err, req, res) => {
    //for Api
    if (req.originalUrl.startsWith("/api")) {
        //Operational ,trusted error : send massage to client
        if (err.isOperationnal) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        console.error("ERROR 💣 ");

        return res.status(500).json({
            status: "error",
            message: "Something went very wrong !!",
        });
    }

    if (err.isOperationnal) {
        return res.status(err.statusCode).render("error", {
            title: "Something went wrong ! ",
            msg: err.message,
        });
    }

    console.error("ERROR 💣 ");

    return res.status(err.statusCode).render("error", {
        title: "Something went wrong ! ",
        msg: "please Try again later !",
    });
};

//les erreurs de moogose ne sont pas des erreurs operatinal
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    // console.log(process.env.NODE_ENV)

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        error.message = err.message;
        error.name = err.name;
        error.errmsg = err.errmsg;
        console.log(error.name);

        if (error.name === "CastError") {
            error = handleCastError(error);
        }
        if (error.code === 11000) error = handleDuplicateFieldDB(error);

        if (error.name === "ValidationError")
            error = handleValidationErrorDB(error);

        if (error.name === "JsonWebTokenError") error = handleJwtError();

        if (err.name === "TokenExpiredError") error = handleTokenExpiredError();

        console.log(error);

        sendErrorProd(error, req, res);
    }
};
