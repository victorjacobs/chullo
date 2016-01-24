import * as mongoose from 'mongoose';

interface IOAuthRefreshToken extends mongoose.Document {
    refreshToken: string;
    clientId: string;
    userId: string;
    expires: Date;
}

let schema = new mongoose.Schema({
    refreshToken: String,
    clientId: String,
    userId: String,
    expires: Date
});

export let OAuthRefreshToken = mongoose.model<IOAuthRefreshToken>('OAuthRefreshToken', schema);
