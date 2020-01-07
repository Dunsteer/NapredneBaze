import express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
import { authorizationHelper } from '../helpers/authorization';
import { IUser } from '../models/user';

const errorHelper = require('../helpers/error');
import { userHelper } from '../helpers/userHelper';

import { driver } from './api';

const multer = require('multer');

const upload = multer({ dest: __dirname + '../../../public/uploads/images' });

router.get('/', async (req, res) => {//da moze svako, ali samo ako da ID, ako je null, da ne dobije sve usere.
    try {
        const session = driver.session();
        const result = await session.run("start n=node(*) return n")
        res.json(result.records);

        await session.close();
    }
    catch (error) {
        errorHelper.handleServerError(req, res, error);
    }
})

router.post('/', authorizationHelper.authorized, async (req, res) => {//ili self
    try {
        // if (req['isAdmin'] || req.body._id == req['currentUser']._id) {

        //     let userData = req.body;

        //     let user = await User.findByIdAndUpdate(userData._id, userData, { new: true }).lean();

        //     await Team.populate(user, { path: 'teams' });
        //     await Post.populate(user, { path: 'posts', options: { sort: { 'created': -1 } } });

        //     let returnUser = userHelper.returnUser(user, true);

        //     return res.status(200).json(returnUser);
        // }
        return res.status(401).send();
    }
    catch (error) {
        errorHelper.handleServerError(req, res, error);
    }
})

router.delete('/', authorizationHelper.isAdmin, async (req, res) => {
    try {
        // let query = req.query;

        // if (query._id) {
        //     const user = await User.findByIdAndDelete(query._id);

        //     return res.status(200).json(true);
        // }
        // throw new Error("No Id present");
    }
    catch (error) {
        errorHelper.handleServerError(req, res, error);
    }
})

router.post('/check-username', async (req, res) => {
    try {
        // let userData = req.body;

        // //const regex = new RegExp(["^", userData.username.toLowerCase(), "$"].join(""), "i");

        // let user = await User.findOne({ username_lower: userData.username.toLowerCase() });

        // if (!user) {
        //     return res.status(200).send({ 'valid': true });
        // }
        // else {
        //     return res.status(200).send({ 'valid': false });
        // }
    }
    catch (error) {
        errorHelper.handleServerError(req, res, error);
    }
})

module.exports = router;