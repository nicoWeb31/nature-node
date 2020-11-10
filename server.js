const dotenv = require('dotenv');//gestion variable d'env
dotenv.config({path:'./config.env'})

const app = require('./app');

//variable d'environenemt

//console.log(app.get('env'))
//console.log(process.env)

//-------------port--------------------------------
const port = process.env.PORT || 3003;
//-----------------server---------------------------
app.listen(port, () => {
    console.log(`app run well on port ${port}.... 🙂  `);
});