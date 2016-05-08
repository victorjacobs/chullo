import {Router} from 'express';
import {File} from '../models/file';
import * as multer from 'multer';

var upload = multer({ dest: './uploads/' });
var router = Router();

router.post('/:fileId', upload.single('file'), (req, res) => {
    File.findOne({ _id: req.params.fileId, userId: req.user._id }, (err, file) => {
        if (err) return res.status(400).json(err);
        if (!file) return res.status(404).json({});

        if (file.path) return res.status(400).json({
            msg: 'File already uploaded'
        });

        if (!req.file) return res.status(400).json({
            msg: 'No file found in body'
        });

        File.findOneAndUpdate({ _id: file._id }, {
            size: req.file.size,
            path: req.file.path,
            mime: req.file.mimetype,
            name: req.file.originalname
        }, (err, newFile) => {
            if (err) return res.status(400).json(err);
            return res.json(newFile);
        });
    })
});

export = router;
