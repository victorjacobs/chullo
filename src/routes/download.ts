import {Router} from 'express';
import {File} from '../models/file';
import {AccessLog} from '../models/accessLog';

let router = Router();

router.get('/:fileId', (req, res) => {
    File.findById(req.params.fileId, (err, file) => {
        if (err) return res.status(400).json(err);

        // Create log entry
        let log = new AccessLog();
        log.fileId = file._id;
        log.referer = req.get('Referer');
        log.ip = req.get('X-Real-IP');
        log.kind = 'download';

        log.save((err, doc) => {
            if (err) {
                // Soft fail, just log to console
                console.log(err);
            }
        });

        // No idea why res.download wouldn't set the following headers but okay
        res.setHeader('Content-Type', file.mime);
        res.setHeader('Content-Length', file.size.toString());

        res.download(file.path, file.name);
    });
});

export = router;
