import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { OffersComponent } from './offers/offers.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { ElectricityComponent } from './electricity/electricity.component';
import { WaterComponent } from './water/water.component';
import { TelephoneComponent } from './telephone/telephone.component';
import {HttpClientModule} from '@angular/common/http'
import { DbservService } from './dbserv.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FooterComponent,
    NavBarComponent,
    OffersComponent,
    ElectricityComponent,
    WaterComponent,
    TelephoneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [AppRoutingModule,DbservService],
  bootstrap: [AppComponent]
})
export class AppModule { }
