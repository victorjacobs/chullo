import { Router } from 'express';
import { File } from '../models/file';
import { AccessLog } from '../models/accessLog';

const router = Router();

router.get('/:fileId', (req, res) => {
    File.findById(req.params.fileId).then(file => {
        if (!file) {
            return Promise.reject({
                code: 404,
                msg: 'File not found',
            });
        }

        if (!file.size) {
            return Promise.reject({
                code: 404,
                msg: 'File uploading',
            });
        }

        // Increment accesses and create log entry
        const log = new AccessLog();
        log.fileId = file._id;
        log.referer = req.get('Referer');
        log.ip = req.get('X-Real-IP');
        log.kind = 'download';

        const fileUpdatePromise = File.findOneAndUpdate({_id: file._id}, {
            $currentDate: { lastAccess: true },
            $inc: { accesses: 1 },
        });

        return Promise.all([
            fileUpdatePromise,
            log.save(),
        ]);
    }).then(result => {
        const file = result[0];
        res.setHeader('Content-Type', file.mime);
        res.setHeader('Content-Length', file.size!.toString());

        res.download(file.path, file.name);
    }).catch(err => {
        const code = err.code ? err.code : 400;
        const msg = err.msg ? err.msg : undefined;
        res.status(code).send(msg);
    });
});

export = router;
