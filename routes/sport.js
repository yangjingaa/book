var express = require('express');
var router = express.Router();
var tools = require("../public/message/tools");
var codeStatus = require("../public/message/code-status");
var sportUser = require("../models/sport/user");
var Equipment = require("../models/sport/equipment");
var Reserves = require("../models/sport/reserves");
var IdCard = require("../models/sport/vipCard");
var Coach = require("../models/sport/coach");
var Course = require("../models/sport/course");


var managerId = "5add6ece1e1136149c2aac7b";

/**
 * 登录
 */

router.post('/login', function (req, res) {
    var query = tools.changeQuery(req.body);
    sportUser.find(query, function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                data: [],
                message: "错误",
            });
            res.end();
        } else {
            if (doc.length > 0) {
                res.json({
                    status: codeStatus.suc,
                    data: doc,
                    message: "登录成功"
                })
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
    var query = tools.changeQuery(req.body);
    sportUser.find(query, function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                data: [],
                message: "错误",
            });
            res.end();
        } else {
            if (doc.length > 0) {
                res.json({
                    status: codeStatus.fail,
                    data: [],
                    message: "用户名存在"
                });
                res.end();
            } else {
                sportUser.create(query, function (err, doc) {
                    if (err) {
                        res.json({
                            status: codeStatus.fail,
                            data: [],
                            message: "错误",
                        });
                        res.end();
                    } else {
                        res.json({
                            status: codeStatus.suc,
                            data: [],
                            message: "注册成功",
                        });
                        res.end();
                    }
                })
            }
        }
    })
});

/**
 * 获得用户信息 getUserInfo
 */
router.post('/getUserInfo', function (req, res) {
    var query = tools.changeQuery(req.body);
    sportUser.find(query, function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                data: [],
                message: "错误",
            });
            res.end();
        } else {
            res.json({
                status: codeStatus.suc,
                data: doc,
                message: "获得用户信息成功",
            });
            res.end();
        }
    })
});

/**
 * 添加器材
 */

router.post("/addEquipment", function (req, res) {
    var query = tools.changeQuery(req.body);
    var isAdmin = query.isAdmin;
    if (isAdmin !== 1 || !isAdmin) {
        res.json({
            status: codeStatus.fail,
            data: [],
            message: "无权限操作"
        });
        res.end();
    };
    //删除权限判断key
    delete query.isAdmin;
    var name = {
        name: query.name
    };
    Equipment.find(name, function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                data: [],
                message: "错误"
            });
            res.end();
        } else {
            if (doc.length > 0) {
                res.json({
                    status: codeStatus.fail,
                    data: [],
                    message: "设备已存在"
                });
                res.end();
            } else {
                Equipment.create(query, function (err, doc) {
                    res.json({
                        status: codeStatus.suc,
                        data: [],
                        message: "添加设备成功"
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
router.post("/editEquipment", function (req, res) {
    var query = tools.changeQuery(req.body);
    var isAdmin = query.isAdmin;
    if (isAdmin !== 1 || !isAdmin) {
        res.json({
            status: codeStatus.fail,
            data: [],
            message: "无权限操作"
        });
        res.end();
    };
    //删除权限判断key
    delete query.isAdmin;
    Equipment.update({
        _id: query._id
    }, query, function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                data: [],
                message: "错误"
            });
            res.end();
        } else {
            res.json({
                status: codeStatus.suc,
                data: doc,
                message: "更新数据成功"
            })
        }
    })
});

/**
 * 获取健身器材数据
 */
router.get("/getEquipment", function (req, res) {
    var query = tools.changeQuery(req.query);
    Equipment.find(query, function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                data: [],
                message: "错误"
            });
            res.end();
        } else {
            res.json({
                status: codeStatus.suc,
                data: doc,
                message: "获取数据成功"
            })
        }
    })
});

/**
 * 删除设备
 */
router.post("/deleteEquipment", function (req, res) {
    var query = tools.changeQuery(req.body);

    Equipment.remove(query, function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                data: [],
                message: "错误"
            });
            res.end();
        } else {
            res.json({
                status: codeStatus.suc,
                data: [],
                message: "删除成功"
            });
            res.end();
        }
    })
});

/**
 * 添加预约设备
 */
router.post("/addReverse", function (req, res) {
    var query = tools.changeQuery(req.body);
    var viaQuery = {
        userId: query.userId,
        equId: query.equId,
    };
    var equQuery = {
        _id: query.equId,
    };

    Reserves.find(viaQuery, function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                data: [],
                message: "错误"
            });
            res.end();
        } else {
            if (doc.length > 0) {
                res.json({
                    status: codeStatus.fail,
                    data: [],
                    message: "没人每天，只能预约一次"
                });
                res.end();
            } else {
                Equipment.update(equQuery, {
                    $inc: {
                        "reserveCount": 1
                    }
                }).exec(function (err, doc) {
                    if (err) {
                        res.json({
                            status: codeStatus.fail,
                            data: [],
                            message: "增加失败"
                        });
                        res.end();
                    } else {
                        Reserves.create(query, function (err, doc) {
                            res.json({
                                status: codeStatus.suc,
                                data: [],
                                message: "预约成功"
                            });
                            res.end();
                        })
                    }
                });
            }
        }
    });
});


/**
 * 获取预约设备
 */
// teachers.find(query).populate({path:'_id',select:"isAdmin",match:{"isAdmin":{$ne:100}}}).exec(function (err, doc) {

router.get("/reservationEquipment", function (req, res) {
    var query = tools.changeQuery(req.query);
    Reserves.find(query).populate({
        path: 'equId',
        select: ""
    }).exec(function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                data: [],
                message: "错误"
            });
            res.end();
        } else {
            res.json({
                status: codeStatus.suc,
                data: doc,
                message: "获取成功数据成功"
            })
        }
    })
});

/**
 * 获得设备预约时间
 */
router.get("/getResTime", function (req, res) {
    var query = tools.changeQuery(req.query);
    var sort = "startTime";
    Reserves.find(query).sort(sort).exec(function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                data: [],
                message: "错误"
            });
        } else {
            res.json({
                status: codeStatus.suc,
                data: doc,
                message: ""
            });
            res.end()
        }
    })

});

/**
 * 取消預約
 */
router.post("/cancelRes", function (req, res) {
    var query = tools.changeQuery(req.body);
    var equQuery = {
        _id: query.equId
    };
    Reserves.remove(query, function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                data: [],
                message: "错误"
            });
            res.end();
        } else {
            Equipment.update(equQuery, {
                $inc: {
                    "reserveCount": -1
                }
            }).exec(function (err, doc) {
                if (err) {
                    res.json({
                        status: codeStatus.fail,
                        data: [],
                        message: "增加失败"
                    });
                    res.end();
                } else {
                    res.json({
                        status: codeStatus.suc,
                        data: [],
                        message: "取消成功"
                    });
                    res.end();
                }
            })
        }
    })
});

/**
 * 获得会员卡
 */
router.post("/getCard", function (req, res) {
    var query = tools.changeQuery(req.body);
    if (query._id) {
        if (query._id === 123) {
            res.json({
                status: codeStatus.suc,
                data: [],
                message: "获取会员卡成功"
            });
            res.end()
        } else {
            query = {
                _id: {
                    $in: query._id
                }
            }
        }
    }
    var sort = "-crateTime";
    IdCard.find(query).sort(sort).exec(function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                data: [],
                message: "错误"
            });
        } else {
            res.json({
                status: codeStatus.suc,
                data: doc,
                message: "获取会员卡成功"
            });
            res.end()
        }
    })

});
/**
 * 添加会员卡
 */
router.post("/addVipCard", function (req, res) {
    var query = tools.changeQuery(req.body);
    var isAdmin = query.isAdmin;
    if (isAdmin !== 1 || !isAdmin) {
        res.json({
            status: codeStatus.fail,
            data: [],
            message: "无权限操作"
        });
        res.end();
    }
    //删除权限判断key
    delete query.isAdmin;
    var name = {
        name: query.name
    };
    IdCard.find(name, function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                data: [],
                message: "错误"
            });
            res.end();
        } else {
            if (doc.length > 0) {
                res.json({
                    status: codeStatus.fail,
                    data: [],
                    message: "会员卡已存在"
                });
                res.end();
            } else {
                IdCard.create(query, function (err, doc) {
                    res.json({
                        status: codeStatus.suc,
                        data: doc,
                        message: "添加会员卡成功"
                    });
                    res.end();
                })
            }
        }
    })
});

/**
 * 编辑会员卡
 */
router.post("/updateCard", function (req, res) {
    var query = tools.changeQuery(req.body);
    var isAdmin = query.isAdmin;
    if (isAdmin !== 1 || !isAdmin) {
        res.json({
            status: codeStatus.fail,
            data: [],
            message: "无权限操作"
        });
        res.end();
    }
    //删除权限判断key
    delete query.isAdmin;
    var name = {
        _id: query.id
    };
    IdCard.update(name, query, function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                data: [],
                message: "错误"
            });
            res.end();
        } else {
            res.json({
                status: codeStatus.suc,
                data: doc,
                message: "更新会员卡成功"
            });
            res.end();
        }
    })
});

/**
 * 购买会员卡
 */

router.post("/buyCards", function (req, res) {
    var query = tools.changeQuery(req.body);
    var user = {
        _id: query._id
    };
    var pushCard = {
        vipCard: query.vipCard
    };
    sportUser.find(user, function (err, doc) {
        if (err) {
            res.json({
                status: codeStatus.fail,
                data: [],
                message: "错误"
            });
            res.end();
        } else {
            var rest = doc[0].vipCard;
            var result = rest.some(function (value) {
                return value === query.vipCard
            });
            if (result) {
                res.json({
                    status: codeStatus.fail,
                    data: [],
                    message: "会员卡不可重复购买"
                });
                res.end();
            } else {
                sportUser.update(user, {
                    $push: pushCard
                }, function (err, doc) {
                    if (err) {
                        res.json({
                            status: codeStatus.fail,
                            data: [],
                            message: "错误"
                        });
                        res.end();
                    } else {
                        res.json({
                            status: codeStatus.suc,
                            data: doc,
                            message: "购买会员卡成功"
                        });
                        res.end();
                    }
                })
            }
        }
    });


});

/**
 * 修改个人信息
 */
router.post("/changeInfo", function (req, res) {
    var query = tools.changeQuery(req.body);
    var findQuery = {
        _id: query._id
    };
    sportUser.update(findQuery, query).exec(function (err, doc) {
        if (err) {
            tools.returnResultFaile(res, "修改失败");
        } else {
            if (doc.nModified > 0) {
                tools.returnResultSuccess(res, doc, "修改成功")
            } else {
                tools.returnResultFaile(res, "修改失败");
            }
        }
    })

});

/**
 * 添加教练
 */
router.post("/addCoach", function (req, res) {
    var query = tools.changeQuery(req.body);
    var findQuery = {
        IDCard: query.IDCard
    };
    if (query._id) {
        Coach.update(findQuery, query).exec(function (err, doc) {
            tools.returnResultSuccess(res, doc, "修改成功");
        })
    } else {
        Coach.find(findQuery).exec(function (err, doc) {
            if (err) {
                tools.returnResultFaile(res, "添加失败");
            } else {
                if (doc.length > 0) {
                    tools.returnResultFaile(res, "改用户已存在");
                } else {
                    Coach.create(query, function (err, doc) {
                        tools.returnResultSuccess(res, doc, "添加成功");
                    })
                }
            }
        })
    }


});

/**
 * 获得教练列表
 */
router.post("/getCoach", function (req, res) {
    var query = tools.changeQuery(req.body);
    if (query.name) {
        query.name = new RegExp(query.name)
    }
    console.log(query)
    Coach.find(query).exec(function (err, doc) {
        if (err) {
            tools.returnResultFaile(res, "获取教练列表失败");
        } else {
            tools.returnResultSuccess(res, doc, "获取教练列表成功")
        }
    })

});
/**
 * 添加课程。
 */
router.post("/addCourse", function (req, res) {
    var query = tools.changeQuery(req.body);
    // var findQuery={
    //     _id:query.
    // }
    Course.create(query, function (err, doc) {
        if (err) {
            tools.returnResultFaile(res, "添加课程失败");
        } else {
            tools.returnResultSuccess(res, doc, "添加课程成功")
        }
    })
})

/**
 * 获得课程列表。
 */
router.post("/getCourse", function (req, res) {
    var query = tools.changeQuery(req.body);
    var sort=-"endTime"
    if(query.userId){
        query.userId={$in:[query.userId]} 
    }
    Course.find(query).populate({
        path: 'coach',
        select: "_id name"
    }).sort(sort).exec(function (err, doc) {
        if (err) {
            tools.returnResultFaile(res, "获取课程失败");
        } else {
            tools.returnResultSuccess(res, doc, "获取课程成功")
        }
    })
})

/**
 * 编辑课程信息
 */
router.post("/editCourse", function (req, res) {
    var query = tools.changeQuery(req.body);
    var findQuery = {
        _id: query._id
    }
    Course.update(findQuery, query, function (err, doc) {
        if (err) {
            tools.returnResultFaile(res, "更新课程失败");
        } else {
            tools.returnResultSuccess(res, doc, "更新课程成功")
        }
    })
})

/**
 * resCourseList 预约课程
 */

router.post("/resCourseList", function (req, res) {
    var query = tools.changeQuery(req.body);
    var findQuery = {
        _id: query._id
    }
    var queryPush = {}
    queryPush = {
        $push: {
            userId: query.userId
        }
    }
    Course.find(findQuery).where("userId").in([query.userId]).exec(function (err, doc) {
        if (err) {
            tools.returnResultFaile(res, "预约课程失败");
        } else {
            console.log(doc)
           if(doc.length===0){
              Course.update(findQuery, queryPush, function (err, doc) {
                if (err) {
                    tools.returnResultFaile(res, "预约课程失败");
                } else {
                    tools.returnResultSuccess(res, doc, "预约课程成功")
                }
            }) 
           }else{
            tools.returnResultFaile(res, "预约课程失败,不可重复预约");
           }
            
        }
    })

})


module.exports = router;