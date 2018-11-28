var fs = require('fs');
var log = require('./consoleLog');

log.isShowLog(false);

var BaseGameJsonUrl = __dirname + "/BaseGame.json";

const ANY_NUMBER = 50;
const SPECIAL_NUMBER = 20;


const jsonObj = JSON.parse(fs.readFileSync(BaseGameJsonUrl, function (err, data) {
    if (err) {
        console.error(err);
        exit();
    }
    else {
        return data;
    }
}).toString('utf8'));

const reelObj = jsonObj.Reel;
const mappingTableObj = jsonObj.mappingTable;
const baseLine = jsonObj.baseLine

// startGame2();
testGame(10000000);

async function testGame(times) {
    var totalWinObj = {};
    totalWinObj["winTotalBonus"] = 0;
    for (let i = 0; i < times; i++) {
        let winObj = startGame();
        log.debug(winObj);
        var winTotalBonus = 0;
        for (let k in winObj) {
            if (totalWinObj[k]) {
                totalWinObj[k]["threeLines"] += winObj[k]["threeLines"] ? winObj[k]["threeLines"] : 0;
                totalWinObj[k]["threeLinesBonus"] += winObj[k]["threeLinesBonus"] ? winObj[k]["threeLinesBonus"] : 0;
                totalWinObj[k]["fourLines"] += winObj[k]["fourLines"] ? winObj[k]["fourLines"] : 0;
                totalWinObj[k]["fourLinesBonus"] += winObj[k]["fourLinesBonus"] ? winObj[k]["fourLinesBonus"] : 0;
                totalWinObj[k]["fivesLines"] += winObj[k]["fivesLines"] ? winObj[k]["fivesLines"] : 0;
                totalWinObj[k]["fivesLinesBonus"] += winObj[k]["fivesLinesBonus"] ? winObj[k]["fivesLinesBonus"] : 0;
                totalWinObj[k]["totalWinBonus"] += winObj[k]["totalWinBonus"] ? winObj[k]["totalWinBonus"] : 0;

            }
            else {
                totalWinObj[k] = {};
                totalWinObj[k]["threeLines"] = winObj[k]["threeLines"] ? winObj[k]["threeLines"] : 0;
                totalWinObj[k]["threeLinesBonus"] = winObj[k]["threeLinesBonus"] ? winObj[k]["threeLinesBonus"] : 0;
                totalWinObj[k]["fourLines"] = winObj[k]["fourLines"] ? winObj[k]["fourLines"] : 0;
                totalWinObj[k]["fourLinesBonus"] = winObj[k]["fourLinesBonus"] ? winObj[k]["fourLinesBonus"] : 0;
                totalWinObj[k]["fivesLines"] = winObj[k]["fivesLines"] ? winObj[k]["fivesLines"] : 0;
                totalWinObj[k]["fivesLinesBonus"] = winObj[k]["fivesLinesBonus"] ? winObj[k]["fivesLinesBonus"] : 0;
                totalWinObj[k]["totalWinBonus"] = winObj[k]["totalWinBonus"] ? winObj[k]["totalWinBonus"] : 0;
            }
            winTotalBonus += winObj[k]["totalWinBonus"] ? winObj[k]["totalWinBonus"] : 0;
        }
        totalWinObj["winTotalBonus"] += winTotalBonus;
    }
    log.debug("------------------------------");
    log.debug(totalWinObj);


    var str = "";
    str += "測試次數： " + times + "\n"; totalWinObj["winTotalBonus"]
    for (let k in totalWinObj) {
        if (k !== "winTotalBonus") {
            str += "--------------------------------------------------------------- \n";
            str += "中獎號： " + k + "\n";
            str += "三條線中獎次數： " + totalWinObj[k]["threeLines"] + "\n";
            str += "三條線中獎平均： " + (Math.floor((totalWinObj[k]["threeLines"] / times) * 10000) / 100) + "\n";
            str += "三條線總中獎金額： " + totalWinObj[k]["threeLinesBonus"] + "\n";
            str += "四條線中獎次數： " + totalWinObj[k]["fourLines"] + "\n";
            str += "四條線中獎平均： " + (Math.floor((totalWinObj[k]["fourLines"] / times) * 10000) / 100) + "\n";
            str += "四條線總中獎金額： " + totalWinObj[k]["fourLinesBonus"] + "\n";
            str += "五條線中獎次數： " + totalWinObj[k]["fivesLines"] + "\n";
            str += "五條線中獎平均： " + (Math.floor((totalWinObj[k]["fivesLines"] / times) * 10000) / 100) + "\n";
            str += "五條線總中獎金額： " + totalWinObj[k]["fivesLinesBonus"] + "\n";
            str += "單號總中獎金額： " + totalWinObj[k]["totalWinBonus"] + "\n";
        }
    }
    str += "--------------------------------------------------------------- \n";
    str += "全部總中獎金額： " + totalWinObj["winTotalBonus"] + "\n";
    str += "RTP： " + (totalWinObj["winTotalBonus"] / (times * 88)) + "\n";

    console.log('RTP=' + (totalWinObj["winTotalBonus"] / (times * 88)) + ' done!');

    fs.appendFile(__dirname + '/TestFile/Test_測試數'+times+'_' + new Date().getTime() + '.txt', str, function (err) {
        if (err) {
            console.error(err);
        }
        else {
            log.debug("OK");
        }
    });
}


function startGame2() {

    let Reel1 = getReelArr(reelObj.Reel1);
    let Reel2 = getReelArr(reelObj.Reel2);
    let Reel3 = getReelArr(reelObj.Reel3);
    let Reel4 = getReelArr(reelObj.Reel4);
    let Reel5 = getReelArr(reelObj.Reel5);
    log.debug(Reel1);
    log.debug(Reel2);
    log.debug(Reel3);
    log.debug(Reel4);
    log.debug(Reel5);
    var str = "";
    for (let k in Reel1) {
        str += "------------------------------------------";


    }

}



function startGame() {
    let Reel1 = getReelObj(reelObj.Reel1);
    let Reel2 = getReelObj(reelObj.Reel2);
    let Reel3 = getReelObj(reelObj.Reel3);
    let Reel4 = getReelObj(reelObj.Reel4);
    let Reel5 = getReelObj(reelObj.Reel5);

    log.debug(Reel1);
    log.debug(Reel2);
    log.debug(Reel3);
    log.debug(Reel4);
    log.debug(Reel5);

    var winRecord = {};

    for (let k in Reel1) {
        var winBonus = 0;
        if (k !== "" + ANY_NUMBER) {
            if ((Reel2[k] || Reel2[ANY_NUMBER]) && (Reel3[k] || Reel3[ANY_NUMBER])) {

                Reel2[k] = Reel2[k] ? Reel2[k] : 0;
                Reel3[k] = Reel3[k] ? Reel3[k] : 0;

                winRecord[k] = {};
                winRecord[k]["threeLinesBonus"] = 0;
                winRecord[k]["fourLinesBonus"] = 0;
                winRecord[k]["fivesLinesBonus"] = 0;

                winRecord[k]["threeLines"] = Reel1[k] * (Reel2[k] + Reel2[ANY_NUMBER]) * (Reel3[k] + Reel3[ANY_NUMBER]);
                winRecord[k]["threeLinesBonus"] = baseLine[k]["3"] * winRecord[k]["threeLines"];
                if (Reel4[k] || Reel4[ANY_NUMBER]) {
                    Reel4[k] = Reel4[k] ? Reel4[k] : 0;

                    winRecord[k]["threeLines"] = 0;
                    winRecord[k]["threeLinesBonus"] = 0;

                    winRecord[k]["fourLines"] = Reel1[k] * (Reel2[k] + Reel2[ANY_NUMBER]) * (Reel3[k] + Reel3[ANY_NUMBER]) * (Reel4[k] + Reel4[ANY_NUMBER]);
                    winRecord[k]["fourLinesBonus"] = baseLine[k]["4"] * winRecord[k]["fourLines"];

                    if (Reel5[k] || Reel5[ANY_NUMBER]) {
                        Reel5[k] = Reel5[k] ? Reel5[k] : 0;

                        winRecord[k]["fourLines"] = 0;
                        winRecord[k]["fourLinesBonus"] = 0;

                        winRecord[k]["fivesLines"] = Reel1[k] * (Reel2[k] + Reel2[ANY_NUMBER]) * (Reel3[k] + Reel3[ANY_NUMBER]) * (Reel4[k] + Reel4[ANY_NUMBER]) * (Reel5[k] + Reel5[ANY_NUMBER]);
                        winRecord[k]["fivesLinesBonus"] = baseLine[k]["5"] * winRecord[k]["fivesLines"];
                    }
                }

                winBonus += winRecord[k]["threeLinesBonus"];
                winBonus += winRecord[k]["fourLinesBonus"];
                winBonus += winRecord[k]["fivesLinesBonus"];
                winRecord[k]["totalWinBonus"] = winBonus;

            }
        }
    }
    return winRecord;
}

function getReelObj(arr) {
    let reelObj = {};
    let reelArr = [];
    let randomNum = Math.floor(Math.random() * arr.length);
    let randomFirstNum = randomNum > 0 ? randomNum - 1 : arr.length - 1;
    let randomLastNum = randomNum < arr.length - 1 ? randomNum + 1 : 0;
    // [0,1,2,3,4,5,6]

    reelArr[0] = arr[randomFirstNum];
    reelArr[1] = arr[randomNum];
    reelArr[2] = arr[randomLastNum];

    log.debug(reelArr);


    // reelArr[0] = 50;
    // reelArr[1] = 50;
    // reelArr[2] = 50;

    reelObj[ANY_NUMBER] = 0;
    reelObj[SPECIAL_NUMBER] = 0;


    for (let k in reelArr) {
        if (typeof reelArr[k] === "undefined") {
            log.debug("reelArr === undeinfed");
            exit();
        }
        else {
            if (reelObj[reelArr[k]]) {
                reelObj[reelArr[k]]++;
            }
            else {
                reelObj[reelArr[k]] = 1;
            }
        }

    }
    return reelObj;

}


function getReelArr(arr) {
    let reelObj = {};
    let reelArr = [];
    let randomNum = Math.floor(Math.random() * arr.length);
    let randomFirstNum = randomNum > 0 ? randomNum - 1 : arr.length - 1;
    let randomLastNum = randomNum < arr.length - 1 ? randomNum + 1 : 0;

    reelArr[0] = arr[randomFirstNum];
    reelArr[1] = arr[randomNum];
    reelArr[2] = arr[randomLastNum];

    for (let k in reelArr) {
        if (typeof reelArr[k] === "undefined") {
            log.debug("reelArr === undeinfed");
            exit();
        }
    }
    return reelArr;

}




function exit() {
    console.error("node error Exit");
    process.exit();
}


// "baseLine":{
  //   "15": {
  //     "3": 150,
  //     "4": 300,
  //     "5": 600
  //   },
  //   "14": {
  //     "3": 100,
  //     "4": 200,
  //     "5": 400
  //   },
  //   "13": {
  //     "3": 50,
  //     "4": 150,
  //     "5": 300
  //   },
  //   "12": {
  //     "3": 30,
  //     "4": 75,
  //     "5": 150
  //   },
  //   "11": {
  //     "3": 20,
  //     "4": 50,
  //     "5": 100
  //   },
  //   "5": {
  //     "3": 10,
  //     "4": 30,
  //     "5": 40
  //   },
  //   "4": {
  //     "3": 10,
  //     "4": 20,
  //     "5": 35
  //   },
  //   "3": {
  //     "3": 10,
  //     "4": 15,
  //     "5": 30
  //   },
  //   "2": {
  //     "3": 5,
  //     "4": 15,
  //     "5": 25
  //   },
  //   "1": {
  //     "3": 5,
  //     "4": 10,
  //     "5": 20
  //   },
  //   "20": {
  //     "3": 10,
  //     "4": 25,
  //     "5": 50
  //   }
  // }, // fs.appendFile(__dirname + '/TestFile/Test_測試數' + times + '_' + new Date().getTime() + '.txt', str, function (err) {
    //     if (err) {
    //         console.error(err);
    //     }
    //     else {
    //         console.log('RTP=' + (obj["totalWinBonus"] / (times * 88)) + ' done!');
    //     }
    // });
