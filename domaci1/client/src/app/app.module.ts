import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { NgxsModule } from "@ngxs/store";
import { AppState } from "./app.state";
import { RegisterComponent } from "./_features/register/register.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { CompaniesComponent } from './_features/companies/companies.component';
import { FlightsComponent } from './_features/flights/flights.component';

@NgModule({
  declarations: [AppComponent, RegisterComponent, CompaniesComponent, FlightsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot(AppState)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
