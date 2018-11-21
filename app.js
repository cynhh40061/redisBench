'use strict';

const Aigle = require('aigle');
global.Promise = Aigle;
const RedisContext = require('./redis');
const BigNumber = require('bignumber.js');
const _ = require('lodash');

const TOTALTIMES = 'TOTALTIMES';
const CHANNEL = 'CHANNEL';
const setKeys = async (RedisManger, runtimes) => {
    for (let index = 0; index < runtimes; index++) {
        const random1 = Math.floor(Math.random() * 100000000);
        const random2 = Math.floor(Math.random() * 100000000);
        const random3 = Math.floor(Math.random() * 100000000);
        try {
            const k = random1 + '-' + random2;
            const v = random1 + '-' + random2 + '-' + random3 + '-' + random1 + '-' + random2;
            // await RedisManger.set(k, v);
            // await RedisManger.rpush(CHANNEL, k);//把每個key塞進一個list裡紀錄
            await RedisManger.incr(TOTALTIMES);//total count 每次加1
            await RedisManger.rpush('RANDOMLIST', random1);
        } catch (error) {
            throw error;
        }
    }
};

const getAndDeleteKeys = async (RedisManger) => {
    for (let index = 0; index < 10; index++) {
        try {
            // 找出哪個keys的Slot桶已經超過10000筆以上未處理, 優先處理
            const key = await RedisManger.lpop(CHANNEL);//從CHANNEL的value左邊開始取值
            await RedisManger.get(key);
            await RedisManger.del(key);
        } catch (error) {
            throw error;
        }
    }
};

Aigle.attempt(() => {//非同步 Pormise 處理的套件
    return RedisContext.initializeCluster([
        { port: '7001', host: '192.168.10.212' }
    ]);
})
    .then(async () => {
        const NS_PER_SEC = 1e9;//10億
        const MS_PER_NS = 1e-6;//100萬分之1
        const countingTime = process.hrtime();//取得精確時間(也可用uptime()的精確度低一點，較快)
        let diff;
        let loop;
        const initTimes = await RedisContext.getRedis().get(TOTALTIMES);
        const continuSec = 10;
        const onceSec = 1;

        try {
            await RedisContext.getRedis().del('RANDOMLIST');//show完刪除list
            loop = setInterval(async function () {//settimeout
                await setKeys(RedisContext.getRedis(), 1).catch((err) => { throw err; });//塞
                await getAndDeleteKeys(RedisContext.getRedis()).catch((err) => { throw err; });//塞完刪除
                diff = process.hrtime(countingTime);//精確時間差
                if (((diff[0] * NS_PER_SEC + diff[1]) * MS_PER_NS) > (continuSec * 1000)) {
                    clearInterval(loop);
                    console.log('LoopTimes: ', (await RedisContext.getRedis().get(TOTALTIMES) - initTimes));//show total count，這邊count沒做初始化，直接用終值減初值去計次
                    console.log('TotalCastTimes: ', ((diff[0] * NS_PER_SEC + diff[1]) * MS_PER_NS));//diff[0]：秒 + diff[1]：微秒
                    await RedisContext.getRedis().lrange('RANDOMLIST', 0, -1).then(//獲取RANDOMLIST從index[0]~最後一筆所有值
                        (req) => console.log('randomList: ', req),
                        (e) => console.error(e)
                    );
                }
            }, (onceSec * 1000));//來不及完成會有誤差
        } catch (error) {
            console.log(error);
            clearInterval(loop);
            process.exit(0);//指示Node.js同步终止进程(傳入成功狀態碼0)
        }
    })