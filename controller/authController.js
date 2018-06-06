const express = require('express');
const bodyParser = require('body-parser');
const util = require('util');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const resultCode = require('../utils/resultCode');
const _ = require('lodash');

const { respondJson, respondOnError, respondHtml } = require('../utils/respond');
const config = require('../config');
const common = require('../utils/util.js');
const passportService = require('../service/passportService');
const sessionService = require('../service/sessionService');
const authModel = require('../model/authModel')
const router = express.Router();

// Route Logging
router.use((req, res, next) => { console.log('## [AUTH] AuthController started ##'); next() });

// Passport 참조용
router.get('/login', passportService.passport.authenticate('google', { scope: ['profile', 'email'] }));

// Passport 참조용
router.get('/google/callback',
  passportService.passport.authenticate('google',
  { failureFlash: false, failureRedirect: '/login?error=invalid_domain_' }),
  function(req, res){
    if (req.user._json.domain !== 'freemed.or.kr') {
        return res.redirect('/login?error=invalid_domain_');
    }
    req.session.auth = 'normal'
    res.redirect('/receipt');
});

// Logout 참조용
router.get('/logout', (req, res) => {

    req.session.destroy();
    res.redirect('/login');
});

// Admin Login 참조용
router.post('/login', (req, res) => {

    const { special_account, special_password } = req.body
    const options = {}
    options.where = {
      account : special_account,
      password : common.hash(special_password, 'ripemd160WithRSA')
    }

    authModel
        .login(options)
        .then(result => {
          if(_.eq(result, null)) return res.redirect('/login?error=auth_error_')
          const { permission } = result.dataValues
          req.session.passport = { 'auth' : 'true' }
          req.session.auth = authConvert(permission)
          res.redirect('/receipt')
        })
        .catch(error => {
          res.redirect('/login?error=unknown_error_')
        })
})

const authConvert = (param) => {
  switch (param) {
    case '6000' : return 'doctor'; break;
    case '7000' : return '3partLeader'; break;
    case '8000' : return 'pharmacist'; break;
    case '9000' : return 'super'; break;
  }
}


module.exports = router;
