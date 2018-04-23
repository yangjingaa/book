var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dbSport=require('../sportConnect');

var Reserves = new Schema({
    "userId":String,
    "equId":String,
    "name":String,
    "startTime":String,
    "endTime":String,
    "time":{type:Date,default:new Date().getTime()}
});

module.exports = dbSport.model("reserves", Reserves);