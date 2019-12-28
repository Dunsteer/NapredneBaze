import express from 'express';
import { IUser } from '../models/user';

export interface IRequest extends express.Request {
    currentUser:IUser;
    isAdmin:boolean;
}