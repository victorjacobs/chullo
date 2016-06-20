import {IUser} from '../user';
import {IOAuthClient} from './oauthClient';

import * as mongoose from 'mongoose';
import * as moment from 'moment';
let rack = require('hat').rack();

interface IOAuthRefreshToken extends mongoose.Document {
    refreshToken: string;
    clientId: string;
    userId: string;
    expires: Date;
}

interface IOAuthRefreshTokenModel extends mongoose.Model<IOAuthRefreshToken> {
    newForClientAndUser(client: IOAuthClient, user: IUser): IOAuthRefreshToken;
}

let setRequiredDefaults = (token: IOAuthRefreshToken) => {
    if (!token.refreshToken) {
        token.refreshToken = rack();
    }

    if (!token.expires) {
        token.expires = moment().add(1, 'weeks').toDate();
    }
};

let schema = new mongoose.Schema({
    refreshToken: {
        index: {
            unique: true,
        },
        required: true,
        type: String,
    },
    clientId: {
        required: true,
        type: String,
    },
    userId: {
        required: true,
        type: String,
    },
    expires: {
        required: true,
        type: Date,
    },
})
    .pre('save', next => {
        let token: IOAuthRefreshToken = this;
        setRequiredDefaults(token);
        next();
    })
    .static('newForClientAndUser', (client: IOAuthClient, user: IUser) => {
        let newRefreshToken: IOAuthRefreshToken = new OAuthRefreshToken();
        newRefreshToken.clientId = client._id;
        newRefreshToken.userId = user._id;
        setRequiredDefaults(newRefreshToken);
        return newRefreshToken;
    })
;

export let OAuthRefreshToken = <IOAuthRefreshTokenModel> mongoose.model<IOAuthRefreshToken>('OAuthRefreshToken', schema);
