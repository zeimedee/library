const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Authors = new Schema({
    name:{type:String, required:true},
    authorId:{type:String, required:true},
    rating:{type:Number, required:true},
    books:{
        title:{type:String, required:true}
    }
});

let Books = new Schema({
    title:{type:String, required:true},
    author:{type:String, required:true},
    number_of_pages:{type:Number, required:true},
    category:{type:String, required:true},
    rating:{type:Number, required:true}
});

let Admin = new Schema({
    username:{type:String, required:true},
    password:{type:String, required:true}
}); 

Authors = mongoose.model("Authors", Authors);
Books = mongoose.model("Books", Books);
Admin = mongoose.model("Admin", Admin)

module.exports = {
    Authors:Authors,
    Books:Books,
    Admin:Admin
}