var tools = require("../public/message/tools");
var codeStatus = require("../public/message/code-status");
var teachers = require("../models/teacher/teacher");
var Course = require("../models/teacher/course");
var Student = require("../models/teacher/student");
var Warning = require("../models/teacher/warning");
var Tuijian = require("../models/teacher/tuijian");


var adminId = "5ad5fca38035fe33e861b3b9"; //管理员id5ad5fca38035fe33e861b3b9
var express = require('express');
var router = express.Router();
var User = require("../models/teacher/user");
/**
 * 登录
 */
router.post('/login', function (req, res) {
    var query = {
        userName: req.body.userName,
        pwd: req.body.pwd,
        isAdmin: {
            $ne: 100
        }
    };
    User.find(query, function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                message: "错误"
            });
        } else {
            if (doc.length > 0) {
                res.json({
                    status: codeStatus.suc,
                    data: doc,
                    message: "成功"
                });

            } else {
                res.json({
                    status: codeStatus.fail,
                    message: "用户不存在或者密码错误",
                    data: []
                });

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
            tools.returnResultFaile(res, "错误")
        }
        if (doc.length === 0) {
            var user = new User({
                userName: req.body.userName,
                pwd: req.body.pwd,
                name: req.body.name,
            });
            user.save(function (err, doc) {
                tools.returnResultSuccess(res, doc, "成功")
            })
        } else {
            tools.returnResultFaile(res, "用户名存在")
        }
    });


});
/**
 * 获得老师列表
 */
router.get('/teacher', function (req, res) {
    var query = tools.changeQuery(req.query);
    query.isTeacher = 1;
    if (query.name) {
        query.name = RegExp(query.name)
    }
    teachers.find(query).populate({
        path: '_id',
        select: "isAdmin",
        match: {
            "isAdmin": {
                $ne: 100
            }
        }
    }).exec(function (err, doc) {
        if (err) {
            tools.returnResultFaile(res, "错误")
        } else {
            var data = [];
            doc.forEach(function (value) {
                if (value._id) {
                    data.push(value);
                }
            });
            tools.returnResultSuccess(res, data, "成功")
        }
    })

});
/**
 * 添加老师
 */
router.post('/addTeacher', function (req, res) {
    var query = tools.changeQuery(req.body);
    var id = query._id;
    teachers.update({
        _id: id
    }, query, function (err, doc) {
        if (doc.n == 1) {
            tools.returnResultSuccess(res, doc, "更新成功")
        } else {
            teachers.create(query, function (err, doc) {
                tools.returnResultSuccess(res, doc, "提交成功")
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
    var sort="-time";
    var pageSize = 5,
        pageNumer = 1,
        skip = 0;
    if (query.pageSize) {
        pageSize = query.pageSize;
        delete query.pageSize;
    }
    if (query.pageNumer) {
        pageNumer = query.pageNumer;
        skip = (pageNumer - 1) * pageSize;
        delete query.pageNumer;
    }
    console.log(query)
    teachers.find(query).skip(skip).limit(pageSize).sort(sort).exec(function(err, doc) {
        tools.returnResultSuccess(res, doc, "成功",doc.length)
    })
});
/**
 *审批老师
 */
router.post('/confirmTeacher', function (req, res) {
    var query = tools.changeQuery(req.body);
    teachers.update(query, {
        "isTeacher": 1
    }, {
        multi: true
    }, function (err, doc) {
        User.update(query, {
            "isAdmin": 1
        }, function (err, doc) {
            tools.returnResultSuccess(res, doc, "成功")
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
        query.teacherId = {
            $in: id
        }
    }
    Course.find(query).populate({
        path: 'teacherId studentsId'
    }).limit(5).sort(sort).exec(function (err, doc) {
        tools.returnResultSuccess(res, doc, "成功");
    })

});
/**
 * 添加课程
 */
router.post('/addCourse', function (req, res) {
    var query = tools.changeQuery(req.body);
    var studentQuery = {
        grade: query["grade"]
    };
    if (query.admin) {
        Course.create(query, function (err, doc) {
            tools.returnResultSuccess(res, doc, "成功")
        })
    }
    Student.find(studentQuery).exec(function (err, doc) {
        var studentData = doc;
        var studentId = [];
        if (studentData.length > 0) {
            studentData.forEach(function (value, index) {
                if (index >= 2) return false;
                studentId.push(value._id);
            })
        }
        query.studentsId = studentId;
        var dateStr = tools.chackTime(query.date);
        var dataScree = {
            teacherId: query.teacherId,
            date: {
                $gte: dateStr.startNum,
                $lt: dateStr.endNum
            }
        }
        Course.count(dataScree).exec(function (err, count) {
            if (count >= 1) {
                tools.returnResultFaile(res, "每人每天只能开课一次");
            } else {
                Course.create(query, function (err, doc) {
                    tools.returnResultSuccess(res, doc, "成功")
                })
            }
        })

    })

});

/**
 * 筛选可成 screenTable
 */

router.post('/screenTable', function (req, res) {
    var query = tools.changeQuery(req.body);
    var sort = "-date";
    var pageSize = 5,
        pageNumer = 1,
        skip = 0;
    if (query.studentsId) {
        query.studentsId = {
            $in: query.studentsId
        }
    }
    if (query.date) {
        var startTime = query.date[0];
        var endTime = query.date[1];
        query.date = {
            $gte: startTime,
            $lte: endTime
        }
    }
    if (query.pageSize) {
        pageSize = query.pageSize
        delete query.pageSize;
    }
    if (query.pageNumer) {
        pageNumer = query.pageNumer
        skip = (pageNumer - 1) * pageSize
        delete query.pageNumer;
    }
    if (query.evaluate) {
        query.evaluate = {$lte: query.evaluate,$gt:query.evaluate-5}
    }
    Course.count(query).exec(function (err, value) {
        Course.find(query).skip(skip).populate({
            path: 'teacherId studentsId'
        }).limit(pageSize).sort(sort).exec(function (err, doc) {
            tools.returnResultSuccess(res, doc, "筛选成功", value)
        })
    })

});

/**
 * 获取学生列表
 */
router.get('/student', function (req, res) {
    var query = tools.changeQuery(req.query);
    var sort = "date";
    if (query.name) {
        query.name = RegExp(query.name)
    }
    Student.find(query).exec(function (err, doc) {
        tools.returnResultSuccess(res, doc, "成功")
    })
});

/**
 * 获取老师信息
 */
router.get('/getTeacherInfo', function (req, res) {
    var query = tools.changeQuery(req.query);
    teachers.find(query).exec(function (err, doc) {
        tools.returnResultSuccess(res, doc, "获得老师信息成功")
    })
});

/**
 * 获得特定管理员 给老师的警告信息
 */
router.get("/warning", function (req, res) {
    var query = tools.changeQuery(req.query);
    var sort = "-date";
    // 包含id查询
    Warning.find(query).populate({
        path: "adminId",
        select: "name"
    }).sort(sort).exec(function (err, doc) {
        tools.returnResultSuccess(res, doc, "成功")
    })
});
/**
 * 添加warning
 * 参数 teacherId  adminId message 必填
 * 非必填 date
 */
router.post("/warning", function (req, res) {
    var query = tools.changeQuery(req.body);
    var state = tools.verificationAdmin(query.adminId);
    if (!state) {
        tools.returnResultFaile(res, "无权限")
    }
    // 包含id查询
    Warning.create(query, function (err, doc) {
        tools.returnResultSuccess(res, doc, "成功");
    })
});

/**
 * 辞退老师。需要管理员进行验证
 */
router.post("/dismissTeacher", function (req, res) {
    var query = tools.changeQuery(req.body);
    var adId = query.adminId.toString();
    var teacher = {
        _id: query.teacherId
    };
    if (adId == adminId) {
        User.update(teacher, {
            $set: {
                isAdmin: 100
            }
        }, function (err, doc) {
            if (err) {
                tools.returnResultFaile(res, "失败")
            } else {
                tools.returnResultSuccess(res, doc, "辞退成功")
            }
        })
    } else {
        tools.returnResultFaile(res, "无权限")
    }

});

/**
 * 授权老师
 */

router.post("/recoveryteUser", function (req, res) {
    var query = tools.changeQuery(req.body);
    User.update(query, {
        isAdmin: 2
    }).exec(function (err, doc) {
        tools.returnResultSuccess(res, doc, "用户授权成功")
    })

});

/**
 * 获取用户列表
 */

router.get("/userList", function (req, res) {

    var query = tools.changeQuery(req.query) || {};
    var sort = "isAdmin";
    User.find(query).sort(sort).exec(function (err, doc) {
        tools.returnResultSuccess(res, doc, "获取用户成功");
    })

});

/**
 * 删除用户
 */

router.post("/deleteUser", function (req, res) {

    var query = tools.changeQuery(req.body);
    User.remove(query).exec(function (err, doc) {
        tools.returnResultSuccess(res, doc, "删除用户成功");
    })

});

/**
 * 提升老师授课等级 upLectureGrad
 */

router.post("/upLectureGrad", function (req, res) {

    var query = tools.changeQuery(req.body);
    var findQuery = {
        _id: query._id
    };
    var updateQuery = {
        grade: query.grade,
    };
    teachers.update(findQuery, updateQuery).exec(function (err, doc) {
        if (doc.nModified === 0) {
            tools.returnResultFaile(res, "等级一致，修改失败");
        }
        teachers.find(findQuery).exec(function (err, doc) {
            tools.returnResultSuccess(res, doc, "修改成功");
        })
    })
});

/**
 * 获得老师列表
 */
router.post("/getTeacherList", function (req, res) {
    var query = tools.changeQuery(req.body);
    if (query.name) {
        query.name = new RegExp(query.name)
    }
    teachers.find(query).exec(function (err, doc) {
        if (err) {
            tools.returnResultFaile(res, "获取老师列表失败");
        } else {
            tools.returnResultSuccess(res, doc, "获取老师列表成功")
        }
    })

});

/**
 * 获得学生列表
 */
router.post("/getStudentList", function (req, res) {
    var query = tools.changeQuery(req.body);
    if (query.name) {
        query.name = new RegExp(query.name)
    }
    Student.find(query).exec(function (err, doc) {
        if (err) {
            tools.returnResultFaile(res, "获取学生列表失败");
        } else {
            tools.returnResultSuccess(res, doc, "获取学生列表成功")
        }
    })

});

/**
 * 推荐老师
 */
router.post("/tuijianTeacher", function (req, res) {
    var query = tools.changeQuery(req.body);
    if (query.userName) {
        User.find({
            userName: query.userName,
            isAdmin: 2,
        }).exec(function (err, doc) {
            if (err) {
                tools.returnResultFaile(res, "推荐失败,系统错误 ");
            } else {
                if (doc.length > 0) {
                    console.log(doc)
                    query._id = doc[0]._id;
                    query.name = doc[0].name;

                    Tuijian.create(query, function (err, doc) {
                        tools.returnResultSuccess(res, doc, "推荐提交成功")
                    })
                } else {
                    tools.returnResultFaile(res, "推荐失败，推荐用户不存在");
                }
            }
        })
    }
});

//getTuiJianTeacher 获得推荐的老师 默认获得推荐提交的老师

router.post("/getTuiJianTeacher", function (req, res) {
    var query = tools.changeQuery(req.body);
    var sort = "-time";
    var pageSize = 5,
        pageNumer = 1,
        skip = 0;
    if (query.pageSize) {
        pageSize = query.pageSize;
        delete query.pageSize;
    }
    if (query.pageNumer) {
        pageNumer = query.pageNumer;
        skip = (pageNumer - 1) * pageSize;
        delete query.pageNumer;
    }

    Tuijian.find(query).skip(skip).populate({
        path: "tuijian",
        select: "name",
    }).limit(pageSize).sort(sort).exec(function (err, doc) {
        if (err) {
            tools.returnResultFaile(res, "获取推荐老师失败");
        } else {
            var length=doc.length;
            tools.returnResultSuccess(res, doc, "获取推荐成功",length)
        }
    })

});
//createTuijianTeacher 审核推荐老师 根据传值 更新数据
router.post("/createTuijianTeacher", function (req, res) {
    var query = tools.changeQuery(req.body);
    var updataData = {};
    var state = query.state;
    var findQuery = {
        _id: query._id
    }
    if (query.state) {
        updataData.state = state
    }
    Tuijian.update(findQuery, updataData).exec(function (err, doc) {
        if (err) {
            tools.returnResultFaile(res, "审核失败");
        } else {
            Tuijian.find(findQuery, function (err, doc) {
                if (state === "shibai") {
                    tools.returnResultSuccess(res, doc,"操作成功")
                } else {
                    var resultData = doc[0];
                    var data = {
                        _id: resultData._id,
                        name: resultData.name,
                        age: resultData.age,
                        email: resultData.email,
                        graduateSchool: resultData.graduateSchool,
                        address: resultData.address,
                        isTeacher: 1
                    }
                    teachers.create(data, function (err, doc) {
                        tools.returnResultSuccess(res, doc, "审核成功")
                    })
                }

            })
        }
    })

});


module.exports = router;