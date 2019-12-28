import { IUser } from "../models/user";

function returnUser(user:IUser, authorized?:boolean) {
    let ret = {
        username: user.username,
        facebookUsername: user.facebookUsername,
        gitHubUsername: user.gitHubUsername,
        _id: user._id.toString(),
        avatarUrl: user.avatarUrl,
        created: user.created,
        nibbles: user.nibbles,
        teams:user.teams,
        posts:user.posts,
        //..., posts, teams, itditd
        about: user.about,
        private: user.private,
        firstName:'',
        lastName:'',
        email:'',
        role:user.role
    }
    if (!user.private || authorized) {
        ret.firstName = user.firstName;
        ret.lastName = user.lastName;
        ret.email = user.email;
    }
    return ret;
}

export const userHelper= {
    returnUser
};