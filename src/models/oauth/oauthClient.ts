import * as mongoose from 'mongoose';

export interface IOAuthClient extends mongoose.Document {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    allowedGrantTypes: string[];
}

let schema = new mongoose.Schema({
    clientId: String,
    clientSecret: String,
    redirectUri: String,
    allowedGrantTypes: [String]
});

export let OAuthClient = mongoose.model<IOAuthClient>('OAuthClient', schema);
