import * as mongoose from 'mongoose';

export interface IOAuthClient extends mongoose.Document {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    allowedGrantTypes: string[];
}

interface IOAuthClientModel extends mongoose.Model<IOAuthClient> {

}

let schema = new mongoose.Schema({
    allowedGrantTypes: [String],
    clientId: String,
    clientSecret: String,
    redirectUri: String,
});

export const OAuthClient = <IOAuthClientModel> mongoose.model<IOAuthClient>('OAuthClient', schema);
