import * as mongoose from 'mongoose';

interface IOAuthAccessToken extends mongoose.Document {
    accessToken: string;
    clientId: string;
    userId: string;
    expires: Date;
}

let schema = new mongoose.Schema({
    accessToken: String,
    clientId: String,
    userId: String,
    expires: Date
});

export let OAuthAccessToken = mongoose.model<IOAuthAccessToken>('OAuthAccessToken', schema);
