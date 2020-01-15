import { State, Action, StateContext, Selector } from "@ngxs/store";
import { AirlineService } from "@services/airline.service";
import { AirlineActions } from "./actions";
import { map, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { Company } from "@models/company.model";
import { Flight } from "@models/flight.model";
import {
  patch,
  append,
  removeItem,
  insertItem,
  updateItem
} from "@ngxs/store/operators";
import { Reservation } from "@models/reservation.model";
import { AuthActions } from "@store/auth/actions";

export interface AirlineState {
  companies: Company[];
}

const initialState: AirlineState = {
  companies: [
    {
      name: "first",
      flights: [
        {
          from: "a",
          to: "a",
          time: new Date(),
          airplaneId: "1",
          companyId: "1",
          airplane: {
            name: "airplane",
            companyId: "1",
            seatConfiguration: {
              firstClass: { number: 5, taken: 0 },
              businessClass: { number: 0, taken: 0 },
              economyClass: { number: 0, taken: 0 }
            }
          }
        }
      ],
      companyId: "1"
    },
    { name: "second", flights: [], companyId: "2" },
    { name: "third", flights: [], companyId: "3" }
  ]
};

@State<AirlineState>({ name: "airline", defaults: initialState })
export class AirlineStateManager {
  constructor(private airline: AirlineService) {}

  @Action(AirlineActions.GetCompanies)
  getCompanies(
    ctx: StateContext<AirlineState>,
    action: AirlineActions.GetCompanies
  ) {
    const state = ctx.getState();
    return this.airline.getCompanies(action.filters).pipe(
      map(res => {
        if (res) {
          return ctx.setState({
            ...state,
            companies: res
          });
        }
      }),
      catchError(err => {
        console.error(err);
        return of(err);
      })
    );
  }

  @Action(AirlineActions.Reserve)
  reserve(ctx: StateContext<AirlineState>, action: AirlineActions.Reserve) {
    return this.airline.reserve(action.flight, action.seatType).pipe(
      map(res => {
        if (res) {
          ctx.dispatch(new AuthActions.AddReservation(res));
        }
      }),
      catchError(err => {
        console.error(err);
        return of(err);
      })
    );
  }

  @Selector()
  static state(state: AirlineState) {
    return state;
  }

  @Selector()
  static companies(state: AirlineState) {
    return state.companies;
  }
}
