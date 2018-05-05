var mongoose = require("mongoose");
var Schema=mongoose.Schema;
var dbTeacher=require('../teacherConnect');

var Student=new Schema({
    "name": String,
    "age": String,
    "hobby": String,
    "grade": Number,
    "character": String,
    "introduction": String
});

module.exports=dbTeacher.model("students",Student);