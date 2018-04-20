var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dbSport=require('../sportConnect');

var Equipment = new Schema({
    "name":String,
    "iName":String,
    "type":String,
    "message":String,
    "calories":String,
});

module.exports = dbSport.model("equipments", Equipment);