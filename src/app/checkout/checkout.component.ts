import { Component } from '@angular/core';
import { DbservService } from '../dbserv.service';
import { Bill } from 'src/models/bill';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

constructor(private usersService:DbservService ){}
loggedUser=this.usersService.loggedUser
total:number=0;
waterBills:Bill[]=[]
waterUnitPrice:number=this.usersService.waterUnits
electricBills:Bill[]=[]
electricUnitPrice:number=this.usersService.electricUnits
telephoneBills:Bill[]=[]
telephoneUnitPrice:number=this.usersService.telephoneUnits

loggedUserCart=this.usersService.loggedUserCart



  async ngOnInit(){
  this.total=0;
  this.loadpendingBills();
  console.log(this.loggedUserCart)
  

}
  loadpendingBills(){
    this.usersService.getBills(('Pending'), ('waterBills')).subscribe((pendingBills) => {
    this.waterBills = pendingBills
    this.calculateTotal(this.waterBills,this.waterUnitPrice)
  })
  this.usersService.getBills(('Pending'), ('electricBills')).subscribe((pendingBills) => {
    this.electricBills = pendingBills
    this.calculateTotal(this.electricBills,this.electricUnitPrice)

  })
  console.log(this.waterBills)
  console.log(this.electricBills)
}
  findIndex(bill:Bill,billarr:Bill[]){
    if(billarr.findIndex(x=>x.id==bill.id)>-1)return true;
    else return false;
  }

  calculateTotal(billarr:Bill[],unitPrice:number){
    this.loggedUserCart.forEach((bill)=>{
      if(bill.id==null)return;
      if(this.findIndex(bill,billarr)) this.total+=(bill.billUnits*unitPrice)
      // else if(this.findIndex(bill,this.electricBills)) this.total+=(bill.billUnits*unitPrice)
      // console.log(this.total)
    })
  }
}
