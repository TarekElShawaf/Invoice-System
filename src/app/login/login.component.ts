import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DbservService } from '../dbserv.service';
import { User } from 'src/models/user';
import { ControlsService } from '../controls.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  allUsers: User[] = [];
  found: boolean = false;
  loginClicked: boolean = false;
  emailStatus: any;
  passwordStatus: any;
  constructor(private router: Router,  private userService: UserService,  private controlsService: ControlsService) { }


  public loginForm = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
  });


  ngOnInit() {
    this.loginForm.controls.email.statusChanges.subscribe((value: any) => {
      this.emailStatus = value;
    })
    this.loginForm.controls.password.statusChanges.subscribe((value: any) => {
      this.passwordStatus = value
    })
    this.loadUsers();
    this.controlsService.getUnitPrices().subscribe();
  }

  loadUsers() {
    this.controlsService.getUsers().subscribe((users) => {
      this.allUsers = users
    })
  }

  onLogin(user: { email: String, password: String }) {
    this.loginClicked = true;
    let index = this.allUsers.findIndex(i => i.email.toLowerCase() == user.email.toLowerCase() && i.password == user.password)
    if (index > -1) {
      this.found=true;
      this.userService.loggedUser = this.allUsers[index];

      if (this.allUsers[index].admin) this.router.navigate(['admin'])

      else {
        this.userService.getCart().subscribe();
        console.log("cart from login:", this.userService.loggedUserCart)
        this.router.navigate(['home'])
      }
    }
  }
}





