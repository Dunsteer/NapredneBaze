import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "@models/user.model";
import { environment } from "src/environments/environment";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private _http: HttpClient) {}

  register(user: User): Observable<User> {
    // return this._http.post<User>(`${environment.serverUrl}/auth/register`, user);
    return of(user);
  }

  login(user: User): Observable<User> {
    // return this._http.post<User>(`${environment.serverUrl}/auth/login`, user);
    return of(user);
  }

  check(token: string): Observable<User> {
    // return this._http.post<User>(`${environment.serverUrl}/auth/check`, token);
    return of({});
  }
}
