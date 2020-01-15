import { Component, OnInit } from "@angular/core";
import { Select, Store } from '@ngxs/store';
import { AuthStateManager } from '@store/auth/state';
import { Observable } from 'rxjs';
import { User } from '@models/user.model';
import { CookieService } from 'ngx-cookie-service';
import { AuthActions } from '@store/auth/actions';
import { Router } from '@angular/router';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styles: []
})
export class AppComponent implements OnInit {
  @Select(AuthStateManager.user) user$: Observable<User>;
  title = "Elfak Airlines";

  constructor(public _cookie: CookieService, public _store: Store, public _router: Router) {

  }

  ngOnInit(): void {
    const token = this._cookie.get('token');
    if (token) {
      this._store.dispatch(new AuthActions.Check(token)).subscribe(() => {
        this._router.navigateByUrl('/companies');
      }, (err) => {
        alert(err);
      });
    }
  }

  logout() {
    this._cookie.delete('token');
    this._store.dispatch(new AuthActions.Logout())
  }


}
