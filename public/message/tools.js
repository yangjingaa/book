
/**
 * 整理参数
 * @param queryData
 * @returns {{}}
 */

function changeQuery(queryData) {
    var result = {};
    if (queryData) {
        for (var key in queryData) {
            if(key!=="pageIndex"){
                result[key]=queryData[key]
            }
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
    if (queryData&&queryData!=={}) {
        for (var key in queryData) {
            result[key]=queryData[key]
        }
    }
    return result;
}

function verificationAdmin(userId) {
    if(userId=="5ad5fca38035fe33e861b3b9"){
        return true
    }
    return false
}


module.exports={
    changeQuery:changeQuery,
    verificationAdmin:verificationAdmin,
};