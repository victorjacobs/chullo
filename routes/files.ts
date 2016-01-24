/**
 * Created by Victor on 11/01/16.
 */

import {Router} from 'express';
import {File} from '../models/file';

let router = Router();

router.get('/', (req, res) => {
    res.json({
        'foo': 'bar'
    });
});

router.get('/:id', (req, res) => {
    res.json(File.findOne(req.params.id));
});

// Create upload entity
router.post('/', (req, res) => {
    let newFile = new File(req.body);

    newFile.save();

    res.json(newFile);
});

export = router;
