import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/models/user';
import { UserService } from '../user.service';
import { ControlsService } from '../controls.service';
import { AdminService } from '../admin.service';
import { Bill } from 'src/models/bill';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  allOffers: any[];
  currentProvider: string;
  userToViewBills: User;
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

  constructor(private userService:UserService, private controlsService:ControlsService,private adminService:AdminService,private router:Router){}
  
  allUsers: any[] =[];
  promoCodes:any[]=[];

  promoCode:string;
  promoValue:number;

  loggedUser = this.userService.loggedUser

  waterUnitPrice:number=this.controlsService.waterUnits
  electricUnitPrice:number=this.controlsService.electricUnits
  telephoneUnitPrice:number=this.controlsService.telephoneUnits

  showDialog = false;
  dialogOpened:string;
  inputValue:number;
  userToEdit:User;

  showProviderDialog=false;

  ngOnInit(){
    this.loadUsers();
    this.loadPromoCodes();
    this.loadOffers();
  }
  logout(){
    this.userService.loggedUser=null;
    this.userService.loggedUserCart=[]
    this.router.navigate(['login'])
  }



  loadUsers() {
    this.controlsService.getUsers().subscribe((users)=>{
      this.allUsers = users;
    })
  }
  loadPromoCodes() {
    this.controlsService.getPromoCodes().subscribe((codes)=>{
      this.promoCodes = codes;
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
    if(this.promoCodes.findIndex(x => x.code == promo.code)>-1) alert("Promo code already exists.")
    else{
      this.adminService.addPromoCode(promo).subscribe(()=>{
        this.loadPromoCodes();
      }); 
    }
    //reset values;
    this.promoCode=null;
    this.promoValue=null;
  }

  unitChanged(newUnit:number){
    this.adminService.changeUnit(this.dialogOpened,newUnit).subscribe();

    this.waterUnitPrice=this.controlsService.waterUnits
    this.electricUnitPrice=this.controlsService.electricUnits
    this.telephoneUnitPrice=this.controlsService.telephoneUnits

    alert("Value Changed")
    this.showDialog = false;
  }

  userChanged(){
    this.adminService.updateUser(this.userToEdit).subscribe();
    alert("Value Changed")
    this.userToEdit=null;
    this.showDialog=false;
  }

  deletePromoCode(promoCode:any){
    this.adminService.deletePromo(promoCode).subscribe(()=>{
      this.loadPromoCodes();
    })
  }

  loadUserBills(userId:string){
    this.controlsService.getBillsofUser(userId).subscribe((bills)=>{
      this.userBills=bills;
    })
  }

  deleteBill(bill:Bill){

    this.controlsService.deleteBill(this.userToViewBills.id,bill.id).subscribe();
    let index = this.userBills.indexOf(bill);
    if (index > -1) { // only splice array when item is found
      this.userBills.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  addBill(form:{billType:string,billNum:number,billUnits:number,dueDate:string}){
    let bill:Bill;
    bill={billNum:form.billNum, units:form.billUnits, dueDate:form.dueDate, type:form.billType, status:'Pending'}
    console.log("bill from addBill: ",bill)
    this.adminService.addBill(this.userToViewBills.id,bill).subscribe(()=>{
      this.loadUserBills(this.userToViewBills.id)
    })
  }




  openProvider(type:string){
    this.showProviderDialog=true;
    this.currentProvider=type;
  }
  loadOffers(){
    this.controlsService.getAllOffers().subscribe((offers)=>{
      this.allOffers = offers
    })
  }
  deleteOffer(offer:any){
    this.adminService.deleteOffer(offer.id).subscribe(()=>{
      this.loadOffers()
    });
  }
  addOffer(offer:any){
    let uploadedOffer={ provider: this.currentProvider, plan: offer.offerPlan, totalUnits: offer.totalUnits,price:offer.price, subscribed: false}
    this.adminService.addOffer(uploadedOffer).subscribe(()=>{
      this.loadOffers()
    });
  }




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
}
