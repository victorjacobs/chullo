import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

// Typescript types
export interface IUser extends mongoose.Document {
    emailAddress: string;
    password: string;
    firstName?: string;
    lastName?: string;
    id: string;
};

interface IUserModel extends mongoose.Model<IUser> {
    findWithPassword(emailAddress: string, password: string): Promise<IUser>;
}

// Mongoose schema
let schema = new mongoose.Schema({
    emailAddress: {
        index: {
            unique: true,
        },
        required: true,
        type: String,
    },
    firstName: String,
    lastName: String,
    password: {
        required: true,
        type: String,
    },
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
    .static('findWithPassword', (emailAddress: string, password: string) => {
        return User.findOne({ emailAddress: emailAddress }).then(user => {
            if (!user) {
                return Promise.reject('User not found');
            }

            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, same) => {
                    if (err || !same) {
                        return reject('Password does not match');
                    }

                    return resolve(user);
                });
            });
        });
    })
;

export let User = <IUserModel> mongoose.model<IUser>('User', schema);
