import { SeatConfiguration } from './seat-configuration.model';
import { Company } from './company.model';

export interface Airplane {
    airplaneId?: number;
    companyId: number;
    company?: Company;
    name: string;
    seatConfiguration: SeatConfiguration;
}