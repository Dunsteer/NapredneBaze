import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "@models/user.model";
import { environment } from "src/environments/environment";
import { Observable, of } from "rxjs";
import { Company } from "@models/company.model";
import { Flight } from "@models/flight.model";
import { Reservation } from "@models/reservation.model";

@Injectable({
  providedIn: "root"
})
export class AirlineService {
  constructor(private _http: HttpClient) {}

  getCompanies(filters: Company): Observable<Company[]> {
    // return this._http.get<Company[]>(`${environment.serverUrl}/airline/companies`, filters);
    return of(null);
  }
  
  reserve(flight: Flight): Observable<Reservation> {
    // return this._http.post<Reservation>(`${environment.serverUrl}/airline/reservation`, flight); // or flight.flightId
    return of(null);
  }
}
