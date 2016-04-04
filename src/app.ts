import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as mongoose from 'mongoose';
var oauthserver = require('oauth2-server');

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

// OAuth
let oauth = oauthserver({
  model: require('./oauth'),
  grants: ['password', 'refresh_token']
});

// TODO move this to another file
let injectUser = (req, res, next) => {
    User.findOne({ _id: req.user.id }, (err, user) => {
        req.user = user;
        next();
    });
};

// TODO make empty responses consistent by using middleware

// Mount routes
app.use('/d', routes.download);
app.use('/v', routes.view);
app.all('/oauth/token', bodyParser.urlencoded({
    extended: true
}), oauth.grant());
app.use('/upload', oauth.authorise(), injectUser, routes.upload);

// Body parsing
app.use(bodyParser.json());
app.use('/files', oauth.authorise(), injectUser, routes.files);
app.use('/users', oauth.authorise(), routes.users);

app.use(oauth.errorHandler());

// Boot server
app.listen(3000);
