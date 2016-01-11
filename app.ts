import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as routes from './routes';

let app = express();

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
routes.upload(app);
routes.files(app);

// Boot server
app.listen(3000);