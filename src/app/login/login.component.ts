import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DbservService } from '../dbserv.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  allUsers: any[] =[];
  found:boolean =false;
  constructor(private usersService:DbservService , private router:Router){

  }


  emailStatus:any;
  passwordStatus:any;
  public loginForm = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.required,Validators.email]) ),
    password: new FormControl('',Validators.compose([Validators.required,Validators.minLength(8)])),
  });

  // formEmail:string = this.loginForm.controls.email.value!;
  // formPassword:string = this.loginForm.controls.password.value!;

  // public validateLogin():void {
  //   RouterModule.navigate()
  // }
ngOnInit(){
  this.loginForm.controls.email.statusChanges.subscribe((value:any)=>{
    this.emailStatus=value;
  })
  this.loginForm.controls.password.statusChanges.subscribe((value:any)=>{
    this.passwordStatus=value
  })
  this.loadUsers();

}

loadUsers() {
  this.usersService.getUsers().subscribe((users)=>{
    this.allUsers = users
  })
}

onLogin(user:{email:String,password:String}){
  this.allUsers.forEach((i)=>{
    if(i.email==user.email&&i.password==user.password){
      this.found=true;
      this.usersService.loggedUser=i;
      return;
    }
  })
  this.router.navigate(['home'])
}



}


