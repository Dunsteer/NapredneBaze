import { State, Action, StateContext } from "@ngxs/store";
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

export interface AirlineState {
  companies: Company[];
  flights: Flight[];
}

const initialState: AirlineState = {
  companies: [],
  flights: []
};

@State<AirlineState>({ name: "auth", defaults: initialState })
export class AuthStateManager {
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

  @Action(AirlineActions.GetFlights)
  getFlights(
    ctx: StateContext<AirlineState>,
    action: AirlineActions.GetFlights
  ) {
    const state = ctx.getState();
    return this.airline.getFlights(action.filters).pipe(
      map(res => {
        if (res) {
          return ctx.setState({
            ...state,
            flights: res
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
    return this.airline.reserve(action.flight).pipe(
      map(res => {
        if (res) {
          return ctx.setState(
            patch({
              flights: updateItem<Flight>(
                x => x.flightId == res.flightId,
                patch<Flight>({ reservations: insertItem<Reservation>(res) })
              )
            })
          );
        }
      }),
      catchError(err => {
        console.error(err);
        return of(err);
      })
    );
  }
}
