import { User } from '@models/user.model';
import { Reservation } from '@models/reservation.model';

export namespace AuthActions {
  export class Register {
    static readonly type = "[AUTH] Register";
    constructor(public user: User) {}
  }

  export class Login {
    static readonly type = "[AUTH] Login";
    constructor(public user: User) {}
  }

  export class Check {
    static readonly type = "[AUTH] Check";
    constructor(public token: string) {}
  }
  
  export class AddReservation {
    static readonly type = "[AUTH] Add reservation";
    constructor(public reservation: Reservation) {}
  }

  export class ApproveReservation {
    static readonly type = "[AUTH] Approve reservation";
    constructor(public reservationId: string) {}
  }
}
