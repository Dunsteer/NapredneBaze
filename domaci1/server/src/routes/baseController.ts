import express = require('express');
import { IUser } from '../models/user';
//const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');

export abstract class BaseController {
    private _router: express.Router;
    constructor() {
        this._router = express.Router();
        this.bindToRouter();
    }

    public get router() {
        return this._router;
    }

    protected abstract bindToRouter();

    protected getToken(user: any) {
        debugger;
        let payload = {
            subject: user.u.identity.low
        }
        return jwt.sign(payload, 'secretKey');
    }
}