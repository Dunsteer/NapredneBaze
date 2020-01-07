import { State, Action, StateContext } from "@ngxs/store";
import { AuthService } from "@services/auth.service";
import { AuthActions } from "./actions";
import { map, catchError } from "rxjs/operators";
import { of } from "rxjs";

export interface AuthState {
  user: any;
}

@State<AuthState>({ name: "auth", defaults: { user: null } })
export class AuthStateManager {
  constructor(private auth: AuthService) {}

  @Action(AuthActions.Register)
  register(ctx: StateContext<AuthState>, action: AuthActions.Register) {
    const state = ctx.getState();
    return this.auth.register(action.user).pipe(
      map(res => {
        if (res) {
          return ctx.setState({
            ...state,
            user: res
          });
        }
      }),
      catchError(err => {
        console.error(err);
        return of(err);
      })
    );
  }
}
