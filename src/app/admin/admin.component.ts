import { Component } from '@angular/core';
import { DbservService } from '../dbserv.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(private usersService:DbservService){}
  allUsers: any[] =[];
  waterUnitPrice:number=this.usersService.waterUnits
  electricUnitPrice:number=this.usersService.electricUnits
  telephoneUnitPrice:number=this.usersService.telephoneUnits
  showDialog = false;
  dialogOpened:string
  inputValue:number
  userToEdit:any;
  ngOnInit(){
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe((users)=>{
      this.allUsers = users
      console.log(this.allUsers);
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
    }
  }

  closeDialog() {
    this.showDialog = false;
    this.userToEdit=null;
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
}
