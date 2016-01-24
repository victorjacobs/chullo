import {OAuthAccessToken} from './oauth/oauthAccessToken';
import {OAuthRefreshToken} from './oauth/oauthRefreshToken';
import {OAuthClient} from './oauth/oauthClient';
import {User} from './user';
import * as _ from 'lodash';

var model = module.exports;

model.getAccessToken = (bearerToken, callback) => {
    OAuthAccessToken.findOne({ accessToken: bearerToken }, callback);
};

model.getClient = (clientId, clientSecret, callback) => {
    if (clientSecret === null) {
        return OAuthClient.findOne({ clientId: clientId }, callback);
    }

    OAuthClient.findOne({ clientId: clientId, clientSecret: clientSecret }, callback);
};

model.grantTypeAllowed = (clientId, grantType, callback) => {
    OAuthClient.findOne({ clientId: clientId }, (err, client) => {
        callback(false, _.includes(client.allowedGrantTypes, grantType));
    });
};

model.saveAccessToken = (token, clientId, expires, userId, callback) => {
    let newAccessToken = new OAuthAccessToken({
        accessToken: token,
        clientId: clientId,
        userId: userId,
        expires: expires
    });

    newAccessToken.save(callback);
};

model.getUser = (username, password, callback) => {
    User.findWithPassword(username, password, callback);
};

model.saveRefreshToken = (token, clientId, expires, userId, callback) => {
    let refreshToken = new OAuthRefreshToken({
        refreshToken: token,
        clientId: clientId,
        userId: userId,
        expires: expires
    });

    refreshToken.save(callback);
};

model.getRefreshToken = (refreshToken, callback) => {
    console.log('in getRefreshToken (refreshToken: ' + refreshToken + ')');

    OAuthRefreshToken.findOne({ refreshToken: refreshToken }, (err, token) => {
        console.log(token);
        callback(err, token);
    });
};

model.revokeRefreshToken = (refreshToken, callback) => {
    OAuthRefreshToken.remove({ refreshToken: refreshToken }, callback);
}
