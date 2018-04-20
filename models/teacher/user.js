var mongoose = require("mongoose");
var dbTeacher=require('../teacherConnect');
var Schema = mongoose.Schema;


var User = new Schema({
    "userName": String,
    "pwd": String,
    "isAdmin": {type: Number, default: 2},//0为管理员 1为老师 2为游客
    "name":String,
});

module.exports = dbTeacher.model("users", User);
