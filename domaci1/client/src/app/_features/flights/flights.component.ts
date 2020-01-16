import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges
} from "@angular/core";
import { FormGroup, FormControl, NgForm } from "@angular/forms";
import { BaseComponent } from "src/app/_core/components/base.component";
import { Store, Select } from "@ngxs/store";
import { AirlineActions } from "@store/airline/actions";
import { AirlineStateManager } from "@store/airline/state";
import { Observable } from "rxjs";
import { Company } from "@models/company.model";
import { Flight } from "@models/flight.model";
import { SeatType } from "@models/seat-configuration.model";
import { User } from '@models/user.model';

@Component({
  selector: "app-flights",
  templateUrl: "./flights.component.html",
  styleUrls: ["./flights.component.scss"]
})
export class FlightsComponent extends BaseComponent
  implements OnInit, OnChanges {
  filterForm: FormGroup;
  @Input() company: Company;
  @Input() user: User;
  flights: Flight[];

  constructor(public _store: Store) {
    super();
  }

  get from() {
    return this.filterForm.get("from");
  }

  get to() {
    return this.filterForm.get("to");
  }

  get time() {
    return this.filterForm.get("time");
  }

  ngOnInit() {
    this.filterForm = new FormGroup({
      from: new FormControl(""),
      to: new FormControl(""),
      time: new FormControl(null)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["company"]) {
      if (this.company) {
        this.filterCompanyFlights();
      }
    }
  }

  reserve(seatsId: number) {
    this._store.dispatch(new AirlineActions.Reserve(seatsId));
  }

  submit(form: NgForm, e) {
    // e.preventDefault();
    this.filterCompanyFlights();
  }

  filterCompanyFlights() {
    this.flights = this.company.flights.filter(x => {
      let timeFrom: Date;
      let timeTo: Date;

      if (this.time.value) {
        timeFrom = new Date(this.time.value);
        timeTo = new Date(this.time.value);
        timeFrom.setHours(0);
        timeFrom.setMinutes(0);
        timeTo.setHours(23);
        timeTo.setMinutes(59);
        x.time = new Date(x.time);
      }

      let ret =
        (this.from.value == "" ||
          x.from.toLowerCase() == this.from.value.toLowerCase()) &&
        (this.to.value == "" ||
          x.to.toLowerCase() == this.to.value.toLowerCase()) &&
        (!this.time.value || (x.time >= timeFrom && x.time <= timeTo));

      return ret;
    });
  }
}
