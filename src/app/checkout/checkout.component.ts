import { Component } from '@angular/core';
import { DbservService } from '../dbserv.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

constructor(private usersService:DbservService ){}
loggedUser=this.usersService.loggedUser
}
