var mongoose = require('mongoose');
var dbTeacher = mongoose.createConnection("mongodb://localhost/teachers");

module.exports = dbTeacher;