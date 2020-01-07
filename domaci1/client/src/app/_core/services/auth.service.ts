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
    console.log("SERVICE", user);
    //return this._http.post<User>(`${environment.serverUrl}/auth`, user);
    return of(user);
  }
}
