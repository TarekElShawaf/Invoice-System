import { Component } from '@angular/core';
import { DbservService } from '../dbserv.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  constructor(private userService:UserService,private router:Router){
  }
  loggedUser=this.userService.loggedUser

  logout(){
    this.userService.loggedUser=null;
    this.userService.loggedUserCart=[]
    this.router.navigate(['login'])
  }
}
