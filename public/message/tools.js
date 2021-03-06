var codeStatus = require("./code-status")

/**
 * 整理参数
 * @param queryData
 * @returns {{}}
 */

function changeQuery(queryData) {
    var result = {};
    if (queryData) {
        for (var key in queryData) {
            if (!queryData[key] && queryData[key] !== 0) continue;
            if (Array.isArray(queryData[key]) && queryData[key].length == 0) continue;
            result[key] = queryData[key]
        }
    }
    return result;
}

/**
 *
 *
 * @type {{changeQuery: changeQuery}}
 */

function changeSearch(queryData) {
    var result = {};
    if (queryData && queryData !== {}) {
        for (var key in queryData) {
            result[key] = queryData[key]
        }
    }
    return result;
}

function verificationAdmin(userId) {
    if (userId == "5ad5fca38035fe33e861b3b9") {
        return true
    }
    return false
}

/**
 * 返回错误响应
 * @param {any} res
 * @param {any} message
 */
function returnResultFaile(res, message) {
    res.json({
        status: codeStatus.fail,
        data: [],
        message: message
    })
    res.end();
}

/**
 * 返回成功的状态信息
 *
 * @param {any} res
 * @param {any} data
 * @param {any} message
 */
function returnResultSuccess(res, data, message, count) {
    if (count) {
        res.json({
            status: codeStatus.suc,
            data: data,
            message: message,
            count: count,
        })
    } else {
        res.json({
            status: codeStatus.suc,
            data: data,
            message: message,
        })
    }

}


/**
 * 返回当天时间戳
 *
 * @param {any} num
 * @returns
 */
function chackTime(num) {
    var time = new Date(num);
    var date = time.toLocaleDateString();
    var day = time.getDate();
    var dataArr = date.split("-");
    var endTime = dataArr[0] + "-" + dataArr[1] + "-" + (day + 1);
    return {
        startNum: new Date(date).getTime(),
        endNum: new Date(endTime).getTime(),
    }
};




module.exports = {
    changeQuery: changeQuery,
    verificationAdmin: verificationAdmin,
    returnResultFaile: returnResultFaile,
    returnResultSuccess: returnResultSuccess,
    chackTime: chackTime,
};