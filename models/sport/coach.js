var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dbSport=require('../sportConnect');


var Coach = new Schema({
    "name":String,
    "gender":Number,//1 :初级教练 2:高级教练 3:教练专员
    "age":Number,
    "phoneNum":Number,
    "IDCard":Number,
    "message":String,
    "evaluate":{type:Array,default:[2]}//评价 为最多是个评价的平均值 0：差1：一般；2：好
});

module.exports = dbSport.model("coachs", Coach);