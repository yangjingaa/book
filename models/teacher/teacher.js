var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dbTeacher = require('../teacherConnect');
var Teacher = new Schema({
    "_id": {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    "grade": {
        type: Number,
        default: 0
    }, //等级 默认0 初级,1 中级,2高级,3顶级 
    "name": String,
    "age": String,
    "email": String,
    "address": String,
    "graduateSchool": String,
    "time": {
        type: Number,
        default: new Date().getTime()
    },
    "state":{type:Number,default:0},//审核状态 0 未审核 1 审核成功 2 审核失败
    "isTeacher": {
        type: Number,
        default: 0
    }, //是否为老师，默认不是，待审核 ;1是老师
});

module.exports = dbTeacher.model("teachers", Teacher);