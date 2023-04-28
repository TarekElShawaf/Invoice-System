import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { OffersComponent } from './offers/offers.component';
import { ElectricityComponent } from './electricity/electricity.component';
import { WaterComponent } from './water/water.component';
import { TelephoneComponent } from './telephone/telephone.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ServiceProviderComponent } from './service-provider/service-provider.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'offers', component: OffersComponent },
  { path: 'electricity', component: ElectricityComponent },
  { path: 'water', component: WaterComponent },
  { path: 'telephone', component: TelephoneComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'service-provider', component: ServiceProviderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
