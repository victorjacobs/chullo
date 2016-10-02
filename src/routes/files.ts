import { Router } from 'express';
import { File } from '../models/file';
import * as fs from 'fs';

const router = Router();

router.get('/', (req, res) => {
    // TODO pagination
    File.find({ userId: req.user._id }, '-userId -path').then(files => {
        res.json(files);
    });
});

router.get('/:fileId', (req, res) => {
    File.findOne({ _id: req.params.fileId, userId: req.user._id }, '-_id -userId -path').then(file => {
        if (!file) {
            res.status(404).json({});
            return;
        }

        res.json(file);
    }, err => {
        res.status(400).send(err);
    });
});

// Create upload entity
// TODO make sure that hidden fields are not saved (e.g. size)
router.post('/', (req, res) => {
    const newFile = new File(req.body);
    newFile.userId = req.user._id;

    newFile.save().then(doc => {
        res.status(201).send(doc);
    }, err => {
        res.status(400).send(err);
    });
});

router.delete('/:fileId', (req, res) => {
    File.findOneAndRemove({ _id: req.params.fileId, userId: req.user._id }).then(file => {
        fs.unlinkSync(file.path!);
        res.status(204).send({});
    }, err => {
        res.status(400).send(err);
    });
});

export = router;
