var express = require('express');
var router = express.Router();
var tools = require("../public/message/tools");
var codeStatus = require("../public/message/code-status");
var sportUser=require("../models/sport/user");
var Equipment=require("../models/sport/equipment");

/**
 * 登录
 */

router.post('/login', function(req, res) {
    var query=tools.changeQuery(req.body);
    sportUser.find(query,function (err, doc) {
        if(err){
            res.json({
                status:codeStatus.fail,
                data:[],
                message:"错误",
            });
            res.end();
        }else {
            if(doc.length>0){
                res.json({
                    status:codeStatus.suc,
                    data:doc,
                    message:"登录成功"
                })
            }else {
                res.json({
                    status: codeStatus.fail,
                    message: "用户不存在或者密码错误",
                    data: []
                });
                res.end();
            }
        }
    })
});

/**
 * 注册
 */

router.post('/register', function(req, res) {
    var query=tools.changeQuery(req.body);
    sportUser.find(query,function (err, doc) {
        if(err){
            res.json({
                status:codeStatus.fail,
                data:[],
                message:"错误",
            });
            res.end();
        }else {
            if(doc.length>0){
                res.json({
                    status:codeStatus.fail,
                    data:[],
                    message:"用户名存在"
                });
                res.end();
            }else {
                sportUser.create(query,function (err, doc) {
                   if(err){
                       res.json({
                           status:codeStatus.fail,
                           data:[],
                           message:"错误",
                       });
                       res.end();
                   }else {
                       res.json({
                           status:codeStatus.suc,
                           data:[],
                           message:"注册成功",
                       });
                       res.end();
                   }
               })
            }
        }
    })
});

/**
 * 添加器材
 */

router.post("/addEquipment",function (req,res) {
    var query=tools.changeQuery(req.body);
    var name={name:query.name};
    Equipment.find(name,function (err, doc) {
        if(err){
            res.json({
                status:codeStatus.fail,
                data:[],
                message:"错误"
            });
            res.end();
        }else {
            if(doc.length>0){
                res.json({
                    status:codeStatus.fail,
                    data:[],
                    message:"设备已存在"
                });
                res.end();
            }else {
                Equipment.create(query,function (err,doc) {
                    res.json({
                        status:codeStatus.suc,
                        data:[],
                        message:"添加设备成功"
                    });
                    res.end();
                })
            }
        }
    })
});

/**
 * 获取健身器材数据
 */
router.get("/getEquipment",function (req,res) {
    var query=tools.changeQuery(req.query);
    Equipment.find(query,function (err, doc) {
        if(err){
            res.json({
                status:codeStatus.fail,
                data:[],
                message:"错误"
            });
            res.end();
        }else {
           res.json({
               status:codeStatus.suc,
               data:doc,
               message:"获取数据成功"
           })
        }
    })
});


module.exports = router;
