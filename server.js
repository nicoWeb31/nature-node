const express = require("express");
const app = express();
const morgan = require("morgan");



//midelwaire
app.use(morgan("dev"));
//parser
app.use(express.json());
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
//-------------port--------------------------------
const port = 3003;

//-----------------server---------------------------
app.listen(port, () => {
    console.log(`app run well on port ${port}.... 🙂  `);
});
