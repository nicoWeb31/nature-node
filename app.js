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

//autres route 404
app.all('*',function(req,res,next){
    // res.status(404).json({
    //     status: 'fail',
    //     message:`Can't find ${req.originalUrl} on this server !`
    // });

    const err = new Error(`Can't find ${req.originalUrl} on this server !`);
    err.status = 'fail';
    err.statusCode = 404;
    next(err);

})

//err midlleware
app.use((err, req, res, next) => {
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
})




module.exports = app