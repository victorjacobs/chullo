import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

// Typescript types
export interface IUser extends mongoose.Document {
    emailAddress: string;
    password: string;
    firstName?: string;
    lastName?: string;
    id: string;
};

interface UserModel extends mongoose.Model<IUser> {
    findWithPassword(emailAddress: string, password: string, cb: (err: any, user?: IUser) => void): void;
}

// Mongoose schema
let schema = new mongoose.Schema({
    emailAddress: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String
})
    .pre('save', next => {
        let user: IUser = this;

        // On changing password, re-hash
        if (!user.isModified('password')) return next();

        bcrypt.hash(user.password, 8, (err, hashed) => {
            if (err) return next(err);
            user.password = hashed;
            next();
        });
    })
    .static('findWithPassword', (emailAddress: string, password: string, cb: (any, IUser?) => void) => {
        User.findOne({ emailAddress: emailAddress }, (err, user) => {
            if (err || _.isNull(user)) return cb(err, user);

            bcrypt.compare(password, user.password, (err, same) => {
                if (err || !same) return cb(err);

                cb(null, user);
            })
        });
    })
;

export let User = <UserModel> mongoose.model<IUser>('User', schema);
