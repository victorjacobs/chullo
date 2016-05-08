import * as passport from 'passport';
import * as bearer from 'passport-http-bearer';
let clientPassword = require('passport-oauth2-client-password');
let oauth2orize = require('oauth2orize');
import * as moment from 'moment';

import {User} from './models/user';
import {OAuthAccessToken} from './models/oauth/oauthAccessToken';
import {OAuthRefreshToken} from './models/oauth/oauthRefreshToken';
import {OAuthClient} from './models/oauth/oauthClient';

passport.use(new bearer.Strategy(
    (token, done) => {
        console.log(token);
        OAuthAccessToken.findOne({ accessToken: token }, (err, accessToken) => {
            if (err) return done(err);
            if (!accessToken) return done(null, false);

            if (moment(accessToken.expires).isBefore(moment())) {
                // token expired
                OAuthAccessToken.findById(token).remove().exec();
                return done(null, false);
            }

            User.findOne({ _id: accessToken.userId }, (err, user) => {
                if (!user) return done(null, false);
                return done(null, user);
            });
        });
    }
));

passport.use(new clientPassword.Strategy(
    (clientId, clientSecret, done) => {
        OAuthClient.findOne({ clientId: clientId, clientSecret: clientSecret}, (err, client) => {
            if (err) return done(err);
            if (!client) return done(null, false);

            return done(null, client);
        });
    }
));

let grantToken = (client, user, cb) => {
    let accessToken = OAuthAccessToken.newForClientAndUser(client, user);
    let refreshToken = OAuthRefreshToken.newForClientAndUser(client, user);
    accessToken.save((err, token) => {
        if (err) return cb(err);
        refreshToken.save((err, token) => {
            if (err) return cb(err);
            return cb(null, accessToken.accessToken, refreshToken.refreshToken);
        });
    });
}

export let server = oauth2orize.createServer();
server.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {
    User.findWithPassword(username, password, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false);

        return grantToken(client, user, done);
    });
}));

server.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {
    OAuthRefreshToken.findOne({ refreshToken: refreshToken }, (err, token) => {
        if (err) return done(err);
        if (!token) return done(null, false);
        if (moment(token.expires).isBefore(moment())) {
            OAuthRefreshToken.findById(token._id).remove().exec();
            return done(null, false);
        }

        OAuthRefreshToken.findById(token._id).remove().exec();
        // TODO explicitly remove the access token?

        return grantToken(client, { _id: token.userId }, done);
    });
}));

export let isBearerAuthenticated = passport.authenticate('bearer', { session: false });
export let isClientAuthenticated = passport.authenticate('oauth2-client-password', { session: false });
