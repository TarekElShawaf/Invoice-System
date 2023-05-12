import { Component } from '@angular/core';
import { Bill } from 'src/models/bill';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from '../user.service';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  constructor( private userService: UserService, private controlsService: ControlsService) { }
  loggedUser = this.userService.loggedUser

  total: number = 0;
  discount: number = 0;

  Bills: Bill[] = [];
  pendingBills: Bill[] = [];
  promos: any[];

  waterUnitPrice: number = this.controlsService.waterUnits
  electricUnitPrice: number = this.controlsService.electricUnits
  telephoneUnitPrice: number = this.controlsService.telephoneUnits

  loggedUserCart = this.userService.loggedUserCart
  private promoSubject = new Subject<string>();

  selectedPaymentMethod: any;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  promo: string='';
  paymentMethod: string;
  paymentMethodInvalid: boolean;
  cardNumberInvalid: boolean;
  expiryDateInvalid: boolean;
  cvvInvalid: boolean;
  promoValid: boolean;
  promoInvalid: boolean;

  formValid: boolean;
  prevValidPromo = '';

  ngOnInit() {
    this.total = 0;
    this.promoChanges.subscribe(promo => {
      this.checkPromo(promo);
    });
    // this.loadpendingBills();
    this.loadPromos();
    this.loadBills();

  }
  loadBills() {
    this.pendingBills = [];
    this.controlsService.getBillsofUser(this.loggedUser.id).subscribe((bills) => {
      this.Bills = bills
      this.calculateTotal();
    })
    this.Bills.forEach((bill) => {
      if (bill.status == "Pending") this.pendingBills.push(bill)
    })
  }

  calculateTotal() {
    this.loggedUserCart.forEach((bill) => {
      switch (bill.type) {
        case "Water Bill":
          this.total += bill.units * this.waterUnitPrice;
          break;
        case "Electric Bill":
          this.total += bill.units * this.electricUnitPrice;
          break;
        case "Telephone Bill":
          this.total += bill.units * this.telephoneUnitPrice;
          break;
        case "Offer":
          this.total += bill.offerValue;
          break;
      }
    })
    console.log("total from calculate: ", this.total);
  }


  //   loadpendingBills(){
  //     this.usersService.getBills(('Pending'), ('waterBills')).subscribe((pendingBills) => {
  //     this.waterBills = pendingBills
  //     this.calculateTotal(this.waterBills,this.waterUnitPrice)
  //     console.log("total1:",this.total)

  //   })
  //   this.usersService.getBills(('Pending'), ('electricBills')).subscribe((pendingBills) => {
  //     this.electricBills = pendingBills
  //     this.calculateTotal(this.electricBills,this.electricUnitPrice)
  //     console.log("total2:",this.total)

  //   })
  //   this.usersService.getBills(('Pending'), ('telephoneBills')).subscribe((pendingBills) => {
  //     this.telephoneBills = pendingBills
  //     this.calculateTotal(this.telephoneBills,this.telephoneUnitPrice,true)

  //     console.log("total3:",this.total)
  //     console.log("cart from checkout",this.loggedUserCart)
  //   })
  //   console.log(this.waterBills)
  //   console.log(this.electricBills)
  // }
  findIndex(bill: Bill, billarr: Bill[]) {
    // if((bill.type=='telephoneBill'||bill.type=='account' ) && billarr.findIndex(x=>x.billNum==bill.billNum)>-1)return true;
    if (billarr.findIndex(x => x.id == bill.id) > -1) return true;
    else return false;
  }



  loadPromos() {
    this.controlsService.getPromoCodes().subscribe((promos) => {
      this.promos = promos
      console.log("promos from loadPromos: ", promos);
    })
  }

  checkPromo(promo: string) {
    this.total = this.total || 0;
    let index = this.promos.findIndex(x => x.code.toLowerCase() == promo.toLowerCase())
    let prevPromoIndex = this.promos.findIndex(x => x.code === this.prevValidPromo)
    //If Promo found re-add previously discounted value (if there was) and deducte the new Promo value 
    if (index > -1) {
      if (this.prevValidPromo != '') this.total += parseFloat(this.promos[prevPromoIndex].value);
      this.discount = parseFloat(this.promos[index].value)
      this.total -= parseFloat(this.promos[index].value);
      this.prevValidPromo = promo;
      if (this.total < 0) this.total = 0
      this.promoValid = true;
    } else {
      if (this.prevValidPromo != '') this.total += parseFloat(this.promos[prevPromoIndex].value);
      this.prevValidPromo = ''
      this.promoValid = false;
      this.discount = 0;
    }
  }

  checkPaymentMethod(paymentMethod: string) {
    this.paymentMethodInvalid = (paymentMethod === '');
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

  pay(paymentClear) {
    if (paymentClear.form.invalid) {
      alert('Please select a valid payment method before continuing.');
    }
    else {
      this.loggedUserCart=this.userService.loggedUserCart;
      this.userService.payBills()
      this.userService.clearCart().subscribe(()=>{
        this.total=0;
        this.discount=0;
      });
      alert("Payment Succesful");
    }
  }

}
