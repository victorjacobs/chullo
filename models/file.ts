import * as mongoose from 'mongoose';

// Interface
interface IFile extends mongoose.Document {
    name: string;
}

// Schema
let schema = new mongoose.Schema({
    name: String
});

let repository = mongoose.model<IFile>('File', schema);

// Class
export class File {
    private document: IFile;

    constructor(file) {
        this.document = new repository(file);
    }

    save() {
        return this.document.save();
    }

    static findOne(id: string) {
        return repository.findOne(id);
    }
}
