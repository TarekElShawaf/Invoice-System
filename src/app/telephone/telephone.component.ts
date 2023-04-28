import { Component } from '@angular/core';
import { DbservService } from '../dbserv.service';
import { Bill } from 'src/models/bill';

@Component({
  selector: 'app-telephone',
  templateUrl: './telephone.component.html',
  styleUrls: ['./telephone.component.css']
})
export class TelephoneComponent {
  constructor(private usersService: DbservService) { }

  loggedUser = this.usersService.loggedUser;
  isDeleting = false;
  selectedTab = 'bills';
  offerSelected: string = '';
  serviceProviders: any[] = [];
  selectedServiceProvider: any;
  tariffPlans: any[] = [];
  selectedTariffPlan: any;
  pendingBills: Bill[] = [];
  paidBills: Bill[] = [];
  unitPrice: number = this.usersService.telephoneUnits


  ngOnInit() {
    this.loadpendingBills();
    this.loadPaidBills();
  }

  loadpendingBills() {
    this.usersService.getBills(('Pending'), ('telephoneBills')).subscribe((pendingBills) => {
      this.pendingBills = pendingBills
      console.log(this.pendingBills)
    })
  }
  loadPaidBills() {
    this.usersService.getBills(('Paid'), ('telephoneBills')).subscribe((paidBills) => { 
      this.paidBills = paidBills
      console.log(this.paidBills)
    })
  }
  deleteBill(paidBill: Bill) {
    this.isDeleting = true;
    this.usersService.deleteBill(paidBill.id, 'telephoneBills');
    const index = this.paidBills.indexOf(paidBill);
    if (index > -1) {
      this.paidBills.splice(index, 1);
    }
    this.isDeleting = false;
  }

  addToCart(pendingBill: Bill) {
    let alreadyExists = false;
    this.usersService.loggedUserCart.forEach((item) => {
      if (item.billNum == pendingBill.billNum) {
        alreadyExists = true;
        return;
      }
    })
    if (alreadyExists) {
      alert(`Bill ${pendingBill.billNum} already in cart`)
      console.log(this.usersService.loggedUserCart)
    }
    else {
      this.usersService.addToCart(pendingBill)
      alert(`Bill ${pendingBill.billNum } added to cart`)
    }
  }
}