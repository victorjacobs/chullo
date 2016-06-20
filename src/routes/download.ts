import {Router} from 'express';
import {File} from '../models/file';
import * as fs from 'fs';

let router = Router();

router.get('/:fileId', (req, res) => {
    File.findById(req.params.fileId, (err, file) => {
        if (err) return res.status(400).json(err);

        res.download(file.path, file.name);
    });
});

export = router;
