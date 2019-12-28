import express = require('express');
const crypto = require('crypto');

const errorHelper = require('./../helpers/error');
const User = require('../models/user');
import { userHelper } from '../helpers/userHelper'
import { BaseController } from './baseController';
import { IUser } from '../models/user';
import { IRequest } from '../helpers/request';

export default class AuthenticationController extends BaseController {

    constructor() {
        super();
    }

    protected bindToRouter() {
        this.router.post('/register', this.registerPost.bind(this));
        this.router.post('/login', this.loginPost.bind(this));
    }

    protected async registerPost(req: express.Request, res: express.Response) {
        try {
            let userData = req.body;

            //const regex = new RegExp(["^", userData.username.toLowerCase(), "$"].join(""), "i");

            let user = await User.findOne({ username_lower: userData.username.toLowerCase() });

            if (!user) {
                let newUser: IUser = new User(userData);
                newUser.username = newUser.username.toLowerCase();

                const hash = crypto.createHmac('sha512', newUser.username);
                hash.update(newUser.password);
                const value = hash.digest('hex');

                newUser.password = value;

                const registeredUser: IUser = await newUser.save();

                let token = this.getToken(registeredUser);

                res.status(200).send({ token });
            }
            else {
                res.status(401).send('User already exists.');
            }
        } catch (error) {
            errorHelper.handleServerError(req, res, error);
        }
    }

    protected async loginPost(req: express.Request, res: express.Response) {
        try {
            let userData = req.body;

            const regex = new RegExp(["^", userData.username.toLowerCase(), "$"].join(""), "i");

            let user: IUser = await User.findOne({ username_lower: userData.username.toLowerCase() });

            if (!user) {
                res.status(401).send('Invalid username or password.');
            }
            else {
                const hash = crypto.createHmac('sha512', userData.username.toLowerCase());
                hash.update(userData.password);
                const value = hash.digest('hex');

                if (value !== user.password) {
                    return res.status(401).send('Invalid username or password.');
                }
                else {
                    let token = this.getToken(user);
                    let returnUser = userHelper.returnUser(user);

                    return res.status(200).send({ token, user: returnUser });
                }
            }
        } catch (error) {
            errorHelper.handleServerError(req, res, error);
        }
    }
}