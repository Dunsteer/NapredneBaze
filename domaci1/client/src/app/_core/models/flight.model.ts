import { Airplane } from './airplane.model';
import { Reservation } from './reservation.model';
import { Company } from './company.model';

export interface Flight{
    flightId?: string;
    airplaneId: string;
    airplane?: Airplane;
    companyId: string;
    company?: Company;
    from: string;
    to: string;
    time: Date;
    reservations: Reservation[]
}