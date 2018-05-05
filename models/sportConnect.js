var mongoose = require('mongoose');
var options = {  
    server: {
      auto_reconnect: true,
      poolSize: 20
    }
  }
var dbSport = mongoose.createConnection("mongodb://localhost/sport",options);

module.exports = dbSport;