import { Airplane } from './airplane.model';
import { Reservation } from './reservation.model';
import { Company } from './company.model';

export interface Flight {
    flightId?: number;
    airplaneId: number;
    airplane?: Airplane;
    companyId: number;
    company?: Company;
    from: string;
    to: string;
    time: Date;
}