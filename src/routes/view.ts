import { Router } from 'express';
import { File } from '../models/file';
import * as fs from 'fs';
import { AccessLog } from '../models/accessLog';

// TODO typings
const sharp = require('sharp');

const router = Router();

router.get('/:fileId', (req, res) => {
    File.findById(req.params.fileId).then(file => {
        if (!file) {
            return Promise.reject({
                code: 404,
                msg: 'File not found',
            });
        }

        // When file size not set, the file is still in transit
        // TODO serve nice html page
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
        log.kind = 'view';

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
        res.setHeader('Content-Disposition', `inline; filename="${file.name}"`);
        res.setHeader('Content-Length', file.size.toString());

        let fileStream = fs.createReadStream(file.path);

        fileStream.pipe(res);
    }).catch(err => {
        const code = err.code ? err.code : 400;
        const msg = err.msg ? err.msg : undefined;
        res.status(code).send(msg);
    });
});

router.get('/:fileId/thumb', (req, res) => {
    const thumbPath = (filePath: string) => {
        return `${filePath}_thumb`;
    };

    File.findById(req.params.fileId).then(file => {
        if (!file) {
            return Promise.reject({
                code: 404,
                msg: 'File not found',
            });
        }

        // For now only do things with images
        if (!file.mime || !file.mime.startsWith('image')) {
            return Promise.reject({
                code: 204,
            });
        }

        try {
            fs.accessSync(thumbPath(file.path!));
        } catch (e) {
            // Generate thumb
            return sharp(file.path)
                .resize(200, 200)
                .crop(sharp.gravity.center)
                .png()
                .toFile(thumbPath(file.path!)).then(() => {
                    return file;
                })
            ;
        }

        return file;
    }).then((file) => {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `inline; filename="${file.name}"`);
        const stat = fs.statSync(thumbPath(file.path));
        res.setHeader('Content-Length', stat.size.toString());

        let fileStream = fs.createReadStream(thumbPath(file.path));

        fileStream.pipe(res);
    }).catch(err => {
        const code = err.code ? err.code : 400;
        const msg = err.msg ? err.msg : undefined;
        res.status(code).send(msg);
    });
});

export = router;
