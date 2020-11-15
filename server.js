const mongoose =require('mongoose');
const dotenv = require('dotenv');//gestion variable d'env
dotenv.config({path:'./config.env'})

const app = require('./app');

//variable d'environenemt
//console.log(app.get('env'))
//console.log(process.env)

//GLOBALY REJECTION PROMISES
//with event listener
process.on('unhandledRejection',err => {
    console.log(err.name,err.message);
    console.log('unhandledRejection !!! 😢  Shuting down....')
    server.close(()=>{
        process.exit(1);
    });

})


//rejection globaly synchron code
process.on('uncaughtException', err => {
    console.log(err.name,err.message);
    console.log('uncaughtException !!! 😢  Shuting down....')
    server.close(()=>{
        process.exit(1);
    });
})


//mongoose
const db = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then(con=>{
    //console.log(con.connections)
    console.log('connect to mongodb 🙂 ')
})



//-------------port--------------------------------
const port = process.env.PORT || 3003;
//-----------------server---------------------------
const server = app.listen(port, () => {
    console.log(`app run well on port ${port}.... 🙂 `);
});



console.log(x)