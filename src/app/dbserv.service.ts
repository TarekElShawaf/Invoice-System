import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Bill } from 'src/models/bill';

@Injectable({
  providedIn: 'root'
})
export class DbservService {

  FirebaseURL:string ='https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/';
  constructor(private http:HttpClient) { }

  loggedUser:any;
  loggedUserCart: Array<Bill> = new Array();
  electricUnits:number;
  waterUnits:number;
  telephoneUnits:number;




  //Add user to DB
  createUser(user:{email:string,password:string}){
    console.log(user);
    this.http.post(this.FirebaseURL+'users.json',user)
      .subscribe((res)=>{
          console.log(res);
      })
  }

  //Get All Users from DB
  getUsers(){
    return this.http.get<{[key:string]:{mail:string,pass:string}}>(this.FirebaseURL+'users.json')
      .pipe(map((res)=>{
        const users = [];
        for(const key in res){
          users.push({...res[key],id:key})
        }
        return users;
      }))
  }

  getUnitPrices(){
    return this.http.get<{electricUnits:number,waterUnits:number,telephoneUnits:number}>(this.FirebaseURL+'controls/unitPrices.json')
      .pipe(map((res)=>{
        this.electricUnits=res.electricUnits;
        this.waterUnits=res.waterUnits;
        this.telephoneUnits=res.telephoneUnits;
      }))
      .subscribe()
  }

  //Get tariff plans for different service providers
  getTariffPlans() {
    return this.http.get(this.FirebaseURL+'controls/tariffPlans.json')
      .pipe(map((res) => {
        // this.tariffPlans = res;
      }))
      .subscribe()
  }

  
  getPendingBills(type: string) {
    return this.http.get<{ [key: string]: Bill }>(this.FirebaseURL+'users/' + this.loggedUser.id + '/' + type + '/Pending.json')
      .pipe(map((res) => {
        const Bills = [];
        for (const key in res) {
         Bills.push({ ...res[key], id: key })
        }
        return Bills;
      }))
  }
  getPaidBills(type: string) {
    return this.http.get<{ [key: string]: Bill }>(this.FirebaseURL+'users/' + this.loggedUser.id + '/' + type + '/Paid.json')
      .pipe(map((res) => {
        const Bills = [];
        for (const key in res) {
          Bills.push({ ...res[key], id: key })
        }
        return Bills;
      }))
  }
  getBills(status:string,type: string) {
    return this.http.get<{ [key: string]: Bill }>(this.FirebaseURL+'users/' + this.loggedUser.id + '/' + type +'/'+status+'.json')
      .pipe(map((res) => {
        const Bills = [];
        for (const key in res) {
         Bills.push({ ...res[key], id: key })
        }
        return Bills;
      }))
  }
  
  getBillingAccounts(){
    return this.http.get(this.FirebaseURL+"users/"+this.loggedUser.id+"/billingAccounts.json")
    .pipe(map((res)=>{
      const accs = [];
      for(const key in res){
        if(res[key]!=null) accs.push({...res[key],id:key})
      }
      return accs;
    }))
  }

  deleteBill(id: string, type: string) {
    return this.http.delete(this.FirebaseURL+'users/' + this.loggedUser.id + '/' + type + '/Paid/' + id + '.json').subscribe();
  }
  deleteAllBills(id: string, type: string) {
    return this.http.delete(this.FirebaseURL+'users/' + this.loggedUser.id + '/' + type + '/Paid/' + id + '.json');
  }
  adminDeleteBill(id: string, type: string) {
    this.http.delete(this.FirebaseURL+'users/' + this.loggedUser.id + '/' + type + '/Pending/' + id + '.json').subscribe();
  }
  payBills(bills: any[], type: string) {
    let paidBills =[{}]
    bills.forEach((bill) => {
      bill.status = "Paid";
      let billToBeUploaded
      if(bill.type=='account'){
         billToBeUploaded = {
          billName: bill.name,
          billNum: bill.number,
          offerValue: bill.total,
          type:bill.type
        };       
      }
      else{
        billToBeUploaded = {
          billNum: bill.billNum,
          billUnits: bill.billUnits,
          dueDate: bill.dueDate

        };
      }

      paidBills.push(billToBeUploaded);
      const index = this.loggedUserCart.indexOf(bill);
      if (index > -1) { // only splice array when item is found
        this.loggedUserCart.splice(index, 1); // 2nd parameter means remove one item only
      }
      if(billToBeUploaded.type=='account'){
        this.http.delete(this.FirebaseURL+'users/' + this.loggedUser.id + '/' + type + '/1.json').subscribe();

      }
      else{
        this.http.delete(this.FirebaseURL+'users/' + this.loggedUser.id + '/' + type + '/Pending/' + bill.id + '.json').subscribe();
      }
      this.http.post(this.FirebaseURL+"users/" + this.loggedUser.id + "/" + type +"/Paid.json",billToBeUploaded).subscribe();

    });
    console.log("paid",paidBills)
    
}

  addToCart(bill:Bill){
    this.loggedUserCart.push(bill)
    this.http.put(this.FirebaseURL+'users/'+this.loggedUser.id+'/cart.json',this.loggedUserCart)
      .subscribe((res)=>{
      })
  }
  getCart(){
    this.http.get(this.FirebaseURL+'users/'+this.loggedUser.id+'/cart.json')
      .pipe(map((res)=>{
        console.log(res)
        for(const key in res){
          if(res[key]!=null)
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
        this.FirebaseURL+ "users/" +
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
    this.http.put(this.FirebaseURL+"controls/unitPrices/"+type+'.json',newValue)
    .subscribe()
  }

  updateUser(user:any){
    this.http.put(this.FirebaseURL+"users/"+user.id+'.json',user)
    .subscribe()
  }

  addPromoCode(promo: any) {
    return this.http.post(this.FirebaseURL+"controls/promoCodes.json", promo)
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
    return this.http.get<{[key:string]:{code:string,value:number}}>(this.FirebaseURL+'controls/promoCodes.json')
      .pipe(map((res)=>{
        const codes = [];
        for(const key in res){
          codes.push({...res[key],id:key})
        }
        return codes;
      }))
  }
  deletePromo(code:any) {
    return this.http.delete(this.FirebaseURL+'controls/promoCodes/'+code.id+'.json');
  }


  getBillsofUser(id:string){
    let Bills=[]
    this.http.get<{ [key: string]: Bill }>(this.FirebaseURL+'users/' + id + '/waterBills/Pending.json')
    .pipe(map((res) => {
      for (const key in res) {
       Bills.push({ ...res[key], id: key,type:'Water Bill' })
      }
    }))
    .subscribe()
    this.http.get<{ [key: string]: Bill }>(this.FirebaseURL+'users/' + id + '/electricBills/Pending.json')
    .pipe(map((res) => {
      for (const key in res) {
       Bills.push({ ...res[key], id: key,type:'Electric Bill' })
      }
    }))
    .subscribe()
    this.http.get<{ [key: string]: Bill }>(this.FirebaseURL+'users/' + id + '/telephoneBills/Pending.json')
    .pipe(map((res) => {
      for (const key in res) {
       Bills.push({ ...res[key], id: key,type:'Telephone Bill' })
      }
    }))
    .subscribe()
    return Bills;
  }

  addBill(userId:string,billType:string,bill:any){
    return this.http.post(this.FirebaseURL+"users/" + userId + "/" + billType +"/Pending.json",bill)
  }


  getAllOffers(){
    return this.http.get(this.FirebaseURL+"controls/Offers.json")
    .pipe(map((res)=>{
      const offers = [];
      for(const key in res){
        offers.push({...res[key],id:key})
      }
      return offers;
    }))
  }
  subscribeToPlan(id:string){
    this.http.put(this.FirebaseURL+"controls/Offers/"+id+"/subscribed.json",true).subscribe()
  }

  deleteOffer(id:string){
    return this.http.delete(this.FirebaseURL+'controls/Offers/'+id+'.json');

  }

  addOffer(offer:any){
    return this.http.post(this.FirebaseURL+"controls/Offers.json",offer)

  }
}
