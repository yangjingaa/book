var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dbTeacher=require('../teacherConnect');

var Warning = new Schema({
    "teacherId": {type: String, ref: "teachers"},
    "adminId": {type: String, ref: "users"},
    "message": String,
    "date": {type: Number, default: new Date().getTime()},
});

module.exports = dbTeacher.model("warnings", Warning);