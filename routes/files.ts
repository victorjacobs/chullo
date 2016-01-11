import {Express} from "express";
/**
 * Created by Victor on 11/01/16.
 */

var setup = (app: Express): void => {
    app.get('/files', (req, res) => {
        res.send('Hello world');
    });

    app.get('/files/{:id}', (req, res) => {

    });

    // Create upload entity
    app.post('/files', (req, res) => {
        let upload = req.body;

        res.json(upload);
    });
};

export = setup;