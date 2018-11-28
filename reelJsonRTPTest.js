var fs = require('fs');
const ReelAllNumJsonUrl = __dirname + "/ReelRangeJson/ReelAllNum.json";
const BaseGameJsonUrl = __dirname + "/BaseGame.json";

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

const reelObj = jsonObj['Reel'];
const mappingTableObj = jsonObj['mappingTable'];
const baseLine = jsonObj['baseLine'];
const PLAYER_BET = 88;

getReelRandom = (Num) => {
    var obj = {};
    var keys = Object.keys(reelAllNumObj);
    var randomNum = parseInt(Math.random() * reelAllNumObj[keys[Num]].length);
    var reelNum = reelAllNumObj[keys[Num]][randomNum].split('|');
    // console.log(reelNum);

    for (let i = 0; i < reelNum.length; i++) {
        var subReel = reelObj['Reel' + (i + 1)];
        var subReelNum = parseInt(reelNum[i]);

        if (subReelNum == 0) {
            obj['Reel' + (i + 1)] = [subReel[subReel.length - 1], subReel[0], subReel[1]];
        } else if (reelNum[i] == subReel.length - 1) {
            obj['Reel' + (i + 1)] = [subReel[subReel.length - 2], subReel[subReel.length - 1], subReel[0]];
        } else {
            obj['Reel' + (i + 1)] = [subReel[subReelNum - 1], subReel[subReelNum], subReel[subReelNum + 1]];
        }
    }
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

test = (runTimes, Num) => {
    var totalWinBonus = 0;
    for (var i = 1; i <= runTimes; i++) {
        var reelSampling = getReelRandom(Num);
        var winObj = checkReelRate(reelSampling);
        for (var j = 0; j < Object.keys(winObj).length; j++) {
            var key = Object.keys(winObj)[j];
            var totalLine = winObj[key]['winBaseLine'] * winObj[key]['winCount'];

            totalWinBonus = totalWinBonus + totalLine;
        }
    }
    var newRTP = totalWinBonus / (runTimes * PLAYER_BET);
    console.log(totalWinBonus);
    console.log('oldRTP=', Object.keys(reelAllNumObj)[Num]);
    console.log('newRTP=', newRTP);
}

test(100000, 3);