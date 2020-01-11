import { User } from './user.model';
import { SeatType } from './seat-configuration.model';
import { Flight } from './flight.model';

export interface Reservation{
    userId: string;
    user?: User;
    flightId: string;
    flight?: Flight;
    companyId: string;
    seatType: SeatType;
    approved: boolean;
}