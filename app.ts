import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as mongoose from 'mongoose';

import * as routes from './routes';

// Boot
let app = express();
mongoose.connect('mongodb://localhost/chullo');

// Compression
app.use(compression());

// Body parsing
app.use(bodyParser.json());

// Set return content type to json
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Set up routes
app.use('/upload', routes.upload);
app.use('/files', routes.files);

// Boot server
app.listen(3000);
