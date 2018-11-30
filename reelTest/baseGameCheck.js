const tools = require('../util/tool');
const reelConsts = require('../constants/reelConstants');
const urlConstants = require('../constants/urlConstants');

getReelRandom = () => {
    var obj = {};
    var rArray = [];

    for (let i = 1; i <= Object.keys(reelConsts.reelObj).length; i++) {
        subReel = reelConsts.reelObj['Reel' + i];
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

    var reelRandomForKey = ''.concat(rArray[0], '|', rArray[1], '|', rArray[2], '|', rArray[3], '|', rArray[4]);
    reelConsts.reelAllJson[reelRandomForKey] = '';

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
    };
    for (var i = 1; i <= runTimes; i++) {
        var reelSampling = getReelRandom();
        var winObj = tools.checkReelRate(reelSampling);
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

            var reelAllJsonKey = Object.keys(reelConsts.reelAllJson);
            if (totalLine > reelConsts.reelHighRange) {
                reelConsts.reelHighRangeJson[reelAllJsonKey[reelAllJsonKey.length - 1]] = '';
            } else if (reelConsts.reelLowRange <= totalLine && totalLine <= reelConsts.reelHighRange) {
                reelConsts.reelNomalRangeJson[reelAllJsonKey[reelAllJsonKey.length - 1]] = '';
            } else if (totalLine < reelConsts.reelLowRange) {
                reelConsts.reelLowRangeJson[reelAllJsonKey[reelAllJsonKey.length - 1]] = '';
            }
        }
    }

    infoOutput(runTimes, totalObj);
}

infoOutput = (times, obj) => {
    var str = "";
    str += "測試次數： " + times + "\n";
    for (let k in obj) {
        if (k !== "totalWinBonus") {
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
    reelConsts.reelAllNumObj[RTPs] = getReelKeyArray(reelConsts.reelAllJson);
    tools.writeFile(urlConstants.ReelAllNumJsonUrl, JSON.stringify(reelConsts.reelAllNumObj));
    getRTPKey(reelConsts.reelAllNumObj);

    reelConsts.reelHighRangeNumObj[RTPs] = getReelKeyArray(reelConsts.reelHighRangeJson);
    tools.writeFile(urlConstants.ReelHighRangeNumJsonUrl, JSON.stringify(reelConsts.reelHighRangeNumObj));
    getRTPKey(reelConsts.reelHighRangeNumObj);

    tools.appendNewFile(__dirname + '/TestFile/Test_測試數' + times + '_' + new Date().getTime() + '.txt', str);
    console.log(RTPs);
}

getReelKeyArray = (obj) => {

    var arr = [];
    if (tools.isNull(obj)) {
        for (var i = 0; i < Object.keys(obj).length; i++) {
            arr.push(Object.keys(obj)[i]);
        }
    } else {
        arr = [];
    }
    return arr;
}

getRTPKey = (json) => {
    console.log(Object.keys(json));
}

test(10000);
