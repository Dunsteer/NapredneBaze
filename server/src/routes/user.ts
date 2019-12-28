import express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
import { authorizationHelper } from '../helpers/authorization';
import { IUser } from '../models/user';
import mime from 'mime';
const errorHelper = require('../helpers/error');
const User = require('../models/user');
import {userHelper} from '../helpers/userHelper';
const Team = require('./../models/team');
const nodemailer = require('nodemailer');
const Post = require('../models/post');
const path = require('path')

const multer = require('multer');

const upload = multer({ dest: __dirname + '../../../public/uploads/images' });

router.get('/', authorizationHelper.authorized, async (req, res) => {//da moze svako, ali samo ako da ID, ako je null, da ne dobije sve usere.
    try {
        let query = req.query;

        if (query.id) {
            let user = await User.findById(query.id).lean();
            await Team.populate(user, { path: 'teams' });
            await Post.populate(user, { path: 'posts', options: { sort: { 'created': -1 } } });

            let returnUser = userHelper.returnUser(user, req.isAdmin || req.currentUser.id == query.id);//ili self
            res.status(200).json(returnUser);
        } else {
            let users = await User.find({}).lean();

            return res.status(200).json(users);
        }
    }
    catch (error) {
        errorHelper.handleServerError(req, res, error);
    }
})

router.post('/', authorizationHelper.authorized, async (req, res) => {//ili self
    try {
        if (req['isAdmin'] || req.body._id == req['currentUser']._id) {

            let userData = req.body;

            let user = await User.findByIdAndUpdate(userData._id, userData, { new: true }).lean();

            await Team.populate(user, { path: 'teams' });
            await Post.populate(user, { path: 'posts', options: { sort: { 'created': -1 } } });

            let returnUser = userHelper.returnUser(user, true);

            return res.status(200).json(returnUser);
        }
        return res.status(401).send();
    }
    catch (error) {
        errorHelper.handleServerError(req, res, error);
    }
})

router.delete('/', authorizationHelper.isAdmin, async (req, res) => {
    try {
        let query = req.query;

        if (query._id) {
            const user = await User.findByIdAndDelete(query._id);

            return res.status(200).json(true);
        }
        throw new Error("No Id present");
    }
    catch (error) {
        errorHelper.handleServerError(req, res, error);
    }
})

router.post('/check-username', async (req, res) => {
    try {
        let userData = req.body;

        //const regex = new RegExp(["^", userData.username.toLowerCase(), "$"].join(""), "i");

        let user = await User.findOne({ username_lower: userData.username.toLowerCase() });

        if (!user) {
            return res.status(200).send({ 'valid': true });
        }
        else {
            return res.status(200).send({ 'valid': false });
        }
    }
    catch (error) {
        errorHelper.handleServerError(req, res, error);
    }
})

router.get('/get-current', authorizationHelper.authorized, async (req: any, res) => {

    let user = userHelper.returnUser(req.currentUser, true);

    res.status(200).json(user);
})

router.post('/request-password-reset', async (req, res) => {
    try {
        let userData = req.body;

        if (userData.email) {
            const user = await User.findOne({ email: userData.email });
            const word = userData.email;

            const current_date = (new Date()).valueOf().toString();
            const random = Math.random().toString();
            let hesh = crypto.createHash('sha1').update(current_date + random).digest('hex');

            user.passwordchange.hash = hesh;
            user.passwordchange.done = false;
            user.save();

            let mailText = `${userData.host}/password-reset/${hesh}`;

            //sendToMail(userData.email, mailText);

            sendToMail(userData.email, mailText);

            return res.status(200).send({ message: 'A password reset link has been sent to: ' + req.body.email + '.' });
        }
        throw new Error("No mail present");
    }
    catch (error) {
        errorHelper.handleServerError(req, res, error);
    }
})

router.post('/password-reset', async (req, res) => {
    try {
        let userData = req.body;

        if (userData.hash) {
            let user = await User.findOne({
                passwordchange: {
                    done: false,
                    hash: userData.hash
                }
            });

            if (user) {
                const hash = crypto.createHmac('sha512', user.username_lower);
                hash.update(userData.password);
                const value = hash.digest('hex');
                user.password = value;
                user.passwordchange.done = true;
                user.save();
                return res.status(200).send({ message: 'You have successfully reset your password. You can now login.' });
            }
        }
        throw new Error("Request a new link and try again.");
    }
    catch (error) {
        errorHelper.handleServerError(req, res, error);
    }
})

router.post('/upload', authorizationHelper.authorized, upload.single('photo'), async (req: any, res) => {
    try {
        const user: IUser = await User.findById(req.currentUser._id);

        user.avatarUrl = `uploads/images/${req.file.filename}`;

        user.save();
        return res.json(user.avatarUrl);
    }
    catch (error) {
        errorHelper.handleServerError(req, res, error);
    }
})


function sendToMail(mail: string, text: string) {
    var transporter = nodemailer.createTransport({

        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'codebindev@gmail.com',
            pass: 'codebin213'
        }
    });

    var mailOptions = {
        from: 'codebindev@gmail.com',
        to: mail,
        subject: 'CodeBin Password Reset Request',
        text: text
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            error ? reject(error) : resolve(info);
        });
    });
}

module.exports = router;