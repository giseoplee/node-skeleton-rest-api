const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const redis = require('./redisService')

const _ = require('lodash')

const config = require('../config');

const PassportService = function(){};

// Passport 참조용
PassportService.Init = () => {

    passport.use(new GoogleStrategy({
          clientID : config.google.google_client_id,
          clientSecret : config.google.google_client_password,
          callbackURL : "/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {

            if(profile._json.domain) {
              return done(null, profile)
            } else {
              profile._json.domain = 'other.domain'
              done(null, false, {'message' : 'invalid domain'})
            }
        }
    ));
};

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

PassportService.passport = passport;
module.exports = PassportService;
