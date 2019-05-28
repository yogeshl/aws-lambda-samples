
const mongoose = require('mongoose');
const fs = require('fs');

const certFileBuf = fs.readFileSync("./cert/sample.pem");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://UID:PWD@sample.cluster-temp.us-east-1.docdb.amazonaws.com:27017/database_name";
let cachedDb = null;

const mongoOptions = {
    useNewUrlParser: true,
    ssl: true,
    sslValidate: false,
    sslCA: certFileBuf
};

module.exports.getConnection = function getConnection(){
    
    if(cachedDb){
        console.log("using cached database instance");
        return Promise.resolve(cachedDb);
    }
    
    console.log("Connecting to database");
    return mongoose.connect(MONGODB_URI, mongoOptions)
            .then(db => {
                cachedDb = db;
                return cachedDb;
            })
}

mongoose.connection.on("connected", () =>{
    console.log('Connection to Mongo-DB successful')
});
mongoose.connection.on('error',function (err) {  
    console.log('Mongoose default connection error: ' + err);
}); 

mongoose.connection.on('disconnected', function () {  
    console.log('Mongoose default connection disconnected'); 
});

mongoose.set('useFindAndModify', false);

// SCHEMAS & MODELS
require("./models/sample.server.model");