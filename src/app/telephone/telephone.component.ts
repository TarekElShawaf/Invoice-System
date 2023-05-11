import { Component } from '@angular/core';
import { DbservService } from '../dbserv.service';
import { Bill } from 'src/models/bill';

@Component({
  selector: 'app-telephone',
  templateUrl: './telephone.component.html',
  styleUrls: ['./telephone.component.css']
})
export class TelephoneComponent {
  billingAccounts: any[];
  constructor(private usersService: DbservService) { }

  loggedUser = this.usersService.loggedUser;
  isDeleting = false;
  selectedTab = 'bills';
  offerSelected: string = '';
  serviceProviders: any[] = [];
  selectedServiceProvider: any;
  tariffPlans: any[] = [];
  selectedTariffPlan: any;
  pendingBills: any[] = [];
  paidBills: any[] = [];
  unitPrice: number = this.usersService.telephoneUnits


  ngOnInit() {
    this.loadpendingBills();
    this.loadPaidBills();
    this.loadbBillingAccounts()
  }

  loadpendingBills() {
    this.usersService.getBills(('Pending'), ('telephoneBills')).subscribe((pendingBills) => {
      pendingBills.forEach((bill)=>{
        if(bill.type==null)this.pendingBills.push(bill)
      })
      console.log(this.pendingBills)
      console.log(this.unitPrice)
    })
  }
  loadPaidBills() {
    this.usersService.getBills(('Paid'), ('telephoneBills')).subscribe((paidBills) => { 
      this.paidBills = paidBills
      console.log(this.paidBills)
    })
  }
  loadbBillingAccounts(){
    this.usersService.getBillingAccounts().subscribe((accs)=>{
      this.billingAccounts=accs;
      console.log(this.billingAccounts)
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

  addToCart(pendingBill: any,account?:boolean) {
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
        if(account){
          const currentDate = new Date();
          // get the day, month, and year values of the current date
          const day = currentDate.getDate();
          const month = currentDate.getMonth() + 1;
          const year = currentDate.getFullYear();
          // create a string representation of the date in the format "dd/mm/yyyy"
          const dateString = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year.toString()}`;
          let bill : Bill = {billNum:pendingBill.number,dueDate:dateString,type:'account',offerValue:pendingBill.total,id:pendingBill.id,status:'pending'}
          this.usersService.addToCart(bill)
          this.usersService.addBill(this.usersService.loggedUser.id,'telephoneBills',bill).subscribe()
          alert(`Billing Account Bill ${bill.billNum } added to cart`)

        }
        else{
          this.usersService.addToCart(pendingBill)
          alert(`Bill ${pendingBill.billNum } added to cart`)
        }
        }  



    }

  }
