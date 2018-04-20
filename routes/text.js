var express = require('express');
var router = express.Router();
var User=require("../models/teacher/user");


/* GET home page. */

router.get('/',function (req, res) {
    var data={
        name:"xiaoli",
        age:50
    };
    console.log(1000000);
    User.create(data,function (err,res) {
        console.log(10);
        if (err) console.error("插入错误");
        res.json({
            status:10
        })
    })
});



module.exports = router;
