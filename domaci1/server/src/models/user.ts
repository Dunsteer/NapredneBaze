import mongoose, { Schema, Document } from 'mongoose';
var ObjectId = Schema.Types.ObjectId;
var Team = require('./team');

export interface IUser extends Document {
    _id: string;
    username: string;
    password: string;
}