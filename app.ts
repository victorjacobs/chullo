import express = require('express');
import routes = require('./routes');


let app = express();

app.get('/', (req, res) => {
    res.send(routes.uploads.foo());
});

app.listen(3000);