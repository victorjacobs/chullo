import {Router} from 'express';
import {File} from '../models/file';

let router = Router();

router.get('/:fileId', (req, res) => {
    File.findById(req.params.fileId, (err, file) => {
        if (err) return res.status(400).json(err);

        // No idea why res.download wouldn't set the following headers but okay
        res.setHeader('Content-Type', file.mime);
        res.setHeader('Content-Length', file.size.toString());

        res.download(file.path, file.name);
    });
});

export = router;
