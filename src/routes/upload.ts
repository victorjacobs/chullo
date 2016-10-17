import { Router } from 'express';
import { File } from '../models/file';
import * as multer from 'multer';
import rejectionUnpacker from '../response/rejectionUnpacker';

const upload = multer({ dest: './uploads/' });
const router = Router();

router.post('/:fileId', upload.single('file'), (req, res) => {
    File.findOne({ _id: req.params.fileId, userId: req.user._id }).then(file => {
        // TODO make reject objects proper classes
        if (!file) {
            return Promise.reject({
                code: 404,
                msg: 'File not found',
            });
        }

        if (file.path) {
            return Promise.reject({
                code: 400,
                msg: 'File already uploaded',
            });
        }

        if (!req.file) {
            return Promise.reject({
                code: 400,
                msg: 'No file found in body',
            });
        }

        return File.findOneAndUpdate({ _id: file._id }, {
            mime: req.file.mimetype,
            name: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
        });
    }).then(updatedFile => {
        res.send(updatedFile);
    }).catch(rejectionUnpacker(res));
});

export = router;
