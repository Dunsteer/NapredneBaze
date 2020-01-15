import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "@models/user.model";
import { environment } from "src/environments/environment";
import { Observable, of } from "rxjs";
import { Company } from "@models/company.model";
import { Flight } from "@models/flight.model";
import { Reservation } from "@models/reservation.model";
import { SeatType } from "@models/seat-configuration.model";
import * as neo4j from "neo4j-driver";

@Injectable({
  providedIn: "root"
})
export class AirlineService {
  constructor(private _http: HttpClient) {}

  getCompanies(filters: Company): Observable<Company[]> {
    // return this._http.get<Company[]>(`${environment.serverUrl}/airline/companies`, filters);
    const ret: any[] = [];
    ret.push({
      name: "asd",
      companyId: "asd",
      flights: [
        {
          airplaneId: "asd",
          companyId: "asd",
          from: "X",
          to: "Y",
          time: new neo4j.types.DateTime(1992, 1, 1, 2, 2, 2, 523, 1, ""),
          airplane: {
            companyId: "asd",
            name: "747",
            airplaneId: "asdd",
            seatConfiguration: {
              businessClass: {
                number: new neo4j.types.Integer(5, 0),
                taken: new neo4j.types.Integer(0, 0)
              },
              economyClass: {
                number: new neo4j.types.Integer(5, 0),
                taken: new neo4j.types.Integer(0, 0)
              },
              firstClass: {
                number: new neo4j.types.Integer(5, 0),
                taken: new neo4j.types.Integer(0, 0)
              }
            }
          }
        }
      ]
    });
    console.log(ret);
    return of(ret);
  }

  reserve(flight: Flight, seatType: SeatType): Observable<Reservation> {
    // return this._http.post<Reservation>(`${environment.serverUrl}/airline/reservation`, flight); // or flight.flightId
    return of(null);
  }
}
