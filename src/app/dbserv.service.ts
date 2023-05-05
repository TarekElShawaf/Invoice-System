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
        // this.tariffPlans = res;
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
  getBills(status:string,type: string) {
    return this.http.get<{ [key: string]: Bill }>('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/' + this.loggedUser.id + '/' + type +'/'+status+'.json')
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
  adminDeleteBill(id: string, type: string) {
    this.http.delete('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/' + this.loggedUser.id + '/' + type + '/Pending/' + id + '.json').subscribe();
  }
  payBills(bills: Bill[], type: string) {
    let paidBills =[{}]
    bills.forEach((bill) => {
      bill.status = "Paid";
      let billToBeUploaded = {
        billNum: bill.billNum,
        billUnits: bill.billUnits,
        dueDate: bill.dueDate
      };
      paidBills.push(billToBeUploaded);
      const index = this.loggedUserCart.indexOf(bill);
      if (index > -1) { // only splice array when item is found
        this.loggedUserCart.splice(index, 1); // 2nd parameter means remove one item only
      }
      this.http.delete('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/' + this.loggedUser.id + '/' + type + '/Pending/' + bill.id + '.json').subscribe();
      this.http.post("https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/" + this.loggedUser.id + "/" + type +"/Paid.json",billToBeUploaded).subscribe();
    });
    console.log("paid",paidBills)
    
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

  changeUnit(type:string,newValue:number){
    switch(type){
      case 'electricUnits':
        this.electricUnits=newValue;
        break;
      case 'waterUnits':
        this.waterUnits=newValue;
        break;
      case 'telephoneUnits':
        this.telephoneUnits=newValue;
        break;   
    }
    console.log(newValue)
    this.http.put("https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/controls/unitPrices/"+type+'.json',newValue)
    .subscribe()
  }

  updateUser(user:any){
    this.http.put("https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/"+user.id+'.json',user)
    .subscribe()
  }

  addPromoCode(promo: any) {
    return this.http.post("https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/controls/promoCodes.json", promo)
      .pipe(
        map(response => {
          // transform the response into the new promo code object
          return {
            id: response['name'],
            code: promo.code,
            value: promo.value
          };
        })
      );
  }
  getPromoCodes(){
    return this.http.get<{[key:string]:{code:string,value:number}}>('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/controls/promoCodes.json')
      .pipe(map((res)=>{
        const codes = [];
        for(const key in res){
          codes.push({...res[key],id:key})
        }
        return codes;
      }))
  }
  deletePromo(code:any) {
    return this.http.delete('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/controls/promoCodes/'+code.id+'.json');
  }


  getBillsofUser(id:string){
    let Bills=[]
    this.http.get<{ [key: string]: Bill }>('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/' + id + '/waterBills/Pending.json')
    .pipe(map((res) => {
      for (const key in res) {
       Bills.push({ ...res[key], id: key,type:'Water Bill' })
      }
    }))
    .subscribe()
    this.http.get<{ [key: string]: Bill }>('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/' + id + '/electricBills/Pending.json')
    .pipe(map((res) => {
      for (const key in res) {
       Bills.push({ ...res[key], id: key,type:'Electric Bill' })
      }
    }))
    .subscribe()
    this.http.get<{ [key: string]: Bill }>('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/' + id + '/telephoneBills/Pending.json')
    .pipe(map((res) => {
      for (const key in res) {
       Bills.push({ ...res[key], id: key,type:'Telephone Bill' })
      }
    }))
    .subscribe()
    return Bills;
  }

  addBill(userId:string,billType:string,bill:any){
    return this.http.post("https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/" + userId + "/" + billType +"/Pending.json",bill)
  }


  getAllOffers(){
    return this.http.get("https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/controls/Offers.json")
    .pipe(map((res)=>{
      const offers = [];
      for(const key in res){
        offers.push({...res[key],id:key})
      }
      return offers;
    }))
  }
}
