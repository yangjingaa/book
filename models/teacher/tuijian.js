var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dbTeacher = require('../teacherConnect');
var Tuijian = new Schema({
    "_id": String,
    "name": String,
    "age": String,
    "email": String,
    "address": String,
    "graduateSchool": String,
    "time": {
        type: Number,
        default: new Date().getTime()
    },
    "tuijian":{type:Schema.Types.ObjectId,ref:"users"},//推荐老师ID
    "liyou":String,
    "state":{type:String,default:"tijiao"},//推荐状态 默认为tijiao  chenggong shibai
});

module.exports = dbTeacher.model("tuijians", Tuijian);