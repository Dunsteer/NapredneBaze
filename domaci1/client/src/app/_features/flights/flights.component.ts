import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, NgForm } from "@angular/forms";
import { BaseComponent } from "src/app/_core/components/base.component";
import { Store, Select } from "@ngxs/store";
import { AirlineActions } from "@store/airline/actions";
import { AirlineStateManager } from "@store/airline/state";
import { Observable } from "rxjs";
import { Company } from "@models/company.model";
import { Flight } from "@models/flight.model";
import { SeatType } from "@models/seat-configuration.model";

@Component({
  selector: "app-flights",
  templateUrl: "./flights.component.html",
  styleUrls: ["./flights.component.scss"]
})
export class FlightsComponent extends BaseComponent implements OnInit {
  filterForm: FormGroup;
  @Input() company: Company;
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

  reserve(flight: Flight, seatType: SeatType) {
    this._store.dispatch(new AirlineActions.Reserve(flight, seatType));
  }

  submit(form: NgForm, e) {
    //e.preventDefault();
    this.flights = this.company.flights.filter(x => {
      let timeFrom;
      let timeTo;
      if (this.time.value) {
        timeFrom = this.time.value as Date;
        timeTo = this.time.value as Date;

        timeFrom.setHours(timeFrom.getHours() - 1);
        timeTo.setHours(timeTo.getHours() + 1);
      }
      console.log(this.filterForm.value);
      let ret =
        (this.from.value == "" || x.from == this.from.value) &&
        (this.to.value == "" || x.to == this.to.value) &&
        (!this.time.value || (x.time <= timeFrom && x.time >= timeTo));
      console.log(ret);
      return ret;
    });
  }
}
