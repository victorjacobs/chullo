/**
 * Created by Victor on 11/01/16.
 */

import {Router} from 'express';
import * as file from '../models/file';

let router = Router();

router.get('/', (req, res) => {
    res.send('Hello world');
});

router.get('/{:id}', (req, res) => {

});

// Create upload entity
router.post('/', (req, res) => {
    let test = new file.repository({name: 'test'});
    test.save((err) => {
        res.json(test);
    });
});

export = router;
