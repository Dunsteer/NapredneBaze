import { SeatConfiguration } from './seat-configuration.model';
import { Company } from './company.model';

export interface Airplane{
    airplaneId?: string;
    companyId: string;
    company?: Company;
    name: string;
    seatConfiguration: SeatConfiguration;
}