import { User } from '@models/user.model';

export namespace AuthActions {
  export class Register {
    static readonly type = "[AUTH] Register";
    constructor(public user: User) {}
  }
}
