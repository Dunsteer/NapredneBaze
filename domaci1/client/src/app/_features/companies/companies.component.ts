import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, NgForm } from "@angular/forms";
import { BaseComponent } from "src/app/_core/components/base.component";
import { Store, Select } from "@ngxs/store";
import { AirlineActions } from "@store/airline/actions";
import { AirlineStateManager } from "@store/airline/state";
import { Observable } from "rxjs";
import { Company } from "@models/company.model";
import { AuthStateManager } from '@store/auth/state';
import { User } from '@models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: "app-companies",
  templateUrl: "./companies.component.html",
  styleUrls: ["./companies.component.scss"]
})
export class CompaniesComponent extends BaseComponent implements OnInit {
  filterForm: FormGroup;
  @Select(AuthStateManager.user) user$: Observable<User>;
  @Select(AirlineStateManager.companies) companies$: Observable<Company[]>;
  selectedCompany: Company;

  constructor(public _store: Store, public _router: Router) {
    super();
  }

  get name() {
    return this.filterForm.get("name");
  }

  ngOnInit() {

    // this.user$.subscribe(u => {
    //   if (!u) {
    //     this._router.navigateByUrl('login');
    //   }
    // })

    this.filterForm = new FormGroup({
      name: new FormControl("")
    });
  }

  submit(form: NgForm) {
    //e.preventDefault();
    this.selectedCompany = null;
    this._store
      .dispatch(new AirlineActions.GetCompanies(this.filterForm.value))
      .subscribe(() => {
        //form.resetForm();
      });
  }
}
