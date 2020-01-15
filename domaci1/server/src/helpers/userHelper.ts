import { IUser } from "../models/user";

function returnUser(user: IUser, authorized?: boolean) {
    let ret = {
        username: user.username
    }

    return ret;
}

export const userHelper = {
    returnUser
};