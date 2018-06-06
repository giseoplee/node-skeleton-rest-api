const config = require('../config');
const common = require('../utils/util');

const ioRedis = require('ioredis');
const _ = require('lodash');
const util = require('util');
const moment = require('moment')

const RedisService = {};

RedisService.session = new ioRedis(
{
    port: config.redis.redisPort,
    host: config.redis.redisHost,
    password: config.redis.redisPassword,
    db: 0,

    retryStrategy: function (times) {
        const delay = Math.min(times * 2, 2000);
        console.log(delay);
        return delay;
    }
});

RedisService.findAndCreate = async function(key) {
    return await RedisService.session.get(key)
    .then(result => {
        if(_.eq(result, null)) {
            var expire = moment().add('minutes', 720).valueOf();
            var token = jwt.encode({
              aud : key + 'normal',
              exp : expire
            }, config.server.auth_key, 'HS512')
            return RedisService.sessionSetter(key, token)
        }
        return 'ALREADY'
    }).catch(error => {
      console.log(error)
    })
}

RedisService.sessionSetter = async function(key, value) {
  const result = await RedisService.session.set(key, value)
  return result
}

console.log(util.format("## SETUP REDIS SERVICE ##"));


module.exports = RedisService;
