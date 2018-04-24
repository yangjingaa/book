var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dbSport=require('../sportConnect');

var IdCard = new Schema({
    "name":String,
    "discount":Number,//有效期限
    "crateTime":{type:Number,default:new Date().getTime()},
    "message":String,
    "iName":{type:String,default:"qingtian"},
    "price":Number,
});

module.exports = dbSport.model("vipCards", IdCard);