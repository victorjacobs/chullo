import {Router} from 'express';
import {File} from '../models/file';

let router = Router();

router.get('/', (req, res) => {
    // TODO pagination
    File.find({ userId: req.user._id }, '-userId', (err, results, next) => {
        if (err) return res.status(400).json(err);
        if (results.length === 0) return res.status(204);

        res.json(results);
    })
});

router.get('/:fileId', (req, res, next) => {
    File.findOne({ _id: req.params.fileId, userId: req.user._id }, '-_id -userId -path', (err, file) => {
        if (err) return res.status(400).json(err);
        if (!file) return res.status(404).json({});

        res.json(file);
        next();
    });
});

// Create upload entity
// TODO make sure that hidden fields are not saved (e.g. size)
router.post('/', (req, res) => {
    let newFile = new File(req.body);
    newFile.userId = req.user._id;

    newFile.save((err, doc) => {
        if (err) return res.status(400).json(err);
        res.json(newFile.toJSON());
    });
});

export = router;
