import { Component } from "@angular/core";
import { Select } from '@ngxs/store';
import { AuthStateManager } from '@store/auth/state';
import { Observable } from 'rxjs';
import { User } from '@models/user.model';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styles: []
})
export class AppComponent {
  @Select(AuthStateManager.user) user$: Observable<User>;
  title = "Elfak Airlines";
}
