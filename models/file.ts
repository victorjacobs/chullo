import * as mongoose from 'mongoose';

// Interface
interface IFile extends mongoose.Document {
    name: string;
}

// Schema
let schema = new mongoose.Schema({
    name: {
        type: String
    }
});

export var repository = mongoose.model<IFile>('File', schema);

// Class
export class File {
    private repository = repository;
    private document: IFile;

    constructor(document) {
        this.repository.create(document);
    }
}
