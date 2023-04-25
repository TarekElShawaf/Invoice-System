import { Component } from '@angular/core';
import { DbservService } from '../dbserv.service';
import { Bill } from 'src/models/bill';

@Component({
  selector: 'app-electricity-bills',
  templateUrl: './electricity.component.html',
  styleUrls: ['./electricity.component.css']
})
export class ElectricityComponent {
  constructor(private usersService: DbservService) { }
  loggedUser = this.usersService.loggedUser;
  isDeleting = false;
  pendingBills: Bill[] = [];
  paidBills: Bill[] = [];

  ngOnInit() {
    this.loadpendingBills();
    this.loadPaidBills();
  }

  loadpendingBills() {
    this.usersService.getPendingBills('electricBills').subscribe((pendingBills) => {
      this.pendingBills = pendingBills
      console.log(this.pendingBills)
    })
  }

  loadPaidBills() {
    this.usersService.getPaidBills('electricBills').subscribe((paidBills) => {
      this.paidBills = paidBills
      console.log(this.paidBills)
    })
  }

  async deleteBill(id: string) {
    this.isDeleting = true;
    this.usersService.deleteBill(id, 'electricBills');

    await this.loadPaidBills();
    this.isDeleting = false;
  }
}
