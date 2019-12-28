import express = require('express');

import AuthentificationController from './authentification';
const router = express.Router();
const chalk = require('chalk');


const mongoose = require('mongoose');
const db = "mongodb://dunster:password1@ds357955.mlab.com:57955/code-bins-db";

const authentification = require('./authentification');
const user = require('./user');

const log = console.log;
//const highlight = require('./highlight');

mongoose.connect(db, { useNewUrlParser: true, useFindAndModify: false }, (err: Error) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Connected to mongodb");
    }
});

router.all('*', (req, res, next) => {
    log(chalk.green(req.method), chalk.blue(req.url));

    next();
})

router.get('/', (req: any, res: any) => {
    res.send('Wellcome to the API.');
});

router.use('/authentification', new AuthentificationController().router);
router.use('/user', user);


module.exports = router;