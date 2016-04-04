import {Router} from 'express';
import * as bcrypt from 'bcrypt';

let router = Router();

// Get currently logged in user
router.get('/me', (req, res) => {
    res.json(req.user);
});

router.post('/', (req, res) => {
    console.log('User POST called');
    res.json(null);
});

export = router;
