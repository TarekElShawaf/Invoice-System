import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
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
import {MatDialogModule} from '@angular/material/dialog';


import { DbservService } from './dbserv.service';
import { CheckoutComponent } from './checkout/checkout.component';
import { ServiceProviderComponent } from './service-provider/service-provider.component';
import { AdminComponent } from './admin/admin.component';

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
    TelephoneComponent,
    CheckoutComponent,
    ServiceProviderComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule
  ],
  providers: [AppRoutingModule,DbservService],
  bootstrap: [AppComponent]
})
export class AppModule { }
