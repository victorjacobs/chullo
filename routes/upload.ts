import {Express} from 'express';
import * as multer from 'multer';

var upload = multer({ dest: 'uploads/' });

var setup = (app: Express): void => {
    app.post('/upload', upload.single('randomfilename'), (res, req) => {

    });
};

export = setup;