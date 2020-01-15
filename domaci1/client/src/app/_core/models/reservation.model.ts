import { User } from './user.model';
import { SeatType } from './seat-configuration.model';
import { Flight } from './flight.model';

export interface Reservation {
    reservationId: number;
    userId: number;
    user?: User;
    flightId: number;
    flight?: Flight;
    companyId: number;
    seatType: SeatType;
    approved: boolean;
}