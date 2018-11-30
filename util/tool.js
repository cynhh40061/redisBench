var fs = require('fs');

/*
通用工具
    isNull：是否有值(回傳 boolean)
    isVal：是否有值(回傳 value)
    readFile：讀取資料
    writeFile：寫入資料
    appendNewFile：新建立檔案
    exit：離開 nodejs
*/

exports.isNull = (val) => {
    if (val == undefined || val == null) {
        return false;
    } else {
        return true;
    }
}

exports.isVal = (val) => {
    if (val == undefined || val == null) {
        return null;
    } else {
        return val;
    }
}

exports.readFile = (url) => {
    try {
        let data = fs.readFileSync(url, function (err, data) {
            if (err) {
                console.error(err);
                exit();
            }
            else {
                return data
            }
        }).toString('utf8');
        return data;
    } catch (e) {
        console.error(e);
    }
    return undefined;
}

exports.writeFile = async (url, data) => {
    await fs.writeFile(url, data, "UTF8", function (err) {
        if (err) throw err;
        console.log("檔案寫入操作完成!");
    })
    console.log("檔案寫入操作中 ... ");
}

exports.appendNewFile = (url, data) => {
    fs.appendFile(url, data, function (err) {
        if (err) {
            console.error(err);
            exit()
        }
        else {
            console.log('done!');
        }
    });
}

exit = (str) => {
    if (str) {
        console.error(str);
    }
    process.exit();
}

/*
確認此筆reel是否中獎
*/

const reelConsts = require('../constants/reelConstants');

exports.checkReelRate = (reelSampling) => {
    var Reel1 = reelSampling['Reel1'];
    var rCount = 1;
    var rCombo = 0;
    var obj = {};

    for (var i = 0; i < Reel1.length; i++) {
        rCount = 1;
        rCombo = 0;
        for (var j = 0; j < Object.keys(reelSampling).length; j++) {
            var key = Object.keys(reelSampling)[j];
            var count = 0;
            for (var k = 0; k < Reel1.length; k++) {
                if (Reel1[i] == reelSampling[key][k] || 50 == reelSampling[key][k]) {
                    count++;
                }
            }
            if (count != 0) {
                rCount = rCount * count;
                rCombo++;
            }
            else {
                break;
            }
        }
        if (rCombo >= 3) {
            obj[Reel1[i]] = { 'winCombo': rCombo, 'winCount': rCount, 'winBaseLine': reelConsts.baseLine[Reel1[i]][rCombo] };
        }
    }

    // console.log(reelSampling);
    // console.log(obj);
    return obj;
}