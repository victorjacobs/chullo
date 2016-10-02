import { Router } from 'express';
import { File } from '../models/file';

let router = Router();

router.get('/', (req, res) => {
    let result: any = {};

    const countPromise = File.count({}).then(count => {
        result.files = count;
    });

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
    }).then(aggregate => {
        result.totalSize = (aggregate[0] as any).totalSize;
        result.totalTraffic = (aggregate[0] as any).totalTraffic;
        result.totalAccesses = (aggregate[0] as any).totalAccesses;
    });

    Promise.all([
        countPromise,
        totalSizePromise,
    ]).then(() => {
        res.json(result);
    });
});

export = router;
