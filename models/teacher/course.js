var mongoose = require("mongoose");
var Schema=mongoose.Schema;
var dbTeacher=require('../teacherConnect');

var Course=new Schema({
    "date":{type:Number,default:new Date().getTime()},
    "teacherId":{type:Schema.Types.ObjectId,ref:"teachers"},
    "studentsId":[{type:Schema.Types.ObjectId,ref:"students"}],//学生列表
    "grade":{type:Number,default:0},
    "timeLong":{type:Number,default:30},//时长30分钟
    "evaluate":{type:Number,default:15},//评价 5 差 10 良好 15 差

});

module.exports=dbTeacher.model("courses",Course);
