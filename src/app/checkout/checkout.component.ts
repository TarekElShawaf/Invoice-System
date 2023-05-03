import { Component } from '@angular/core';
import { DbservService } from '../dbserv.service';
import { Bill } from 'src/models/bill';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

constructor(private usersService:DbservService ){}
loggedUser=this.usersService.loggedUser
total:number=0;
discount:number=0;
waterBills:Bill[]=[]
waterUnitPrice:number=this.usersService.waterUnits
electricBills:Bill[]=[]
electricUnitPrice:number=this.usersService.electricUnits
telephoneBills:Bill[]=[]
telephoneUnitPrice:number=this.usersService.telephoneUnits

loggedUserCart=this.usersService.loggedUserCart
private promoSubject = new Subject<string>();
  selectedPaymentMethod: any;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  promo: string;
  paymentMethod: string;
  paymentMethodInvalid: boolean;
  cardNumberInvalid: boolean;
  expiryDateInvalid: boolean;
  cvvInvalid: boolean;
  promoValid: boolean;
  promoInvalid: boolean;
  formValid: boolean;
  prevValidPromo='';
  promos:any[]
async ngOnInit(){
  this.total=0;
  this.promoChanges.subscribe(promo => {
    this.checkPromo(promo);
  });
  this.loadpendingBills();
  this.loadPromos();
  

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

  loadPromos(){
    this.usersService.getPromoCodes().subscribe((promos)=>{
      this.promos=promos
      console.log(promos)
    })
  }
  checkPaymentMethod(paymentMethod: string) {
    this.paymentMethodInvalid = (paymentMethod === '');
  }

  checkPromo(promo: string) {
    this.total = this.total || 0;
    let index = this.promos.findIndex(x => x.code == promo)
    let prevPromoIndex = this.promos.findIndex(x => x.code === this.prevValidPromo)

    if (index > -1) {
      if (this.prevValidPromo != '') this.total += parseFloat(this.promos[prevPromoIndex].value);
      this.discount=parseFloat(this.promos[index].value)
      this.total -= parseFloat(this.promos[index].value);
      this.prevValidPromo = promo;
      if (this.total < 0) this.total = 0
      this.promoValid = true;
    } else {
      if (this.prevValidPromo != '') this.total += parseFloat(this.promos[prevPromoIndex].value);
      this.prevValidPromo = ''
      this.promoValid = false;
      this.discount=0;
    }
  }

  checkCVV(cvv: string) {
    if (cvv && cvv.length === 3 && /^\d+$/.test(cvv)) {
      this.cvvInvalid = false;
    } else {
      this.cvvInvalid = true;
    }
  }

  checkCardNumber(cardNumber: string) {
    if (cardNumber && cardNumber.length === 16 && /^\d+$/.test(cardNumber)) {
      this.cardNumberInvalid = false;
    } else {
      this.cardNumberInvalid = true;
    }
  }

  checkExpiryDate(expiryDate: string) {
    if (expiryDate && /^\d{2}\/\d{2}$/.test(expiryDate)) {
      const [month, year] = expiryDate.split('/');
      const date = new Date(parseInt(`20${year}`, 10), parseInt(month, 10) - 1, 1);
      const now = new Date();
      if (date > now) {
        this.expiryDateInvalid = false;
      } else {
        this.expiryDateInvalid = true;
      }
    } else {
      this.expiryDateInvalid = true;
    }
  }

  get promoChanges() {
    return this.promoSubject.pipe(
      debounceTime(500)
    );
  }

  pay(paymentClear){
    if (paymentClear.form.invalid) {
      alert('Please select a valid payment method before continuing.');
    }
    else{
      let paidWater=[]
      let paidElectric=[]
      let paidTelephone=[]
      this.loggedUserCart.forEach((bill)=>{
        if(bill.id==null)return;
        else if(this.findIndex(bill,this.waterBills)) paidWater.push(bill)
        else if(this.findIndex(bill,this.electricBills)) paidElectric.push(bill)
        else if(this.findIndex(bill,this.telephoneBills)) paidTelephone.push(bill)
        // else if(this.findIndex(bill,this.electricBills)) this.total+=(bill.billUnits*unitPrice)
        // console.log(this.total)
      })
      this.usersService.payBills(paidWater,'waterBills').subscribe()
      this.usersService.payBills(paidElectric,'electricBills').subscribe()
      this.usersService.payBills(paidTelephone,'telephoneBills').subscribe()
      this.usersService.clearCart();
      alert("Payment Succesful")
    }
  }

}
