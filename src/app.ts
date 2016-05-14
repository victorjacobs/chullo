import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as mongoose from 'mongoose';
import * as oauth from './oauth';

import {User} from './models/user';

import * as routes from './routes';

// Boot
let app = express();
mongoose.connect('mongodb://localhost/chullo');

// Compression
app.use(compression());

// Set return content type to json
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// TODO make empty responses consistent by using middleware

// Mount routes
app.use('/d', routes.download);
app.use('/v', routes.view);
// bodyParser.urlencoded({ extended: true })
app.all('/oauth/token', bodyParser.urlencoded({ extended: true }), oauth.isClientAuthenticated, oauth.server.token(), oauth.server.errorHandler());
app.use('/upload', oauth.isBearerAuthenticated, routes.upload);

// Body parsing
app.use(bodyParser.json());
app.use('/files', oauth.isBearerAuthenticated, routes.files);
app.use('/users', oauth.isBearerAuthenticated, routes.users);
app.use('/status', oauth.isBearerAuthenticated, routes.status);

// app.use(oauth.errorHandler());

// Boot server
app.listen(3000);
