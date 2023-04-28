import { Component,OnInit } from '@angular/core';
import { offers } from 'src/models/offers';
@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent {
  offers: offers[]=[];

  constructor() {
    this.offers = [
      {
        provider: "Vodafone",
        plan: "35 Offer",
        totalUnits: 400,
        price: 35
      },
      {
        provider: "Etisalat",
        plan: "50 Offer",
        totalUnits: 750,
        price: 50
      },
      {
        provider: "Orange",
        plan: "100 Offer",
        totalUnits: 1500,
        price: 100
      }
    ];
}

ngOnInit(): void {
}
subscribe(plan: string) {
  console.log("Subscribed to plan: ", plan);
}



}

