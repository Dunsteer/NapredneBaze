import express from 'express';
import { IRequest } from './request';
import { IUser } from '../models/user';
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const errorHandler = require('./error');
const roles = require('../constants/roles');

async function authorized(req: IRequest, res: express.Response, next: Function) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request.');
    }

    let token = req.headers.authorization.split(' ')[1];

    if (token === 'null') {
        return res.status(401).send('Unauthorized request.');
    }

    let payload = jwt.verify(token, 'secretKey');

    if (!payload) {
        return res.status(401).send('Unauthorized request.');
    }

    const userId = payload.subject;

    try {
        let user:IUser = await User.findById(userId);

        if(!user) {
            return res.status(401).send('Unauthorized request.');
        }
        
        req.currentUser = user;

        if (req.currentUser.role === roles.admin) {
            req.isAdmin = true;
        }

        next();
    }
    catch (error) {
        errorHandler.handleServerError(req, res, error);
    }
}

export const authorizationHelper =  {
    authorized,
    isAdmin: function (req: IRequest, res: express.Response, next: Function) {
        authorized(req, res, () => {
            if (req.isAdmin) {
                next();
            }
            else {
                res.status(401).send("Unauthorized");
            }
        })
    }
}
