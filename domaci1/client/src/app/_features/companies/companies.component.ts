import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, NgForm } from "@angular/forms";
import { BaseComponent } from "src/app/_core/components/base.component";
import { Store, Select } from "@ngxs/store";
import { AirlineActions } from "@store/airline/actions";
import { AirlineStateManager } from "@store/airline/state";
import { Observable } from "rxjs";
import { Company } from "@models/company.model";

@Component({
  selector: "app-companies",
  templateUrl: "./companies.component.html",
  styleUrls: ["./companies.component.scss"]
})
export class CompaniesComponent extends BaseComponent implements OnInit {
  filterForm: FormGroup;
  @Select(AirlineStateManager.companies) companies$: Observable<Company[]>;
  selectedCompany: Company;

  constructor(public _store: Store) {
    super();
  }

  get name() {
    return this.filterForm.get("name");
  }

  ngOnInit() {
    this.filterForm = new FormGroup({
      name: new FormControl("")
    });
  }

  submit(form: NgForm) {
    //e.preventDefault();
    this._store
      .dispatch(new AirlineActions.GetCompanies(this.filterForm.value))
      .subscribe(() => {
        form.resetForm();
      });
  }
}
