import { Component } from '@angular/core';
import { DbservService } from '../dbserv.service';
import { Bill } from 'src/models/bill';

@Component({
  selector: 'app-water',
  templateUrl: './water.component.html',
  styleUrls: ['./water.component.css']
})
export class WaterComponent {
    constructor(private usersService:DbservService){}
    loggedUser=this.usersService.loggedUser;
    isDeleting=false;
    pendingBills:Bill[] =[];
    paidBills:Bill[]=[];
    unitPrice:number=this.usersService.waterUnits
    ngOnInit(){
      this.loadpendingBills();
      this.loadPaidBills();
    }

    async loadpendingBills(){
      (await this.usersService.getPendingBills('waterBills')).subscribe((pendingBills)=>{
        this.pendingBills = pendingBills
        console.log(this.pendingBills)
      })
    }
    loadPaidBills(){
      this.usersService.getPaidBills('waterBills').subscribe((paidBills)=>{
        this.paidBills = paidBills
        console.log(this.paidBills)
      })
    }

    deleteBill(paidBill:Bill){
      this.isDeleting=true;
      this.usersService.deleteBill(paidBill.id,'waterBills');
      const index = this.paidBills.indexOf(paidBill);
      if (index > -1) { // only splice array when item is found
        this.paidBills.splice(index, 1); // 2nd parameter means remove one item only
      }
      this.isDeleting=false;
    }

    addToCart(pendingBill:Bill){
      let alreadyExists=false;
      this.usersService.loggedUserCart.forEach((item)=>{
        if(item.billNum==pendingBill.billNum){
          alreadyExists=true;
          return;
        }
      })
      if(alreadyExists){
        alert("Bill already in cart")
        console.log(this.usersService.loggedUserCart)
      }
      else{
        this.usersService.addToCart(pendingBill)
        alert("Bill added to cart")
      }
    }
}
