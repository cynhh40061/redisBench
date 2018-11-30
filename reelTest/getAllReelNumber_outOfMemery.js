var Combinatorics = require('js-combinatorics');

const tools = require('../util/tool');
const reelConsts = require('../constants/reelConstants');
const urlConstants = require('../constants/urlConstants');

getAllRangrFromReel = () => {
    // var Reel1 = reelConsts.reelObj['Reel1'];
    // var Reel2 = reelConsts.reelObj['Reel2'];
    // var Reel3 = reelConsts.reelObj['Reel3'];
    // var Reel4 = reelConsts.reelObj['Reel4'];
    // var Reel5 = reelConsts.reelObj['Reel5'];


    var Reel1 = [0, 1, 2];
    var Reel2 = [0, 1, 2];
    var Reel3 = [0, 1, 2];
    var Reel4 = [0, 1, 2];
    var Reel5 = [0, 1, 2];


    var cou = 0;

    for (var r1 = 0; r1 < Reel1.length; r1++) {
        for (var r2 = 0; r2 < Reel2.length; r2++) {
            for (var r3 = 0; r3 < Reel3.length; r3++) {
                for (var r4 = 0; r4 < Reel4.length; r4++) {
                    for (var r5 = 0; r5 < Reel5.length; r5++) {
                        checkReelRate([r1, r2, r3, r4, r5], ''.concat(r1, ',', r2, ',', r3, ',', r4, ',', r5));
                        cou++;
                    }
                }
            }
        }
    }
    console.log(cou);
}

getReelNum = (arr) => {
    var obj = {};

    for (let i = 1; i <= arr.length; i++) {
        subReel = reelConsts.reelObj['Reel' + i];
        if (arr[i] == 0) {
            obj['Reel' + i] = [subReel[subReel.length - 1], subReel[0], subReel[1]];
        } else if (arr[i] == subReel.length - 1) {
            obj['Reel' + i] = [subReel[subReel.length - 2], subReel[subReel.length - 1], subReel[0]];
        } else {
            obj['Reel' + i] = [subReel[arr[i] - 1], subReel[arr[i]], subReel[arr[i] + 1]];
        }
    }

    return obj;
}

checkReelRate = (arr, str) => {
    var nowReelNumber = getReelNum(arr);
    var Reel1 = nowReelNumber['Reel1'];
    var rCount = 1;
    var rCombo = 0;
    var obj = {};

    for (var i = 0; i < Reel1.length; i++) {
        rCount = 1;
        rCombo = 0;
        for (var j = 0; j < Object.keys(nowReelNumber).length; j++) {
            var key = Object.keys(nowReelNumber)[j];
            var count = 0;
            for (var k = 0; k < Reel1.length; k++) {
                if (Reel1[i] == nowReelNumber[key][k] || 50 == nowReelNumber[key][k]) {
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

        var thisBaseLine = (reelConsts.baseLine[Reel1[i]][rCombo]) == undefined ? 0 : (reelConsts.baseLine[Reel1[i]][rCombo]);
        var totalLine = thisBaseLine * rCount
        if (totalLine > reelConsts.reelHighRange) {
            reelHighRangeJson[str] = { 'winCombo': rCombo, 'winCount': rCount, 'winBaseLine': reelConsts.baseLine[Reel1[i]][rCombo] };
        } else if (reelConsts.reelLowRange <= totalLine && totalLine <= reelConsts.reelHighRange) {
            // reelNomalRangeJson[str] = { 'winCombo': rCombo, 'winCount': rCount, 'winBaseLine': reelConsts.baseLine[Reel1[i]][rCombo] };
        } else {
            // reelLowRangeJson[str] = { 'winCombo': rCombo, 'winCount': rCount, 'winBaseLine': reelConsts.baseLine[Reel1[i]][rCombo] };
        }
    }
}

// getAllRangrFromReel();
// console.log(reelHighRangeJson);


