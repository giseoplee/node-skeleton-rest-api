"use strict"

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const util = require('util');
const methodOverride = require('method-override');
const http = require('http');
const process = require('process');

const config = require('./config');
const routesService = require('./service/routesService.js');
const redisService = require('./service/redisService.js');
const entityService = require('./service/entityService.js');

global.app = new express();

// 서버 포트 설정
app.set('port', process.env.PORT || config.server.port);

// 패킷 압축 관련
app.use(compression());
app.use(methodOverride());

// 패킷 & url 파서 관련
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// trust proxy 설정
app.set('trust proxy', config.server.trust_proxy_host);

entityService.Init();
routesService.Init();

http.createServer(app).listen(app.get('port'), () => {
    console.log(util.format('## [PROCESS ON] [PID:%d] SERVER RUNNING AT %d ##', process.pid, config.server.port));
});
