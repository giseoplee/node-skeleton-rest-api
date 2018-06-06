const session = require('express-session');
const redisStore = require('connect-redis')(session);
const moment = require('moment');
const config = require('../config');
const util = require('util');

const SessionService = function () {};

SessionService.Init = () => {
    var sessionSetting = {
        store: new redisStore({
          port: config.redis.redisPort,
          host: config.redis.redisHost,
          password: config.redis.redisPassword,
          ttl: 21600, // redis를 2시간마다 검사하며 파기 시간이 지난 토큰 삭제
          logErrors: true
        }),
        secret: config.server.auth_key,
        resave: false,
        saveUninitialized: false
    };

    app.set('trust proxy', 1);
    app.use(session(sessionSetting));
}

module.exports = SessionService;
