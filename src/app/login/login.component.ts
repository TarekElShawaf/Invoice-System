import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  emailStatus:any;
  passwordStatus:any;
  public loginForm = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.required,Validators.email]) ),
    password: new FormControl('',Validators.compose([Validators.required,Validators.minLength(8)])),
  });

  formEmail:string = this.loginForm.controls.email.value!;
  formPassword:string = this.loginForm.controls.password.value!;

  // public validateLogin():void {
  //   RouterModule.navigate()
  // }
ngOnInit(){
  this.loginForm.controls.email.statusChanges.subscribe((value:any)=>{
    console.log(value)
    this.emailStatus=value;
  })
  this.loginForm.controls.password.statusChanges.subscribe((value:any)=>{
    console.log(value)
    this.passwordStatus=value
  })
}



}
