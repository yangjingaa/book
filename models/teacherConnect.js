var mongoose = require('mongoose');
var options = {  
    server: {
      auto_reconnect: true,
      poolSize: 20
    }
  };
var dbTeacher = mongoose.createConnection("mongodb://127.0.0.1/teachers",options);

module.exports = dbTeacher;