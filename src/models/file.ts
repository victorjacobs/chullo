import * as mongoose from 'mongoose';

// Typescript
interface IFile extends mongoose.Document {
    name: string;   // Name of the file, e.g. foo.jpg
    path?: string;   // Path to file
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    size?: number;
    mime?: string;
    accesses: number;
    lastAccess?: Date;
}

interface IFileModel extends mongoose.Model<IFile> {

}

// Schema
let schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
    },
    userId: {
        type: String,
        required: true,
        index: true,
    },
    size: {
        type: Number,
    },
    mime: {
        type: String,
    },
    accesses: {
        type: Number,
        required: true,
        default: 0,
    },
    lastAccess: Date,
}, {
    toJSON: {
        versionKey: false,
    },
    timestamps: {},
});


export let File = <IFileModel> mongoose.model<IFile>('File', schema);
