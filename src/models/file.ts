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
    accesses: {
        default: 0,
        required: true,
        type: Number,
    },
    lastAccess: Date,
    mime: {
        type: String,
    },
    name: {
        required: true,
        type: String,
    },
    path: {
        type: String,
    },
    size: {
        type: Number,
    },
    userId: {
        index: true,
        required: true,
        type: String,
    },
}, {
    timestamps: {},
    toJSON: {
        versionKey: false,
    },
});

export const File = <IFileModel> mongoose.model<IFile>('File', schema);
