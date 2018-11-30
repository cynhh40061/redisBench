const tools = require('../util/tool');
const urlConstants = require('../constants/urlConstants');

const jsonObj = JSON.parse(tools.readFile(urlConstants.BaseGameJsonUrl));

exports.reelAllNumObj = JSON.parse(tools.readFile(urlConstants.ReelAllNumJsonUrl));
exports.reelHighRangeNumObj = JSON.parse(tools.readFile(urlConstants.ReelHighRangeNumJsonUrl));

exports.reelObj = jsonObj['Reel'];
exports.mappingTableObj = jsonObj['mappingTable'];
exports.baseLine = jsonObj['baseLine'];

exports.reelHighRange = 1000;
exports.reelLowRange = 100;

exports.reelHighRangeJson = {};
exports.reelNomalRangeJson = {};
exports.reelLowRangeJson = {};
exports.reelAllJson = {};

exports.PLAYER_BET = 88;



