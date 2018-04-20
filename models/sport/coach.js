var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dbSport=require('../sportConnect');


var Coach = new Schema({
    "name":String,
    "gender":Number,//1 :初级教练 2:高级教练 3:教练专员
    "address":String,
    "email":String,
    "age":Number,
    "phoneNum":Number,
    "message":String,
});

module.exports = dbSport.model("coachs", Coach);