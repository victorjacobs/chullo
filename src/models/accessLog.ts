import * as mongoose from 'mongoose';

export interface IAccessLog extends mongoose.Document {
    ip?: string;
    referer?: string;
    fileId: string;
    date: Date;
    kind: string;
}

interface IAccessLogModel extends mongoose.Model<IAccessLog> {

}

let schema = new mongoose.Schema({
    ip: String,
    referer: String,
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    kind: {
        type: String,
        required: true,
    },
});

export let AccessLog = <IAccessLogModel> mongoose.model<IAccessLog>('AccessLog', schema);
