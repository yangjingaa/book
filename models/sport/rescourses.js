var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dbSport=require('../sportConnect');




module.exports = dbSport.model("resCourses", ResCourse);