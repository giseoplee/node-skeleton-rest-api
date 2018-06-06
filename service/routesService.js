const csurf = require('csurf');
const util = require('util');
const moment = require('moment');

const config = require('../config');
const authController = require('../controller/authController');
const kakaoController = require('../controller/kakaoController');

const csrfProtection = new csurf({ cookie: true });
const RoutesService = {};

RoutesService.Init = () => {

    if (app.get('env') === 'production') {

        app.use(csrfProtection);
        console.log(util.format('USE MIDDLEWARE CSRF'));
    }

    app.use((req, res, next) => {

        res.header('Access-Control-Allow-Origin', config.server.accept_domain);
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        console.log(util.format('[Logger]::[Route]::[Access URL %s]::[Access Ip %s]::[Access Time %s]',
                                    req.originalUrl,
                                    req.ip,
                                    moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
                                ));
        next();
    });

    app.use('/auth', authController);
    app.use('/kakao', kakaoController);

    console.log("## SETUP ROUTE SERVICE ##");
}

module.exports = RoutesService;
