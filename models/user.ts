import * as mongoose from 'mongoose';

interface IUser extends mongoose.Document {
    emailAddress: string;
    password: string;
    salt: string
};

let schema = new mongoose.Schema({
    emailAddress: String,
    password: String,
    salt: String
});


export User = mongoose.model<IUser>('User', schema);
