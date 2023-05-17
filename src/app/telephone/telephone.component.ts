import { Component } from '@angular/core';
import { DbservService } from '../dbserv.service';
import { Bill } from 'src/models/bill';
import { UserService } from '../user.service';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-telephone',
  templateUrl: './telephone.component.html',
  styleUrls: ['./telephone.component.css']
})
export class TelephoneComponent {
  constructor(private usersService: DbservService,private userService:UserService,private controlsService:ControlsService) { }

  billingAccounts: any[];
  loggedUser = this.userService.loggedUser;
  Bills:Bill[]=[];
  // isDeleting = false;
  selectedTab = 'bills';
  offerSelected: string = '';
  serviceProviders: any[] = [];
  selectedServiceProvider: any;
  tariffPlans: any[] = [];
  selectedTariffPlan: any;
  pendingBills: any[] = [];
  paidBills: any[] = [];
  unitPrice: number = this.controlsService.telephoneUnits


  ngOnInit() {
    this.loadBills();
    this.loadBillingAccounts()
  }

  loadBills() {
    this.paidBills=[];
    this.pendingBills=[];
    this.controlsService.getBillsofUser(this.loggedUser.id,'Telephone Bill').subscribe((bills) => {
      this.Bills = bills
      this.Bills.forEach((bill)=>{
        if(bill.status=="Pending") this.pendingBills.push(bill)
        else this.paidBills.push(bill);
      })
    })
  }

  loadBillingAccounts(){
    this.controlsService.getBillingAccounts(this.loggedUser.id).subscribe((accs)=>{
      this.billingAccounts=accs;
      console.log("billing accounts from telephone: ",this.billingAccounts)
      this.calculateAccountTotal();
    })
  }
  
  deleteBill(paidBill: Bill) {
    // this.isDeleting = true;
    this.controlsService.deleteBill(this.loggedUser.id,paidBill.id).subscribe(()=>{
      const index = this.paidBills.indexOf(paidBill);
      if (index > -1) {
        this.paidBills.splice(index, 1);
      }
      this.loadBills();
    })
    // this.isDeleting = false;
  }

  calculateAccountTotal(){
    this.billingAccounts.forEach((account)=>{
      account.total=0;
      this.pendingBills.forEach((bill)=>{
        if(bill.accountNum==account.number) account.total+=(bill.units*this.unitPrice)
      })
    })
  }

  addToCart(bill: Bill,accountNum?:string) {
    // let alreadyExists = false;
    //   this.usersService.loggedUserCart.forEach((item) => {
    //     if (item.billNum == pendingBill.billNum) {
    //       alreadyExists = true;
    //       return;
    //     }
    //   })
    //   if (alreadyExists) {
    //     alert(`Bill ${pendingBill.billNum} already in cart`)
    //     console.log(this.usersService.loggedUserCart)
    //   }
    //   else {
    //     if(account){
    //       const currentDate = new Date();
    //       // get the day, month, and year values of the current date
    //       const day = currentDate.getDate();
    //       const month = currentDate.getMonth() + 1;
    //       const year = currentDate.getFullYear();
    //       // create a string representation of the date in the format "dd/mm/yyyy"
    //       const dateString = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year.toString()}`;
    //       let bill : Bill = {billNum:pendingBill.number,dueDate:dateString,type:'account',offerValue:pendingBill.total,id:pendingBill.id,status:'pending'}
    //       this.usersService.addToCart(bill)
    //       this.usersService.addBill(this.usersService.loggedUser.id,'telephoneBills',bill).subscribe()
    //       alert(`Billing Account Bill ${bill.billNum } added to cart`)

    //     }
    //     else{
    //       this.usersService.addToCart(pendingBill)
    //       alert(`Bill ${pendingBill.billNum } added to cart`)
    //     }
    //     }  
    if(accountNum==null){
      let index= this.userService.loggedUserCart.findIndex(Bill=>Bill.id==bill.id)
      if(index>-1) alert("Bill already in cart")
      else{
        this.userService.addToCart(bill).subscribe(()=>{
          alert("Bill added to cart")
          console.log("Cart from Telephone: ",this.userService.loggedUserCart)
        })

      }
    }
    else{
      let cartLength=this.userService.loggedUserCart.length;
      this.pendingBills.forEach((bill)=>{
        if(bill.accountNum==accountNum&&this.userService.loggedUserCart.findIndex(x=>x.billNum==bill.billNum)<0) this.userService.addToCart(bill).subscribe(()=>{
          console.log("bill from billing account: ",bill);
        })
      })
      if(cartLength==this.userService.loggedUserCart.length) alert("Bills already in cart.")
      else alert("Bills listed with this billing account have been added to your cart.");
    }


    }

  }
