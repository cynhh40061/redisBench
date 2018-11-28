var fs = require('fs');
const BaseGameJsonUrl = __dirname + "/BaseGame.json";
const ReelAllNumJsonUrl = __dirname + "/ReelRangeJson/ReelAllNum.json";
const ReelHighRangeNumJsonUrl = __dirname + "/ReelRangeJson/ReelHighRangeNum.json";
const ReelNomalRangeNumJsonUrl = __dirname + "/ReelRangeJson/ReelNomalRangeNum.json";
const ReelLowRangeNumJsonUrl = __dirname + "/ReelRangeJson/ReelLowRangeNum.json";

const jsonObj = JSON.parse(fs.readFileSync(BaseGameJsonUrl, function (err, data) {
    if (err) {
        console.error(err);
        exit();
    }
    else {
        return data;
    }
}).toString('utf8'));

const reelAllNumObj = JSON.parse(fs.readFileSync(ReelAllNumJsonUrl, function (err, data) {
    if (err) {
        console.error(err);
        exit();
    }
    else {
        ReelRangeJson
        return data;
    }
}).toString('utf8'));

const reelHighRangeNumObj = JSON.parse(fs.readFileSync(ReelHighRangeNumJsonUrl, function (err, data) {
    if (err) {
        console.error(err);
        exit();
    }
    else {
        return data;
    }
}).toString('utf8'));

const reelObj = jsonObj['Reel'];
const mappingTableObj = jsonObj['mappingTable'];
const baseLine = jsonObj['baseLine'];

const reelHighRange = 1000;
const reelLowRange = 100;

getReelRandom = () => {
    var obj = {};
    var rArray = [];

    for (let i = 1; i <= Object.keys(reelObj).length; i++) {
        subReel = reelObj['Reel' + i];
        var randomNum = parseInt(Math.random() * subReel.length);

        if (randomNum == 0) {
            obj['Reel' + i] = [subReel[subReel.length - 1], subReel[0], subReel[1]];
        } else if (randomNum == subReel.length - 1) {
            obj['Reel' + i] = [subReel[subReel.length - 2], subReel[subReel.length - 1], subReel[0]];
        } else {
            obj['Reel' + i] = [subReel[randomNum - 1], subReel[randomNum], subReel[randomNum + 1]];
        }

        rArray.push(randomNum);
    }

    obj['randomNum'] = ''.concat(rArray[0], '|', rArray[1], '|', rArray[2], '|', rArray[3], '|', rArray[4]);

    return obj;
}

checkReelRate = (reelSampling) => {
    var Reel1 = reelSampling['Reel1'];
    var rCount = 1;
    var rCombo = 0;
    var obj = {};

    for (var i = 0; i < Reel1.length; i++) {
        rCount = 1;
        rCombo = 0;
        for (var j = 0; j < Object.keys(reelSampling).length; j++) {
            var key = Object.keys(reelSampling)[j];
            // console.log(key);
            var count = 0;
            if (key != 'randomNum') {
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
        }
        if (rCombo >= 3) {
            obj[Reel1[i]] = { 'winCombo': rCombo, 'winCount': rCount, 'winBaseLine': baseLine[Reel1[i]][rCombo] };
        }
    }

    // console.log(reelSampling);
    // console.log(obj);
    return obj;
}

test = (runTimes) => {
    var totalObj = {
        1: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
        2: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
        3: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
        4: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
        5: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
        11: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
        12: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
        13: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
        14: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
        15: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
        20: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
        // 50: { threeCombo: 0, threeComboBonus: 0, fourCombo: 0, fourComboBonus: 0, fivesCombo: 0, fivesComboBonus: 0, winBonus: 0 },
        totalWinBonus: 0,
        reelHighRangeJson: {},
        reelNomalRangeJson: {},
        reelLowRangeJson: {},
        reelAllJson: {}
    };
    for (var i = 1; i <= runTimes; i++) {
        var reelSampling = getReelRandom();
        var winObj = checkReelRate(reelSampling);
        for (var j = 0; j < Object.keys(winObj).length; j++) {
            var key = Object.keys(winObj)[j];
            if (winObj[key]['winCombo'] == 3) {
                totalObj[key]['threeCombo'] = totalObj[key]['threeCombo'] + 1;
                totalObj[key]['threeComboBonus'] = totalObj[key]['threeComboBonus'] + winObj[key]['winBaseLine'] * winObj[key]['winCount'];
            } else if (winObj[key]['winCombo'] == 4) {
                totalObj[key]['fourCombo'] = totalObj[key]['fourCombo'] + 1;
                totalObj[key]['fourComboBonus'] = totalObj[key]['fourComboBonus'] + winObj[key]['winBaseLine'] * winObj[key]['winCount'];
            } else if (winObj[key]['winCombo'] == 5) {
                totalObj[key]['fivesCombo'] = totalObj[key]['fivesCombo'] + 1;
                totalObj[key]['fivesComboBonus'] = totalObj[key]['fivesComboBonus'] + winObj[key]['winBaseLine'] * winObj[key]['winCount'];
            }

            var totalLine = winObj[key]['winBaseLine'] * winObj[key]['winCount'];
            totalObj[key]['winBonus'] = totalObj[key]['winBonus'] + totalLine;
            totalObj['totalWinBonus'] = totalObj['totalWinBonus'] + totalLine;

            // if (totalLine > reelHighRange) {
            //     totalObj['reelHighRangeJson'][reelSampling['randomNum']] = '';
            // } else if (reelLowRange <= totalLine && totalLine <= reelHighRange) {
            //     totalObj['reelNomalRangeJson'][reelSampling['randomNum']] = '';
            // } else if (totalLine < reelLowRange) {
            //     totalObj['reelLowRangeJson'][reelSampling['randomNum']] = '';
            // }
        }
         totalObj['reelAllJson'][reelSampling['randomNum']] = '';
    }

    infoOutput(runTimes, totalObj);
}

infoOutput = (times, obj) => {
    var str = "";
    str += "測試次數： " + times + "\n";
    for (let k in obj) {
        if (k !== "totalWinBonus" && k != 'reelHighRangeJson' && k != 'reelNomalRangeJson' && k != 'reelLowRangeJson' && k != 'reelAllJson') {
            str += "--------------------------------------------------------------- \n";
            str += "中獎號： " + k + "\n";
            str += "三條線中獎次數： " + obj[k]["threeCombo"] + "\n";
            str += "三條線中獎平均： " + (Math.floor((obj[k]["threeCombo"] / times) * 10000) / 100) + "\n";
            str += "三條線總中獎金額： " + obj[k]["threeComboBonus"] + "\n";
            str += "四條線中獎次數： " + obj[k]["fourCombo"] + "\n";
            str += "四條線中獎平均： " + (Math.floor((obj[k]["fourCombo"] / times) * 10000) / 100) + "\n";
            str += "四條線總中獎金額： " + obj[k]["fourComboBonus"] + "\n";
            str += "五條線中獎次數： " + obj[k]["fivesCombo"] + "\n";
            str += "五條線中獎平均： " + (Math.floor((obj[k]["fivesCombo"] / times) * 10000) / 100) + "\n";
            str += "五條線總中獎金額： " + obj[k]["fivesComboBonus"] + "\n";
            str += "單號總中獎金額： " + obj[k]["winBonus"] + "\n";
        }
    }
    str += "--------------------------------------------------------------- \n";
    str += "全部總中獎金額： " + obj["totalWinBonus"] + "\n";
    str += "RTP： " + (obj["totalWinBonus"] / (times * 88)) + "\n";
    str += "--------------------------------------------------------------- \n";

    var RTPs = Math.floor((obj["totalWinBonus"] / (times * 88)) * 10000) / 10000;
    reelAllNumObj[RTPs] = getReelKeyArray(obj["reelAllJson"]);
    writeReelObj(JSON.stringify(reelAllNumObj), ReelAllNumJsonUrl);
    getRTPKey(reelAllNumObj);

    reelHighRangeNumObj[RTPs] = getReelKeyArray(obj["reelHighRangeJson"]);
    // writeReelObj(JSON.stringify(reelHighRangeNumObj), ReelHighRangeNumJsonUrl);
    getRTPKey(reelHighRangeNumObj);

    // appendNewFile(__dirname + '/TestFile/Test_測試數' + times + '_' + new Date().getTime() + '.txt', str);
    console.log(RTPs);
}

isNull = (val) => {
    if (val == undefined || val == null) {
        return false;
    } else {
        return true;
    }
}

isVal = (val) => {
    if (val == undefined || val == null) {
        return null;
    } else {
        return val;
    }
}

getReelKeyArray = (obj) => {
    var arr = [];
    if (isNull(obj)) {
        for (var i = 0; i < Object.keys(obj).length; i++) {
            arr.push(Object.keys(obj)[i]);
        }
    } else {
        arr = [];
    }
    return arr;
}

writeReelObj = async (data, url) => {
    await fs.writeFile(url, data, "UTF8", function (err) {
        if (err) throw err;
        console.log("檔案寫入操作完成!");
    })
    console.log("檔案寫入操作中 ... ");
}

appendNewFile = (url, data) => {
    fs.appendFile(url, data, function (err) {
        if (err) {
            console.error(err);
        }
        else {
            console.log('done!');
        }
    });
}

getRTPKey = (json) => {
    console.log(Object.keys(json));
}

test(10000);
