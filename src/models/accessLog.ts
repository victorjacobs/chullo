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
    date: {
        default: Date.now,
        required: true,
        type: Date,
    },
    fileId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
    },
    ip: String,
    kind: {
        required: true,
        type: String,
    },
    referer: String,
});

export const AccessLog = <IAccessLogModel> mongoose.model<IAccessLog>('AccessLog', schema);
