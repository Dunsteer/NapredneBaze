import { State, Action, StateContext, Selector } from "@ngxs/store";
import { AuthService } from "@services/auth.service";
import { AuthActions } from "./actions";
import { map, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { User } from "@models/user.model";
import { patch, updateItem, insertItem } from "@ngxs/store/operators";
import { Reservation } from "@models/reservation.model";
import { eUserRank } from "../../enumerators/user-rank.enum";

export interface AuthState {
  user: User;
}

const initialState: AuthState = {
  user: {
    firstName: "Test",
    lastName: "User",
    passportId: "111222333",
    rank: eUserRank.basic,
    reservations: [],
    username: "test"
  }
};

@State<AuthState>({ name: "auth", defaults: initialState })
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

  @Action(AuthActions.Login)
  login(ctx: StateContext<AuthState>, action: AuthActions.Login) {
    const state = ctx.getState();
    return this.auth.login(action.user).pipe(
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

  @Action(AuthActions.Check)
  check(ctx: StateContext<AuthState>, action: AuthActions.Check) {
    const state = ctx.getState();
    return this.auth.check(action.token).pipe(
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

  @Action(AuthActions.AddReservation)
  addReservation(
    ctx: StateContext<AuthState>,
    action: AuthActions.AddReservation
  ) {
    return ctx.setState(
      patch<AuthState>({
        user: patch<User>({
          reservations: insertItem<Reservation>(action.reservation)
        })
      })
    );
  }

  @Action(AuthActions.ApproveReservation)
  approveReservation(
    ctx: StateContext<AuthState>,
    action: AuthActions.ApproveReservation
  ) {
    return ctx.setState(
      patch<AuthState>({
        user: patch<User>({
          reservations: updateItem<Reservation>(
            x => x.reservationId == action.reservationId,
            patch<Reservation>({ approved: true })
          )
        })
      })
    );
  }
  
  @Selector()
  static state(state: AuthState) {
    return state;
  }

  @Selector()
  static user(state: AuthState) {
    return state.user;
  }
}
