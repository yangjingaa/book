var express = require('express');
var router = express.Router();
var User = require("../models/teacher/user");
var tools = require("../public/message/tools");
var codeStatus = require("../public/message/code-status");
var teachers = require("../models/teacher/teacher");
var Course = require("../models/teacher/course");
var Student = require("../models/teacher/student");
var Warning = require("../models/teacher/warning");

var adminId = "5ad5fca38035fe33e861b3b9";//管理员id
/**
 * 登录
 */
router.post('/login', function (req, res) {
    var query = {
        userName: req.body.userName,
        pwd: req.body.pwd,
        isAdmin:{$ne:100}
    };
    User.find(query, function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                message: "错误"
            });
            res.end()
        } else {
            if (doc.length > 0 ) {
                res.json({
                    status: codeStatus.suc,
                    data: doc,
                    message: "成功"
                });
                res.end();
            } else {
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
router.post('/register', function (req, res) {

    var query = {
        userName: req.body.userName,
    };
    User.find(query, function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                message: "错误"
            });
            res.end()
        }
        if (doc.length === 0) {
            var user = new User({
                userName: req.body.userName,
                pwd: req.body.pwd,
                name: req.body.name,
            });
            user.save(function (err, doc) {
                res.json({
                    status: codeStatus.suc,
                    message: "成功",
                    data: []
                });
                res.end()
            })
        } else {
            res.json({
                status: codeStatus.fail,
                message: "用户名存在"
            });
            res.end()
        }
    });


});
/**
 * 获得老师列表
 */
router.get('/teacher', function (req, res) {
    var query = tools.changeQuery(req.body);
    teachers.find(query).populate({path:'_id',select:"isAdmin",match:{"isAdmin":{$ne:100}}}).exec(function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                message: "错误"
            })
        } else {
            var data=[];
            doc.forEach(function (value) {
               if(value._id){
                   data.push(value);
               }
            });
                res.json({
                    status: codeStatus.suc,
                    message: "成功",
                    data: data
                });
                res.end()
        }
    })

});
/**
 * 添加老师
 */
router.post('/addTeacher', function (req, res) {
    var query = tools.changeQuery(req.body);
    var id = query._id;
    if (id === adminId) {
        query.isTeacher = 1
    }

    teachers.find({_id: id}, function (err, doc) {
        if (doc.length > 0) {
            res.json({
                status: codeStatus.fail,
                message: "用户已存在",
                data: []
            });
            res.end()
        } else {
            teachers.create(query, function (err, doc) {
                if (err) {
                    res.json({
                        status: codeStatus.fail,
                        message: "错误"
                    })
                } else {
                    res.json({
                        status: codeStatus.suc,
                        message: "成功",
                        data: doc
                    })
                }
                res.end()
            })
        }
    });


});
/**
 * 获取老师列表
 */
router.get('/appTeacher', function (req, res) {
    var query = tools.changeQuery(req.body);

    query.isTeacher = 0;
    teachers.find(query, function (err, doc) {
        res.json({
            status: codeStatus.suc,
            message: "成功",
            data: doc,
        })
    })
});
/**
 *审批老师
 */
router.post('/confirmTeacher', function (req, res) {
    var query = tools.changeQuery(req.body);
    teachers.update(query, {"isTeacher": 1}, {multi: true}, function (err, doc) {
        res.json({
            status: codeStatus.suc,
            message: "成功",
            data: doc,
        })
    })
});
/**
 * 获取课程列表
 */
router.get('/course', function (req, res) {
    var query = tools.changeQuery(req.query);
    var sort = "-date";
    // 包含id查询
    if (query.teacherId) {
        var id = query.teacherId;
        query.teacherId = {$in: id}
    }
    // populate({path:'teacherId studentsId',select:"name _id"})
    Course.find(query).populate("teacherId studentsId").limit(5).sort(sort).exec(function (err, doc) {
        console.log(err);
        res.json({
            status: codeStatus.suc,
            data: doc
        })
    })
});
/**
 * 添加课程
 */
router.post('/addCourse', function (req, res) {
    var query = tools.changeQuery(req.body);
    Course.create(query, function (err, doc) {
        res.json({
            status: codeStatus.suc,
            data: doc,
            massage: "成功"
        });
        res.end();
    })
});

/**
 * 获取学生列表
 */
router.get('/student', function (req, res) {
    var query = {};
    var sort = "date";
    Student.find(query).exec(function (err, doc) {
        res.json({
            status: codeStatus.suc,
            data: doc,
            massage: "成功"
        })
    })
});

/**
 * 获得特定管理员 给老师的警告信息
 */
router.get("/warning", function (req, res) {
    var query = tools.changeQuery(req.query);
    var sort = "-date";
    // 包含id查询
    Warning.find(query).limit(5).sort(sort).exec(function (err, doc) {
        res.json({
            status: codeStatus.suc,
            data: doc,
            massage: "成功"
        });
        res.end();
    })
});
/**
 * 添加warning
 * 参数 teacherId  adminId message 必填
 * 非必填 date
 */
router.post("/warning", function (req, res) {
    var query = tools.changeQuery(req.body);
    var state=tools.verificationAdmin(query.adminId);
    if(!state){
        res.json({
            status: codeStatus.fail,
            data:[],
            message: "无权限",
        });
        res.end()
    }
    // 包含id查询
    Warning.create(query, function (err, doc) {
        res.json({
            status: codeStatus.suc,
            data: doc,
            message: "成功",
        });
        res.end();
    })
});

/**
 * 辞退老师。需要管理员进行验证
 */
router.post("/dismissTeacher", function (req, res) {
    var query = tools.changeQuery(req.body);
    var adId = query.adminId.toString();
    var teacher = {_id: query.teacherId};
    if (adId == adminId) {
        User.update(teacher,{$set: {isAdmin: 100}}, function (err, doc) {
            if (err) {
                res.json({
                    status: codeStatus.fail,
                    data:[],
                    message: "删除数据失败"
                });
                res.end();
            } else {
                    res.json({
                        status: codeStatus.fail,
                        data: [],
                        message: "辞退成功"
                    });
                    res.end()
            }
        })
    } else {
        res.json({
            status: codeStatus.fail,
            data:[],
            message: "无权限"
        });
        res.end();
    }

});

/**
 * 获取用户列表
 */

router.get("/userList",function (req, res) {

    var query=tools.changeQuery(req.query)||{};
    var sort="isAdmin";
    User.find(query).sort(sort).exec(function (err, doc) {
        res.json({
            status:codeStatus.suc,
            message:"获取用户成功",
            data:doc
        })
    })

});

/**
 * 删除用户
 */

router.post("/deleteUser",function (req, res) {

    var query=tools.changeQuery(req.body);
    User.remove(query).exec(function (err, doc) {
        res.json({
            status:codeStatus.suc,
            message:"删除用户成功",
            data:doc
        })
    })

});

module.exports = router;
