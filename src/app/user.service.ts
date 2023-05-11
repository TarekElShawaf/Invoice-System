import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Bill } from 'src/models/bill';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  FirebaseURL:string ='https://angularui-b824b-default-rtdb.europe-west1.firebasedatabase.app/';
  constructor(private http:HttpClient) { }

  loggedUser:User;
  loggedUserCart: Array<Bill> = new Array();


  //Removing IDs from object to avoid redundency when adding data
  
  //Add New User To DB
  createUser(user:User){
    let removedIdUser= delete user.id;
    return this.http.post(this.FirebaseURL+'users.json',removedIdUser)
  }




  //Add Bill To Current User Cart
  addToCart(bill:Bill){
    this.loggedUserCart.push(bill)
    return this.http.put(this.FirebaseURL+'users/'+this.loggedUser.id+'/cart.json',this.loggedUserCart);
  }
  //Get Current User Cart
  getCart(){
    return this.http.get(this.FirebaseURL+'users/'+this.loggedUser.id+'/cart.json')
      .pipe(map((res)=>{
        for(const key in res){
          if(res[key]!=null) this.loggedUserCart.push({...res[key]})
        }
      }))
  }
  //Clear Current User Cart
  clearCart() {
    this.loggedUserCart = [];
    return this.http.delete(this.FirebaseURL+ "users/" +this.loggedUser.id +"/cart.json")
  }
  



  //Pay Bills In Cart
  payBills() {
    this.loggedUserCart.forEach((bill) => {
      bill.status = "Paid";
      
      const index = this.loggedUserCart.indexOf(bill);
      if (index > -1) this.loggedUserCart.splice(index, 1); // only splice array when item is found && 2nd parameter means remove one item only

      this.http.put(this.FirebaseURL+'users/' + this.loggedUser.id + '/Bills/'+bill.id+'.json',bill).subscribe();
    });    
  }

}
