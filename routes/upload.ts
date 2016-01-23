/**
 * Uploading files
 */

import {Router} from 'express';
import * as multer from 'multer';

var upload = multer({ dest: 'uploads/' });
var router = Router();

router.post('/', upload.single('randomfilename'), (res, req) => {

});

export = router;
