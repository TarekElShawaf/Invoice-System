import { Component } from '@angular/core';
// import { DbservService } from '../dbserv.service';
import { Bill } from 'src/models/bill';
import { UserService } from '../user.service';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-electricity-bills',
  templateUrl: './electricity.component.html',
  styleUrls: ['./electricity.component.css']
})
export class ElectricityComponent {
  constructor(private userService:UserService, private controlsService:ControlsService) { }
  loggedUser = this.userService.loggedUser;
  unitPrice:number = this.controlsService.electricUnits
  Bills:Bill[]=[];
  pendingBills: Bill[] = [];
  paidBills: Bill[] = [];

  ngOnInit() {
    // this.loadpendingBills();
    // this.loadPaidBills();
    this.loadBills();
  }

  // loadpendingBills() {
  //    this.usersService.getBills(('Pending'), ('electricBills')).subscribe((pendingBills) => {
  //     this.pendingBills = pendingBills
  //     console.log(this.pendingBills)
  //   })
  // }

  // loadPaidBills() {
  //   this.usersService.getBills(('Paid'),('electricBills')).subscribe((paidBills) => {
  //     this.paidBills = paidBills
  //     console.log(this.paidBills)
  //   })
  // }
  loadBills() {
    this.paidBills=[];
    this.pendingBills=[];
    this.controlsService.getBillsofUser(this.loggedUser.id,'Electric Bill').subscribe((bills) => {
      this.Bills = bills
      console.log("Bills from electricity: ",this.Bills);
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
      console.log("Cart from electricity: ",this.userService.loggedUserCart)
    }
  }
}
