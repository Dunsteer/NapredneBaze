import { Airplane } from './airplane.model';
import { Flight } from './flight.model';

export interface Company{
    companyId?: string;
    name: string;
    flights: Flight[];
}