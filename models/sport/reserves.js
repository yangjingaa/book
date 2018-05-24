var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dbSport=require('../sportConnect');

var Reserves = new Schema({
    "userId":String,
    "equId":{type:Schema.Types.ObjectId,ref:"equipments"},
    "name":String,
    "startTime":String,
    "endTime":String,
    "time":{type:String,default:new Date().getTime()}
});

module.exports = dbSport.model("reserves", Reserves);