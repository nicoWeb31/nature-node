const express = require("express");

const app = express();

//-------------route---------------
app.get("/", (req, res) => {
    // res.status(200).send('hello from the server side')
    res.status(200).json({
        message: "hello from the server side",
        app: "Natours",
    });
});

app.post('/', (req, res) => {
res.send("you const to this end point");

})

//-------------port--------------------------------
const port = 3003;

//-----------------server---------------------------
app.listen(port, () => {
    console.log(`app run well on port ${port}.... 🙂  `);
});

