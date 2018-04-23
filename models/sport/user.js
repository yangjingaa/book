var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dbSport=require('../sportConnect');

var sportUser = new Schema({
    "userName":String,
    "isAdmin":{type:Number,default:0}, //0代表用户 1 代表管理员
    "name":String,
    "address":String,
    "pwd":Number,
    "email":String,
    "age":Number,
    "phoneNum":Number,
    "idCard":Number,
    "vipCard":{type:Array,default:[]},
    "reserveEqu":[{type:Schema.Types.ObjectId,ref:"equipments"}] //预约的设备
});

module.exports = dbSport.model("sportUsers", sportUser);
