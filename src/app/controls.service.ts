import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import { Bill } from 'src/models/bill';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class ControlsService {

  // THIS SERVICE CONTAINS ALL FUNCTIONS SHARED BY USER AND ADMIN AND CONTROLS AS WELL.

  FirebaseURL: string = 'https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/';
  constructor(private http: HttpClient) { }

  userService: UserService

  electricUnits: number;
  waterUnits: number;
  telephoneUnits: number;






  //Get Unit Prices (Liter,KiloWatt,Minutes) From DB
  getUnitPrices() {
    return this.http.get<{ electricUnits: number, waterUnits: number, telephoneUnits: number }>(this.FirebaseURL + 'controls/unitPrices.json')
      .pipe(map((res) => {
        this.electricUnits = res.electricUnits;
        this.waterUnits = res.waterUnits;
        this.telephoneUnits = res.telephoneUnits;
      }))
  }



  //Get Promo Codes From DB
  getPromoCodes() {
    return this.http.get<{ [key: string]: { code: string, value: number } }>(this.FirebaseURL + 'controls/promoCodes.json')
      .pipe(map((res) => {
        const codes = [];
        for (const key in res) {
          codes.push({ ...res[key], id: key })
        }
        return codes;
      }))
  }



  //Get All Offers From DB
  getAllOffers() {
    return this.http.get(this.FirebaseURL + "controls/Offers.json")
      .pipe(map((res) => {
        const offers = [];
        for (const key in res) {
          offers.push({ ...res[key], id: key })
        }
        return offers;
      }))
  }



  //Get Billing Accounts Of User
  getBillingAccounts(userId:string) {
    return this.http.get(this.FirebaseURL + "users/" + userId+ "/billingAccounts.json")
      .pipe(map((res) => {
        const accounts = [];
        for (const key in res) {
          if (res[key] != null) accounts.push({ ...res[key], id: key })
        }
        return accounts;
      }))
  }



  //Get All Bills Of One User
  getBillsofUser(userId: string, billType?: string) {
    let Bills = []

    return this.http.get<{ [key: string]: Bill }>(this.FirebaseURL + 'users/' + userId + '/Bills.json')
      .pipe(map((res) => {
        for (const key in res) {
          //If type is specified add only bills of that type to the array
          if (billType != null) {
            if (billType == res[key].type) Bills.push({ ...res[key], id: key })
          }
          //Otherwise add all bills to the array
          else {
            Bills.push({ ...res[key], id: key })
          }
        }
        return Bills;
      }))
  }


  //Delete One Bill Of A User
  deleteBill(userId: string, billId: string) {
    return this.http.delete(this.FirebaseURL + 'users/' + userId + '/Bills/' + billId + '.json');
  }
  // //Delete All Bills Of A User
  // deleteAllBills(userId: string) {
  //   return this.http.delete(this.FirebaseURL + 'users/' + userId + '/bills.json');
  // }




  //Get All Users From DB
  getUsers() {
    return this.http.get<{ [key: string]: User }>(this.FirebaseURL + 'users.json')
      .pipe(map((res) => {
        let users = [];
        for (let key in res) users.push({ ...res[key], id: key })
        return users;
      }))
  }















  // //Get Tariff Plans Of Different Service Providers
  // getTariffPlans() {
  //   return this.http.get(this.FirebaseURL+'controls/tariffPlans.json')
  //     .pipe(map((res) => {
  //       // this.tariffPlans = res;
  //     }))
  // }
}
