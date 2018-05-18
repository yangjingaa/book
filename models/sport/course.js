var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dbSport=require('../sportConnect');

var course = new Schema({
    "name":String,
    "email":String,
    "age":Number,
    "grade":Number,
    "evaluate":{type:Array,default:[]}
});

module.exports = dbSport.model("courses", course);
