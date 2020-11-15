const AppErr = require('./../utils/AppErr');

const handleCastError = err => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppErr(message,400);
}

const handleDuplicateFieldDB = err =>{
    console.log(err)
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
    const message = `Duplicate field value : ${value} please use another value !`
    return new AppErr(message,400);
}

const handleValidationErrorDB = err =>{
    const errors = Object.values(err.errors).map(el=>el.message);
    const message = `Invalid input Data. ${errors.join('. ')}`;
    return new AppErr(message,400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
        name: err.name
    });
};

const sendErrorProd = (err, res) => {
    //Operational ,trusted error : send massage to client
    if(err.isOperationnal){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    
        //pregramming or other errors : don't leak deatail
    }else{
        //1) log error
        console.error('ERROR 💣 ')

        //2)send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong !!',
        })
    }

};

//les erreurs de moogose ne sont pas des erreurs operatinal
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    // console.log(process.env.NODE_ENV)

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);


    } else if (process.env.NODE_ENV === "production") {

        let error = {...err};
        error.name = err.name;
        error.errmsg = err.errmsg;
        console.log(error.name)

        if(error.name === 'CastError') {
            error = handleCastError(error);
        }
        if(error.code === 11000) error = handleDuplicateFieldDB(error);
        
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error)
        
        console.log(error);

        sendErrorProd(error, res);
    }
};
