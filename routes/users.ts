import {Router} from 'express';

let router = Router();

// Get currently logged in user
router.get('/me', (req, res) => {
    console.log('User GET called');
});

router.post('/', (req, res) => {
    console.log('User POST called');
});

export = router;
