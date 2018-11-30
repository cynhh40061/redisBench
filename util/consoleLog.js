var isShowConsoleLog = true;
exports.isShowLog = function (todo) {
    if (todo) {

        isShowConsoleLog = true;
    }
    else {
        isShowConsoleLog = false;
    }
};


exports.debug = function (str) {
    if (isShowConsoleLog) {
        console.log(str);
    }
};