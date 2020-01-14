import express = require('express');
const crypto = require('crypto');

const errorHelper = require('./../helpers/error');
const User = require('../models/user');
import { userHelper } from '../helpers/userHelper'
import { BaseController } from './baseController';
import { IUser } from '../models/user';
import { IRequest } from '../helpers/request';

import * as d from 'neo4j-driver';

import { driver } from './api';

const jwt = require('jsonwebtoken');

export default class AuthenticationController extends BaseController {

    constructor() {
        super();
    }

    protected bindToRouter() {
        this.router.post('/register', this.registerPost.bind(this));
        this.router.post('/login', this.loginPost.bind(this));
        this.router.post('/check', this.checkPost.bind(this));
    }

    protected async registerPost(req: express.Request, res: express.Response) {
        try {
            let userData = req.body;

            console.log(userData);

            const session = driver.session();
            const user = await session.run(`match(u:user {username:"${userData.username.toLowerCase()}"}) return u`);

            if (user.records.length == 0) {
                const user = (await session.run(`create (u:user {username:"${userData.username}",password:"${userData.password}"}) return u`)).records[0] as d.Record;

                let token = this.getToken(user.toObject());

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

            const session = driver.session();
            const query = `match (u:user {username:"${userData.username.toLowerCase()}"}) return u`;
            let user = ((await session.run(query)));

            if (user.records) {
                user = user.records[0].toObject();
            }

            //const regex = new RegExp(["^", userData.username.toLowerCase(), "$"].join(""), "i");

            //let user: IUser = await User.findOne({ username_lower: userData.username.toLowerCase() });

            if (!user) {
                res.status(401).send('Invalid username or password.');
            }
            else {
                //const hash = crypto.createHmac('sha512', userData.username.toLowerCase());
                //hash.update(userData.password);
                //const value = hash.digest('hex');


                if (userData.password !== user.u.properties.password) {
                    return res.status(401).send('Invalid username or password.');
                }
                else {
                    let token = this.getToken(user);
                    let returnUser = userHelper.returnUser(user.u.properties);

                    return res.status(200).send({ token, user: returnUser });
                }
            }
        } catch (error) {
            errorHelper.handleServerError(req, res, error);
        }
    }

    protected async checkPost(req: express.Request, res: express.Response) {
        try {
            debugger;
            let userData = req.body;

            const username = jwt.decode(userData.token).subject;

            const session = driver.session();
            const user = await session.run(`match(u:user {username:"${username}"}) return u`);

            if (user.records.length == 0) {
                res.status(400).send('Invalid token.');
            }
            else {
                let returnUser = userHelper.returnUser(user.records[0].toObject().u.properties);

                return res.status(200).send({ user: returnUser });
            }
        } catch (error) {
            errorHelper.handleServerError(req, res, error);
        }
    }
}