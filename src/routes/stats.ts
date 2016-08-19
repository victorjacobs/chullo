import {Router} from 'express';
import {File} from '../models/file';
import {AccessLog} from '../models/accessLog';
import {Promise} from 'es6-promise';

let router = Router();

router.get('/', (req, res) => {
    let result: any = {};

    let countPromise = new Promise((resolve, reject) => {
        File.count({}, (err, count) => {
            result.files = count;
            resolve();
        });
    });

    let totalSizePromise = new Promise((resolve, reject) => {
        File.aggregate({
            $group: {
                _id: null,
                totalSize: {
                    $sum: '$size',
                },
                totalAccesses: {
                    $sum: '$accesses',
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
        }, (err, aggregate) => {
            if (err) return reject(err);
            result.totalSize = aggregate[0].totalSize;
            result.totalTraffic = aggregate[0].totalTraffic;
            result.totalAccesses = aggregate[0].totalAccesses;
            resolve();
        });
    });

    Promise.all([
        countPromise,
        totalSizePromise,
    ]).then(() => {
        res.json(result);
    });
});

export = router;
