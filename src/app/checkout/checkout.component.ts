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
  discount: number=0;

constructor(private usersService:DbservService ){}
loggedUser=this.usersService.loggedUser
total:number=0;
waterBills:Bill[]=[]
waterUnitPrice:number=this.usersService.waterUnits
electricBills:Bill[]=[]
electricUnitPrice:number=this.usersService.electricUnits
telephoneBills:Bill[]=[]
telephoneUnitPrice:number=this.usersService.telephoneUnits

loggedUserCart=this.usersService.loggedUserCart
private promoSubject = new Subject<string>();

promo:string
promoValid=false;
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




  get promoChanges() {
    return this.promoSubject.pipe(
      debounceTime(500)
    );
  }

}
