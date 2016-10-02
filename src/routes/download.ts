import { Router } from 'express';
import { File } from '../models/file';
import { AccessLog } from '../models/accessLog';

const router = Router();

router.get('/:fileId', (req, res) => {
    File.findById(req.params.fileId).then(file => {
        if (!file) {
            return Promise.reject('File not found');
        }

        // Create log entry
        const log = new AccessLog();
        log.fileId = file._id;
        log.referer = req.get('Referer');
        log.ip = req.get('X-Real-IP');
        log.kind = 'download';

        return log.save().then(() => {
            return file;
        });
    }, err => {
        res.status(400).json(err);
    }).then(file => {
        res.setHeader('Content-Type', file.mime!);
        res.setHeader('Content-Length', file.size!.toString());

        res.download(file.path!, file.name);
    }, err => {
        res.status(404).send({});
    });
});

export = router;
