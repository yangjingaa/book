var mongoose = require("mongoose");
var Schema=mongoose.Schema;
var dbTeacher=require('../teacherConnect');

var Teacher=new Schema({
    "_id":{type:Schema.Types.ObjectId,ref:"users"},
   "name":String,
   "age":String,
   "email":String,
   "address":String,
   "graduateSchool":String,
    "time":{type:Number,default:new Date().getTime()},
    "isTeacher":{type:Number,default:0},//是否为老师，默认不是，待审核 ;1是老师
});

module.exports=dbTeacher.model("teachers",Teacher);