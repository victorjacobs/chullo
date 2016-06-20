import * as mongoose from 'mongoose';
import {IOAuthClient} from './oauthClient';
import {IUser} from '../user';

import * as moment from 'moment';
let rack = require('hat').rack();

interface IOAuthAccessToken extends mongoose.Document {
    accessToken: string;
    clientId: string;
    userId: string;
    expires: Date;
}

interface IOAuthAccessTokenModel extends mongoose.Model<IOAuthAccessToken> {
    newForClientAndUser(client: IOAuthClient, user: IUser): IOAuthAccessToken;
}

let setRequiredDefaults = (token: IOAuthAccessToken) => {
    if (!token.accessToken) {
        token.accessToken = rack();
    }

    if (!token.expires) {
        token.expires = moment().add(1, 'days').toDate();
    }
};

let schema = new mongoose.Schema({
    accessToken: {
        type: String,
        required: true,
        index: {
            unique: true
        },
    },
    clientId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    }
})
    .pre('save', next => {
        let token: IOAuthAccessToken = this;
        setRequiredDefaults(this);
        next();
    })
    .static('newForClientAndUser', (client: IOAuthClient, user: IUser) => {
        let newAccessToken: IOAuthAccessToken = new OAuthAccessToken();
        newAccessToken.clientId = client._id;
        newAccessToken.userId = user._id;
        // Set defaults here too so that the thing calling this has access to them
        setRequiredDefaults(newAccessToken);
        return newAccessToken;
    })
;

export let OAuthAccessToken = <IOAuthAccessTokenModel> mongoose.model<IOAuthAccessToken>('OAuthAccessToken', schema);
