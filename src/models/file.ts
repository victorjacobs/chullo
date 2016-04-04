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
}

interface FileModel extends mongoose.Model<IFile> {

}

// Schema
let schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    size: {
        type: Number
    },
    mime: {
        type: String
    }
}, {
    toJSON: {
        versionKey: false
    },
    timestamps: {}
})
;


export let File = <FileModel> mongoose.model<IFile>('File', schema);
