import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Bill } from 'src/models/bill';

@Injectable({
  providedIn: 'root'
})
export class DbservService {

  constructor(private http:HttpClient) { }

  loggedUser:any;

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

}
