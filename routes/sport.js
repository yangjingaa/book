var express = require('express');
var router = express.Router();
var tools = require("../public/message/tools");
var codeStatus = require("../public/message/code-status");
var sportUser=require("../models/sport/user");
var Equipment=require("../models/sport/equipment");
var Reserves=require("../models/sport/reserves");

var  managerId="5add6ece1e1136149c2aac7b";

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
    var isAdmin=query.isAdmin;
    if(isAdmin!==1||!isAdmin){
        res.json({
            status:codeStatus.fail,
            data:[],
            message:"无权限操作"
        });
        res.end();
    };
    //删除权限判断key
    delete query.isAdmin;
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
 * 更新器材信息
 */
router.post("/editEquipment",function (req,res) {
    var query=tools.changeQuery(req.body);
    var isAdmin=query.isAdmin;
    if(isAdmin!==1||!isAdmin){
        res.json({
            status:codeStatus.fail,
            data:[],
            message:"无权限操作"
        });
        res.end();
    };
    //删除权限判断key
    delete query.isAdmin;
    Equipment.update({_id:query._id},query,function (err, doc) {
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
                message:"更新数据成功"
            })
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

/**
 * 删除设备
 */
router.post("/deleteEquipment",function (req,res) {
    var query=tools.changeQuery(req.body);

    Equipment.remove(query,function (err, doc) {
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
                data:[],
                message:"删除成功"
            });
            res.end();
        }
    })
});

/**
 * 添加预约设备
 */
router.post("/addReverse",function (req,res) {
    var query=tools.changeQuery(req.body);
    var viaQuery={
        userId:query.userId,
        equId:query.equId,
    };
    var equQuery={
        _id:query.equId,
    };

    Reserves.find(viaQuery,function (err, doc) {
       if(err){
           res.json({
               status:codeStatus.fail,
               data:[],
               message:"错误"
           });
           res.end();
       } else {
           if(doc.length>0){
               res.json({
                   status:codeStatus.fail,
                   data:[],
                   message:"没人每天，只能预约一次"
               });
               res.end();
           }else {
               Equipment.update(equQuery,{$inc:{"reserveCount":1}}).exec(function (err, doc) {
                   if(err){
                       res.json({
                           status:codeStatus.fail,
                           data:[],
                           message:"增加失败"
                       });
                       res.end();
                   }else {
                       Reserves.create(query,function (err, doc) {
                           res.json({
                               status:codeStatus.suc,
                               data:[],
                               message:"预约成功"
                           });
                           res.end();
                       })
                   }
               });
           }
       }
    });
});


module.exports = router;
