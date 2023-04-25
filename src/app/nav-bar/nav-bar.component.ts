import { Component } from '@angular/core';
import { DbservService } from '../dbserv.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  constructor(private usersService:DbservService,private router:Router){
  }
  loggedUser=this.usersService.loggedUser

  logout(){
    this.usersService.loggedUser=null;
    this.usersService.loggedUserCart=[]
    this.router.navigate(['login'])
  }
}
