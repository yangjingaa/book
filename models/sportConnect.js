var mongoose = require('mongoose');
var dbSport = mongoose.createConnection("mongodb://localhost/sport");

module.exports = dbSport;