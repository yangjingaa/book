var mongoose = require('mongoose');
var options = {  
    server: {
      auto_reconnect: true,
      poolSize: 20
    }
  };
var dbTeacher = mongoose.createConnection("mongodb://localhost/teachers",options);

module.exports = dbTeacher;