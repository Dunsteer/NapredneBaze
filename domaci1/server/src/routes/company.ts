
import express = require('express');
const crypto = require('crypto');

const errorHelper = require('./../helpers/error');
const User = require('../models/user');
import { userHelper } from '../helpers/userHelper'
import { BaseController } from './baseController';
import { IUser } from '../models/user';
import { IRequest } from '../helpers/request';
import { authorizationHelper } from '../helpers/authorization';

import { PubsubManager } from 'redis-messaging-manager';

let messenger = new PubsubManager({
    host: 'localhost'
});

import * as neo4j from 'neo4j-driver';

import { driver } from './api';

const jwt = require('jsonwebtoken');

export default class CompanyController extends BaseController {

    constructor() {
        super();

    }

    protected bindToRouter() {
        this.router.get('/', this.get.bind(this));
        this.router.post('/reserve', this.reservePost.bind(this));
    }

    protected async get(req: express.Request, res: express.Response) {
        try {
            const name = req.query.name;
            console.log(req.query);

            const session = driver.session();

            // const test = session
            //     .run('MATCH (A) RETURN ID(A) AS id, toInteger(10^20) as unsafe LIMIT 1')
            //     .then(this.transformIntegers)
            //     .then(function (result) {
            //         console.log(result.records[0]);
            //         session.close();
            //         driver.close();
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //     });

            const s = await (session.run(`match p=(c:company)-[:organizes]->(f:flight)-[:flies]->(a:airplane)-[:seatConfiguration]->(s:seats) 
                                            with collect(p) as paths
                                            CALL apoc.convert.toTree(paths) yield value
                                            RETURN value;`))//.then(this.transformIntegers));

            //console.log(s.records[0]);

            const test = s.records.map(x => {
                const obj = x.toObject();

                let ret = {
                    ...(obj.value), flights: obj.value.organizes.map(f => {
                        const obj = {
                            ...f, airplane: f.flies.map(a => {
                                const obj = {
                                    ...a, seatConfiguration: a.seatconfiguration.reduce((acc, x) => {
                                        acc[x.type] = x;
                                        x.type = undefined;
                                        return acc;
                                    }, {})
                                }

                                obj.seatconfiguration = undefined;

                                return obj;
                            })[0]
                        };
                        obj.flies = undefined;
                        return obj;
                    })
                };

                ret.organizes = undefined;

                return ret;

            }).filter(x => !name || x.name.toLowerCase().includes(name.toLowerCase()));

            this.mapN4J(test);

            res.send(test);

            // if (user.records.length == 0) {
            //     const user = (await session.run(`create (u:user {username:"${userData.username}",password:"${userData.password}"}) return u`)).records[0] as d.Record;

            //     let token = this.getToken(user.toObject());

            //     res.status(200).send({ token });
            // }
            // else {
            //     res.status(401).send('User already exists.');
            // }
        } catch (error) {
            errorHelper.handleServerError(req, res, error);
        }
    }

    protected async reservePost(req: express.Request, res: express.Response) {

        if (!req.headers.authorization) {
            return res.status(401).send('Unauthorized request.');
        }

        let token = req.headers.authorization.split(' ')[1];
        let payload = jwt.verify(token, 'secretKey');
        console.log(payload);

        messenger.publish("reservations", JSON.stringify({ ...req.body, userId: payload.subject }));

        return res.send({ message: "Successfully sent." });
    }

    mapN4J(input) {
        function walker(obj) {
            const keys = Object.keys(obj);

            keys.map(k => {
                if (typeof (obj[k]) == 'object') {
                    obj[`${obj['_type']}Id`] = obj["_id"];

                    if (neo4j.isInt(obj[k])) {
                        obj[k] = neo4j.integer.toNumber(obj[k]);
                    } else {
                        if (neo4j.isDateTime(obj[k])) {
                            obj[k] = new Date(obj[k].year,
                                obj[k].month,
                                obj[k].day,
                                obj[k].hour,
                                obj[k].minute,
                                obj[k].second)
                        } else {
                            if (Array.isArray(obj[k])) {
                                obj[k] = obj[k].map(x => {
                                    return walker(x);
                                })
                            } else {
                                return walker(obj[k]);
                            }
                        }
                    }
                }
            });

            return obj;
        }

        return walker(input);
    }
}


// match p=(c:company)-[:organizes]->(f:flight)-[:flies]->(a:airplane)-[:seatConfiguration]->(s:seats) 
// with collect(p) as paths
// CALL apoc.convert.toTree(paths) yield value
// RETURN value;