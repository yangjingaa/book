var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dbSport=require('../sportConnect');

var Equipment = new Schema({
    "name":String,
    "iName":String,
    "type":String,
    "message":String,
    "calories":String,
    "reserveCount":{type:Number,default:0}//预定数量 以天为单位
});

module.exports = dbSport.model("equipments", Equipment);