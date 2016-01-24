import * as mongoose from 'mongoose';

interface IUser extends mongoose.Document {
    emailAddress: string;
    password: string;
    salt: string;
    firstName: string;
    lastName: string;
};

let schema = new mongoose.Schema({
    emailAddress: String,
    password: String,
    salt: String,
    firstName: String,
    lastName: String
});


export let User = mongoose.model<IUser>('User', schema);
