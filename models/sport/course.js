var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dbSport=require('../sportConnect');

var Course = new Schema({
    "name":String,
    "adress":String,
    "startTime":Number,//开始时间
    "endTime":Number,//结束时间
    "coach":{type:Schema.Types.ObjectId,ref:"coachs"},
    "userId":[{type:Schema.Types.ObjectId,ref:"coachs",default:[]}],//课程预约规则不许大于15人
    "message":String,
    "maxNum":{type:Number,default:15}//最大预约人数，默认15人
});

module.exports = dbSport.model("courses", Course);
