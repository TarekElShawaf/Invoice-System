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
  pendingBills: Bill[] = [];
  paidBills: Bill[] = [];
  unitPrice: number = this.usersService.telephoneUnits
  offers = [
    {
      name: '50% off on your first month',
      description: 'Get 50% discount on your first month bill on subscribing to our postpaid plan.'
    },
    {
      name: 'Refer a friend and get $10 credit',
      description: 'Refer a friend to our services and earn $10 credit on your next bill.'
    },
    {
      name: 'Upgrade to post-paid plan and get a free smartphone',
      description: 'Upgrade your plan to postpaid and get a free smartphone on your next billing cycle.'
    }
  ];
  selectedOffer = '';

  ngOnInit() {
    this.loadpendingBills();
    this.loadPaidBills();
  }

  async loadpendingBills() {
    (await this.usersService.getPendingBills('telephoneBills')).subscribe((pendingBills) => {
      this.pendingBills = pendingBills
      console.log(this.pendingBills)
    })
  }
  loadPaidBills() {
    this.usersService.getPaidBills('telephoneBills').subscribe((paidBills) => { 
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
      alert(`Bill ${pendingBill.billNum}Bill already in cart`)
      console.log(this.usersService.loggedUserCart)
    }
    else {
      this.usersService.addToCart(pendingBill)
      alert(`Bill ${pendingBill.billNum }Bill added to cart`)
    }
  }
  selectOffer(offerName: string) {
    this.selectedOffer = offerName;
  }
}