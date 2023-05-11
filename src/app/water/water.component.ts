import { Component } from '@angular/core';
// import { DbservService } from '../dbserv.service';
import { Bill } from 'src/models/bill';
import { UserService } from '../user.service';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-water',
  templateUrl: './water.component.html',
  styleUrls: ['./water.component.css']
})
export class WaterComponent {
    showDialog: boolean;

    constructor(private userService:UserService, private controlsService:ControlsService){}
    loggedUser=this.userService.loggedUser;
    
    pendingBills:Bill[] =[];
    paidBills:Bill[]=[];
    Bills:Bill[]=[];
    unitPrice:number=this.controlsService.waterUnits
    
    ngOnInit(){
      // this.loadpendingBills();
      // this.loadPaidBills();
      this.loadBills();
    }

    // loadpendingBills() {
    //   this.usersService.getBills(('Pending'), ('waterBills')).subscribe((pendingBills) => {
    //     this.pendingBills = pendingBills
    //     console.log(this.pendingBills)
    //   })
    // }
  
    // loadPaidBills() {
    //   this.usersService.getBills(('Paid'), ('waterBills')).subscribe((paidBills) => {
    //     this.paidBills = paidBills
    //     console.log(this.paidBills)
    //   })
    // }

    loadBills() {
      this.paidBills=[];
      this.pendingBills=[];
      this.controlsService.getBillsofUser(this.loggedUser.id,'Water Bill').subscribe((bills) => {
        this.Bills = bills
        this.Bills.forEach((bill)=>{
          if(bill.status=="Pending") this.pendingBills.push(bill)
          else this.paidBills.push(bill);
        })
      })
    }

    deleteBill(bill:Bill){
      this.controlsService.deleteBill(this.loggedUser.id,bill.id).subscribe(()=>{
        let index = this.Bills.indexOf(bill);
        if (index > -1) { // only splice array when item is found
          this.Bills.splice(index, 1); // 2nd parameter means remove one item only
        }
        this.loadBills();
      });
    }

    addToCart(bill:Bill){
      let index= this.userService.loggedUserCart.findIndex(Bill=>Bill.id==bill.id)
      if(index>-1) alert("Bill already in cart")
      
      else{
        this.userService.addToCart(bill).subscribe()
        alert("Bill added to cart")
        console.log("Cart from water: ",this.userService.loggedUserCart)
      }
    }

    onCheckboxChange(event: any) {
      if (event.target.checked) this.showDialog=true;
    }
    closeDialog(){
      this.showDialog=false;
    }

    deletePaidBills(){
      this.Bills.forEach((bill)=>{
        if(bill.type=="Water Bill")
          this.controlsService.deleteBill(this.loggedUser.id,bill.id).subscribe(()=>{
            this.loadBills();
          });
      })
      this.showDialog=false;
    }
}
