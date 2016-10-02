import * as passport from 'passport';
import * as bearer from 'passport-http-bearer';
let clientPassword = require('passport-oauth2-client-password');
let oauth2orize = require('oauth2orize');
import * as moment from 'moment';

import {User} from './models/user';
import {OAuthAccessToken} from './models/oauth/oauthAccessToken';
import {OAuthRefreshToken} from './models/oauth/oauthRefreshToken';
import {OAuthClient} from './models/oauth/oauthClient';

// Bearer strategy
passport.use(new bearer.Strategy(
    (token, done) => {
        OAuthAccessToken.findOne({ accessToken: token }).then(accessToken => {
            if (!accessToken) return done(null, false);

            if (moment(accessToken.expires).isBefore(moment())) {
                // token expired
                OAuthAccessToken.findById(accessToken._id).remove().exec();
                return done(null, false);
            }

            return User.findOne({ _id: accessToken.userId });
        }, err => {
            done(err);
        }).then(user => {
            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        });
    }
));

// Clientid and secret
passport.use(new clientPassword.Strategy(
    (clientId, clientSecret, done) => {
        OAuthClient.findOne({ clientId: clientId, clientSecret: clientSecret }).then(client => {
            if (!client) {
                return done(null, false);
            }

            return done(null, client);
        }).catch(err => {
            done({
                message: err,
                status: 400,
            });
        });
    }
));

// Create access/refresh token pair
// TODO change this so it returns a Promise instead of doing callback
const grantToken = (client, user, cb) => {
    const accessToken = OAuthAccessToken.newForClientAndUser(client, user);
    const refreshToken = OAuthRefreshToken.newForClientAndUser(client, user);
    Promise.all([
        accessToken.save(),
        refreshToken.save(),
    ]).then(result => {
        const savedAccessToken = result[0];

        // Manually round because momentjs uses floor instead of round
        return cb(null, accessToken.accessToken, refreshToken.refreshToken, {
            expires_in: Math.round(moment(savedAccessToken.expires).diff(moment(), 'seconds', true)),
        });
    }).catch(err => {
        cb(err);
    });
};

export const server = oauth2orize.createServer();
// Password grant
server.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {
    User.findWithPassword(username, password).then(user => {
        if (!user) {
            return done(null, false);
        }

        return grantToken(client, user, done);
    }).catch(err => {
        done({
            message: err,
            status: 401,
        });
    });
}));

// Refresh token grant
server.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {
    OAuthRefreshToken.findOne({ refreshToken: refreshToken }).then(token =>  {
        if (!token) {
            return done(null, false);
        }

        if (moment(token.expires).isBefore(moment())) {
            OAuthRefreshToken.findById(token._id).remove().exec();
            return done(null, false);
        }

        OAuthRefreshToken.findById(token._id).remove().exec();
        // TODO explicitly remove the access token?

        return grantToken(client, { _id: token.userId }, done);
    }).catch(err => {
        done({
            message: err,
            status: 401,
        });
    });
}));

export const isBearerAuthenticated = passport.authenticate('bearer', { session: false });
export const isClientAuthenticated = passport.authenticate('oauth2-client-password', { session: false });
