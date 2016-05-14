import {Router} from 'express';
import {File} from '../models/file';
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
                    $sum: "$size"
                }
            }
        }, (err, aggregate) => {
            result.totalSize = aggregate[0].totalSize;
            resolve();
        });
    });

    Promise.all([
        countPromise,
        totalSizePromise
    ]).then(() => {
        res.json(result)
    });
});

export = router;
