
import express = require('express');
const crypto = require('crypto');

const errorHelper = require('./../helpers/error');
const User = require('../models/user');
import { userHelper } from '../helpers/userHelper'
import { BaseController } from './baseController';
import { IUser } from '../models/user';
import { IRequest } from '../helpers/request';

import * as neo4j from 'neo4j-driver';

import { driver } from './api';

const jwt = require('jsonwebtoken');

export default class CompanyController extends BaseController {

    constructor() {
        super();
    }

    protected bindToRouter() {
        this.router.get('/', this.get.bind(this));
    }

    protected async get(req: express.Request, res: express.Response) {
        try {
            let userData = req.body;

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
                            ...f, airplanes: f.flies.map(a => {
                                const obj = {
                                    ...a, seatConfiguration: a.seatconfiguration.reduce((acc, x) => { acc[x.type] = x; return acc; }, {})
                                }

                                obj.seatconfiguration = undefined;

                                return obj;
                            })
                        };
                        obj.flies = undefined;
                        return obj;
                    })
                };

                ret.organizes = undefined;

                return ret;

            });

            this.removeHigh(test);

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

    transformIntegers(result) {
        return new Promise((resolve, reject) => {
            try {
                result.records.forEach(function (row, i) {
                    row._fields.forEach(function (val, j) {
                        result.records[i]._fields[j] = (val.low != null || val.low != undefined)
                            ? (neo4j.integer.inSafeRange(val) ? val.toNumber() : val.toString())
                            : val;
                    })
                })
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    };

    private removeHigh(obj) {
        if (typeof (obj) != "object") {
            return obj;
        } else {
            Object.keys(obj).map(key => {
                if (typeof (obj[key]) != "object") {
                    if (obj[key].low != null || obj[key].low != undefined) {
                        obj[key] = obj[key].low;
                    } else {
                        this.removeHigh(obj[key]);
                    }
                }
            });
        }
    }
}


// match p=(c:company)-[:organizes]->(f:flight)-[:flies]->(a:airplane)-[:seatConfiguration]->(s:seats) 
// with collect(p) as paths
// CALL apoc.convert.toTree(paths) yield value
// RETURN value;