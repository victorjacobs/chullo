import {Router} from 'express';
import {File} from '../models/file';
import * as fs from 'fs';
import {AccessLog} from '../models/accessLog';

let router = Router();

router.get('/:fileId', (req, res) => {
    File.findById(req.params.fileId, (err, file) => {
        if (err) return res.status(400).json(err);
        if (!file) return res.status(404).send('Not found');

        // When file size not set, the file is still in transit
        // TODO serve nice html page
        if (!file.size) return res.status(404).send('File uploading');

        // Increment accesses
        File.findOneAndUpdate({_id: file._id}, {
            $inc: { accesses: 1 },
            $currentDate: { lastAccess: true }
        }, (err, doc) => {
            if (err) {
                // Soft fail, just log to console
                console.log(err);
            }
        });

        // Create log entry
        let log = new AccessLog();
        log.fileId = file._id;
        log.referer = req.get('Referrer');
        log.ip = req.ip;
        log.kind = 'view';

        log.save((err, doc) => {
            if (err) {
                // Soft fail, just log to console
                console.log(err);
            }
        });

        res.setHeader('Content-Type', file.mime);
        res.setHeader('Content-Disposition', `inline; filename="${file.name}"`);
        res.setHeader('Content-Length', file.size.toString());

        let fileStream = fs.createReadStream(file.path);

        fileStream.pipe(res);
    });
});

export = router;
