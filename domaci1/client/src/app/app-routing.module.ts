import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RegisterComponent } from "./_features/register/register.component";
import { CompaniesComponent } from './_features/companies/companies.component';
import { FlightsComponent } from './_features/flights/flights.component';

const routes: Routes = [
  { path: "register", component: RegisterComponent },
  { path: "companies", component: CompaniesComponent },
  { path: "flights", component: FlightsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
