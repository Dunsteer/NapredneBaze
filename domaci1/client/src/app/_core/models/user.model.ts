import { Flight } from "./flight.model";
import { eUserRank } from "../enumerators/user-rank.enum";
import { Reservation } from "./reservation.model";

export interface User {
  username?: string;
  rank?: eUserRank;
  firstName?: string;
  lastName?: string;
  passportId?: string;
  password?: string;
  confirmPassword?: string;
  reservations?: Reservation[];
}
