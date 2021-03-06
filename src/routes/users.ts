import { Router } from 'express';
import * as bcrypt from 'bcrypt';

import { User } from '../models/user';

const router = Router();

// Get currently logged in user
router.get('/me', (req, res) => {
    res.json(req.user);
});

router.post('/', (req, res) => {
    console.log('User POST called');
    res.json(null);
});

router.put('/me', (req, res) => {
    bcrypt.hash(req.body.password, 8, (err, hashed) => {
        if (err) return res.status(400).json(err);
        User.findOneAndUpdate({ _id: req.user._id }, {
            password: hashed,
        }).then(updatedUser => {
            res.json(updatedUser);
        }, saveErr => {
            res.status(400).send(saveErr);
        });
    });
});

export = router;
