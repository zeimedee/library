const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/library'


const connectDB = async () =>{
    await mongoose.connect(url,{
        useNewUrlParser:true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    console.log('db connection established');
}


module.exports = connectDB;