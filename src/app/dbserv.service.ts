import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Bill } from 'src/models/bill';
import { Cart } from 'src/models/cart';

@Injectable({
  providedIn: 'root'
})
export class DbservService {

  constructor(private http:HttpClient) { }

  loggedUser:any;
  loggedUserCart: Array<Bill> = new Array();
  electricUnits:number;
  waterUnits:number;
  telephoneUnits:number;
  //Add user to DB
  createUser(user:{email:string,password:string}){
    console.log(user);
    this.http.post('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users.json',user)
      .subscribe((res)=>{
          console.log(res);
      })
  }


  getUsers(){
    return this.http.get<{[key:string]:{mail:string,pass:string}}>('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users.json')
      .pipe(map((res)=>{
        const users = [];
        for(const key in res){
          users.push({...res[key],id:key})
        }
        return users;
      }))
  }

  getUnitPrices(){
    return this.http.get<{electricUnits:number,waterUnits:number,telephoneUnits:number}>('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/controls/unitPrices.json')
      .pipe(map((res)=>{
        this.electricUnits=res.electricUnits;
        this.waterUnits=res.waterUnits;
        this.telephoneUnits=res.telephoneUnits;
      }))
      .subscribe()
  }

  //Get tariff plans for different service providers
  getTariffPlans() {
    return this.http.get('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/controls/tariffPlans.json')
      .pipe(map((res) => {
        //this.tariffPlans = res;
      }))
      .subscribe()
  }

  
  getPendingBills(type: string) {
    return this.http.get<{ [key: string]: Bill }>('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/' + this.loggedUser.id + '/' + type + '/Pending.json')
      .pipe(map((res) => {
        const Bills = [];
        for (const key in res) {
         Bills.push({ ...res[key], id: key })
        }
        return Bills;
      }))
  }
  getPaidBills(type: string) {
    return this.http.get<{ [key: string]: Bill }>('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/' + this.loggedUser.id + '/' + type + '/Paid.json')
      .pipe(map((res) => {
        const Bills = [];
        for (const key in res) {
          Bills.push({ ...res[key], id: key })
        }
        return Bills;
      }))
  }

  deleteBill(id: string, type: string) {
    this.http.delete('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/' + this.loggedUser.id + '/' + type + '/Paid/' + id + '.json').subscribe();
  }

  payBills(bills: Bill[], type: string) {
    let paidBills: Bill[] = [];
    bills.forEach((bill) => {
      bill.status = "Paid";
      paidBills.push(bill);
      this.deleteBill(bill.id, type);
    });
    this.http
      .put(
        "https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/" +
        this.loggedUser.id +
        "/" +
        type +
        "/Paid.json",
        paidBills
      )
      .subscribe();
  }

  addToCart(bill:Bill){
    this.loggedUserCart.push(bill)
    this.http.put('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/'+this.loggedUser.id+'/cart.json',this.loggedUserCart)
      .subscribe((res)=>{
      })
  }
  getCart(){
    this.http.get('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/'+this.loggedUser.id+'/cart.json')
      .pipe(map((res)=>{
        console.log(res)
        for(const key in res){
          this.loggedUserCart.push({...res[key]})
        }

      }))
      .subscribe((res)=>{
      })
  }
  clearCart() {
    this.loggedUserCart = [];
    this.http
      .delete(
        "https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/" +
        this.loggedUser.id +
        "/cart.json"
      )
      .subscribe();
  }

}
