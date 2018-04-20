var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dbSport=require('../sportConnect');

var sportUser = new Schema({
    "userName":String,
    "name":String,
    "address":String,
    "pwd":Number,
    "email":String,
    "age":Number,
    "phoneNum":Number,
    "idCard":Number,
    "vipCard":{type:Array,default:[]},
});

module.exports = dbSport.model("sportUsers", sportUser);
