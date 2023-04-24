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
  loggedUserCart:Set<Bill>;
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

  
  getPendingWaterBills(){
    return this.http.get<{[key:string]:Bill}>('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/'+this.loggedUser.id+'/waterBills/Pending.json')
      .pipe(map((res)=>{
        const waterBills = [];
        for(const key in res){
          waterBills.push({...res[key],id:key})
        }
        return waterBills;
      }))
  }
  getPaidWaterBills(){
    return this.http.get<{[key:string]:Bill}>('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/'+this.loggedUser.id+'/waterBills/Paid.json')
      .pipe(map((res)=>{
        const waterBills = [];
        for(const key in res){
          waterBills.push({...res[key],id:key})
        }
        return waterBills;
      }))
  }

  deleteBill(id:string){
      this.http.delete('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/'+this.loggedUser.id+'/waterBills/Paid/'+id+'.json').subscribe();
  }

  addToCart(bill:Bill){
    console.log(bill)
    this.loggedUserCart.add(bill)
    this.http.put('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/'+this.loggedUser.id+'/cart.json',this.loggedUserCart)
      .subscribe((res)=>{
          console.log(res);
      })
  }
  getCart(){
    this.http.get('https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/users/'+this.loggedUser.id+'/cart.json')
      .pipe(map((res)=>{
        for(const key in res){
          this.loggedUserCart.add({...res[key]})
        }
      }))
      .subscribe((res)=>{
          console.log(res);
      })
    console.log(this.loggedUserCart)
  }

}
