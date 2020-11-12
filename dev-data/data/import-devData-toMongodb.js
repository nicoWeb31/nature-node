const fs = require('fs');
const mongoose =require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'./../../config.env'})
const Tour = require('./../../models/tourModel')

//mongoose
const db = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then(con=>{
    //console.log(con.connections)
    console.log('connect to mongodb 🙂 ')
})

// readJsonFile
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8')); //convert to js object

//import data to Db
const importData = async() =>{
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded!!!');
        
        
    } catch (error) {
        console.log("error", error)
    }
    process.exit()
}


//delete All data from Db
const deleteData = async()=>{
    try {
        await Tour.deleteMany();
        console.log('Data successfully delete!!!');
        
    } catch (error) {
        console.log("error", error)
        
    }
    process.exit()
}

//exection des function 
// deleteData();
// importData(); 

//exection en console
console.log(process.argv)
//node import-devData-toMongodb.js --import
if (process.argv[2] === "--import") {
    return  importData()
}
if (process.argv[2] === "--delete"){
    return deleteData()
}




