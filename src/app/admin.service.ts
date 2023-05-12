import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ControlsService } from './controls.service';
import { map } from 'rxjs';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  FirebaseURL: string = 'https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/';
  constructor(private http: HttpClient) { }

  controlsService: ControlsService


  //Update User Details
  updateUser(user: User) {
    return this.http.put(this.FirebaseURL + "users/" + user.id + '.json', user)
  }



  //Add Bill To User
  addBill(userId: string, bill: any) {
    return this.http.post(this.FirebaseURL + "users/" + userId + "/Bills.json", bill)
  }


  //Change Unit Price (Liters, KiloWatts, Minutes)
  changeUnit(type: string, newValue: number) {
    return this.http.put(this.FirebaseURL + "controls/unitPrices/" + type + '.json', newValue);
  }


  //Add New Promo Code To DB
  addPromoCode(promo: any) {
    return this.http.post(this.FirebaseURL + "controls/promoCodes.json", promo);
  }
  //Delete Promo Code From DB
  deletePromo(promoCode: any) {
    return this.http.delete(this.FirebaseURL + 'controls/promoCodes/' + promoCode.id + '.json');
  }




  //Delete Service Provider Offer
  deleteOffer(offerId: string) {
    return this.http.delete(this.FirebaseURL + 'controls/Offers/' + offerId + '.json');
  }
  //Add Service Provider Offer
  addOffer(offer: any) {
    return this.http.post(this.FirebaseURL + "controls/Offers.json", offer)
  }

}
