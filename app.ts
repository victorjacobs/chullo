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

// Body parsing
app.use(bodyParser.json());

// Set return content type to json
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// OAuth
let oauth = oauthserver({
  model: require('./models/oauth'),
  grants: ['password', 'refresh_token']
});

// TODO move this to another file
let injectUser = (req, res, next) => {
    User.findOne({ _id: req.user.id }, (err, user) => {
        req.user = user;
        next();
    });
}

// Mount routes
app.all('/oauth/token', bodyParser.urlencoded({
  extended: true
}), oauth.grant());
app.use('/upload', routes.upload);
app.use('/files', oauth.authorise(), injectUser, routes.files);
app.use('/users', oauth.authorise(), injectUser, routes.users);

app.use(oauth.errorHandler());

// Boot server
app.listen(3000);
