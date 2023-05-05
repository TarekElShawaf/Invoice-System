import { Component } from '@angular/core';
import { DbservService } from '../dbserv.service';
import { Observable } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  allOffers: any[];
  currentProvider: string;
  datePatternValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const pattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!control.value || !pattern.test(control.value)) {
      return { 'invalidDatePattern': true };
    }
    const inputDate = new Date(control.value);
    const currentDate = new Date();
    if (inputDate.getTime() < currentDate.getTime()) {
      return { 'invalidDate': true };
    }
    return null;
  }


  userToViewBills: any;
  userBills=[]
  public billForm = new FormGroup({
    billUnits: new FormControl('', Validators.required ),
    dueDate: new FormControl('',Validators.compose([Validators.required,this.datePatternValidator])),
    billType: new FormControl('', Validators.required ),
    billNum: new FormControl('', Validators.required ),

  });
  public offerForm = new FormGroup({
    offerPlan: new FormControl('', Validators.required ),
    price: new FormControl('',Validators.required),
    // provider: new FormControl('', Validators.required ),
    totalUnits: new FormControl('', Validators.required ),

  });

  constructor(private usersService:DbservService){}
  allUsers: any[] =[];
  promoCodes:any[]=[];
  promoCode:string;
  promoValue:number;
  waterUnitPrice:number=this.usersService.waterUnits
  electricUnitPrice:number=this.usersService.electricUnits
  telephoneUnitPrice:number=this.usersService.telephoneUnits
  showDialog = false;
  dialogOpened:string
  inputValue:number
  userToEdit:any;
  showProviderDialog=false;
  ngOnInit(){
    this.loadUsers();
    this.loadPromoCodes();
    this.loadOffers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe((users)=>{
      this.allUsers = users
      console.log(this.allUsers);
    })
  }
  loadPromoCodes() {
    this.usersService.getPromoCodes().subscribe((codes)=>{
      this.promoCodes = codes
      console.log(codes);
    })
  }
  openDialog(type:string,user?:any) {
    this.showDialog = true;
    this.dialogOpened=type;
    switch(type){
      case 'electricUnits':
        this.inputValue=this.electricUnitPrice;
        break;
      case 'waterUnits':
        this.inputValue=this.waterUnitPrice;
        break;
      case 'telephoneUnits':
        this.inputValue=this.telephoneUnitPrice;
        break;
      case 'user':
        this.userToEdit=user;
        break;
      case 'bills':
       this.userToViewBills=user;
       this.loadUserBills(user.id)
        break;
    }
  }

  closeDialog() {
    this.showDialog = false;
    this.userToEdit=null;
    this.userToViewBills=null;
    this.showProviderDialog=false;
  }


  addPromoCode(code:string,value:number){
    let promo={code,value}
    console.log(promo)
    if(this.promoCodes.findIndex(x => x.code == promo.code)>-1) alert("Promo code already exists.")
    else{
      this.usersService.addPromoCode(promo).subscribe(()=>{
        this.loadPromoCodes();

      }); 
    }
    this.promoCode=null;
    this.promoValue=null;
  }

  unitChanged(newUnit:number){
    this.usersService.changeUnit(this.dialogOpened,newUnit)
    this.waterUnitPrice=this.usersService.waterUnits
    this.electricUnitPrice=this.usersService.electricUnits
    this.telephoneUnitPrice=this.usersService.telephoneUnits
    alert("Value Changed")
    this.showDialog = false;
  }

  userChanged(){
    this.usersService.updateUser(this.userToEdit)
    alert("Value Changed")
    this.userToEdit=null;
    this.showDialog=false;
  }
  deletePromoCode(code:any){
    this.usersService.deletePromo(code).subscribe(()=>{
      this.loadPromoCodes();
    })
  }

  loadUserBills(id:string){
    this.userBills=this.usersService.getBillsofUser(id)
  }
  deleteBill(bill:any){
    switch(bill.type){
      case 'Water Bill':
        this.usersService.adminDeleteBill(bill.id,'waterBills')
        break;
      case 'Electric Bill':
        this.usersService.adminDeleteBill(bill.id,'electricBills')
        break; 
      case 'Telephone Bill':
        this.usersService.adminDeleteBill(bill.id,'telephoneBills')
        break;      
    }
    const index = this.userBills.indexOf(bill);
    if (index > -1) { // only splice array when item is found
      this.userBills.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  addBill(form:{billType:string,billNum:number,billUnits:number,dueDate:string}){
    let bill={billNum:form.billNum,billUnits:form.billUnits,dueDate:form.dueDate}
    console.log(bill)
    this.usersService.addBill(this.userToViewBills.id,form.billType,bill).subscribe(()=>{
      this.loadUserBills(this.userToViewBills.id)
    })
  }
  openProvider(type:string){
    this.showProviderDialog=true;
    this.currentProvider=type;
  }
  loadOffers(){
    this.usersService.getAllOffers().subscribe((offers)=>{
      this.allOffers = offers
    })
  }
  deleteOffer(offer:any){
    this.usersService.deleteOffer(offer.id).subscribe(()=>{
      this.loadOffers()
    });
  }
  addOffer(offer:any){
    let uploadedOffer={ provider: this.currentProvider, plan: offer.offerPlan, totalUnits: offer.totalUnits,price:offer.price, subscribed: false}
    this.usersService.addOffer(uploadedOffer).subscribe(()=>{
      this.loadOffers()
    });
  }
}
