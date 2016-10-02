import { Router } from 'express';
import { File } from '../models/file';
import * as fs from 'fs';

let router = Router();

router.get('/', (req, res) => {
    const versionPath = `${__dirname}/../VERSION`;

    const countPromise = File.count({});

    const totalSizePromise = File.aggregate({
        $group: {
            _id: null,
            totalAccesses: {
                $sum: '$accesses',
            },
            totalSize: {
                $sum: '$size',
            },
            totalTraffic: {
                $sum: {
                    $multiply: [
                        '$accesses',
                        '$size',
                    ],
                },
            },
        },
    });

    const readVersionPromise = new Promise((resolve, reject) => {
        fs.readFile(versionPath, (err, data) => {
            if (err) {
                console.log(err);
                resolve(undefined);
            } else {
                resolve(data);
            }
        });
    });

    const statVersionPromise = new Promise((resolve, reject) => {
        fs.stat(versionPath, (err, data) => {
            if (err) {
                console.log(err);
                resolve(undefined);
            } else {
                resolve(data);
            }
        });
    });

    Promise.all([
        countPromise,
        totalSizePromise,
        readVersionPromise,
        statVersionPromise,
    ]).then(result => {
        const count = result[0];
        const totalSize = result[1];
        const version = result[2];
        const versionStat = result[3];

        res.json({
            builtOn: versionStat ? (versionStat as any).mtime : undefined,
            files: count,
            totalAccesses: (totalSize[0] as any).totalAccesses,
            totalSize: (totalSize[0] as any).totalSize,
            totalTraffic: (totalSize[0] as any).totalTraffic,
            version: version ? (version as any).toString().trim() : undefined,
        });
    });
});

export = router;
