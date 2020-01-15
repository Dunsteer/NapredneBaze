import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { NgxsModule } from "@ngxs/store";
import { AppState } from "./app.state";
import { RegisterComponent } from "./_features/register/register.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { CompaniesComponent } from './_features/companies/companies.component';
import { FlightsComponent } from './_features/flights/flights.component';
import { CookieService } from 'ngx-cookie-service';
import { LoginComponent } from './_features/login/login.component';
import { InterceptorService } from '@services/interceptor.service';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };

@NgModule({
  declarations: [AppComponent, RegisterComponent, CompaniesComponent, FlightsComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot(AppState),
    SocketIoModule.forRoot(config)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
      deps: [CookieService],
    },
    CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
