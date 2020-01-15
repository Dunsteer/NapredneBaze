import express = require('express');

import AuthentificationController from './authentification';
import CompanyController from './company';
const router = express.Router();
const chalk = require('chalk');

const neo4j = require('neo4j-driver');

export const driver = neo4j.driver('bolt://localhost:7687');

// const mongoose = require('mongoose');
// const db = "mongodb://dunster:password1@ds357955.mlab.com:57955/code-bins-db";

const authentification = require('./authentification');
const user = require('./user');

const log = console.log;
//const highlight = require('./highlight');

// mongoose.connect(db, { useNewUrlParser: true, useFindAndModify: false }, (err: Error) => {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log("Connected to mongodb");
//     }
// });

router.all('*', (req, res, next) => {
    log(chalk.green(req.method), chalk.blue(req.url));

    next();
})

router.get('/', (req: any, res: any) => {
    res.send('Wellcome to the API.');
});

router.use('/authentification', new AuthentificationController().router);
router.use('/companies', new CompanyController().router);
router.use('/users', user);


module.exports = router;