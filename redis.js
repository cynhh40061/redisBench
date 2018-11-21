const IORedis = require('ioredis');

const convertObjectToArray = (obj) => {
    const result = [];
    const keys = Object.keys(obj);
    for (let i = 0, l = keys.length; i < l; i++) {
        result.push(keys[i], obj[keys[i]]);
    }
    return result;
};

const convertMapToArray = (map) => {
    const result = [];
    let pos = 0;
    map.forEach((value, key) => {
        result[pos] = key;
        result[pos + 1] = value;
        pos += 2;
    });
    return result;
};

exports.initializeCluster = async (jsonConfig) => {
    this.redis = new IORedis.Cluster(jsonConfig, {
        enableReadyCheck: true,
        clusterRetryStrategy: (times) => {
            return Math.min(100 + (times * 2), 2000);
        },
        scaleReads: 'all',
        redisOptions: {
            dropBufferSupport: true,
            enableReadyCheck: true,
            stringNumbers: true,
        },
    });
    const changePromis = this.redis;
    changePromis.Promise = global.Promise;
    this.allAll = this.redis.nodes('all');
    this.allSlaves = this.redis.nodes('slave');
    this.allMasters = this.redis.nodes('master');
    IORedis.Command.setArgumentTransformer('hmset', (args) => {
        if (args.length === 2) {
            if (typeof Map !== 'undefined' && args[1] instanceof Map) {
                return [args[0]].concat(convertMapToArray(args[1]));
            }
            if (typeof args[1] === 'object' && args[1] !== null) {
                return [args[0]].concat(convertObjectToArray(args[1]));
            }
        }
        return args;
    });
    IORedis.Command.setReplyTransformer('hgetall', (result) => {
        if (Array.isArray(result)) {
            const obj = {};
            for (let i = 0; i < result.length; i += 2) {
                obj[result[i]] = result[i + 1];
            }
            return obj;
        }
        return result;
    });
    IORedis.Command.setReplyTransformer('hmget', (result) => {
        if (Array.isArray(result)) {
            const obj = {};
            for (let i = 0; i < result.length; i += 2) {
                obj[result[i]] = result[i + 1];
            }
            return obj;
        }
        return result;
    });
};

exports.getRedis = () => {
    return this.redis;
};
