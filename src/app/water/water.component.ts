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

    ngOnInit(){
      this.loadpendingBills();
      this.loadPaidBills();
    }

    loadpendingBills(){
      this.usersService.getPendingWaterBills().subscribe((pendingBills)=>{
        this.pendingBills = pendingBills
        console.log(this.pendingBills)
      })
    }
    loadPaidBills(){
      this.usersService.getPaidWaterBills().subscribe((paidBills)=>{
        this.paidBills = paidBills
        console.log(this.paidBills)
      })
    }

    async deleteBill(id:string){
      this.isDeleting=true;
      this.usersService.deleteBill(id);

      await this.loadPaidBills();
      this.isDeleting=false;
    }

    addToCart(pendingBill:Bill){
      console.log(pendingBill)
      this.usersService.addToCart(pendingBill)
      console.log(this.usersService.loggedUserCart)

    }
}
