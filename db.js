const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://cspiles99:EWfywCdAE15piowt@cluster0.dozoww8.mongodb.net/cspiles?retryWrites=true&w=majority&appName=Cluster0';
const mongoDB = async() => {
    mongoose.connect(mongoURI, {useNewUrlParser: true },async (err, result) => {
    if(err) console.log('Some Error -- ', err)
        else { 
             const fetch_data = await mongoose.connection.db.collection("users");
    console.log("connect");
        }
    })
    
}


module.exports = mongoDB;