import 'source-map-support/register';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as oauth from './oauth';

import * as routes from './routes';

// Boot
const app = express();
(mongoose as any).Promise = Promise;
mongoose.connect(`mongodb://${process.env.MONGO_HOST || 'localhost'}/chullo`);

// TODO make empty responses consistent by using middleware

// Mount routes
app.use('/d', routes.download);
app.use('/v', routes.view);
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
