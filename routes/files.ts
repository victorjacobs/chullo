/**
 * Created by Victor on 11/01/16.
 */

import {Router} from 'express';
import {File} from '../models/file';

let router = Router();

router.get('/', (req, res) => {
    File.find({ userId: req.user._id }, (err, results) => {
        res.json(results);
    })
});

router.get('/:id', (req, res) => {
    res.json(File.findOne(req.params.id));
});

// Create upload entity
router.post('/', (req, res) => {
    let newFile = new File(req.body);
    newFile.userId = req.user._id;

    newFile.save((err, doc) => {
        if (err) return res.status(400).json(err);
        res.json(newFile.toJSON());
    });
});

export = router;
