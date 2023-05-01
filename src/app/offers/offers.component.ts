import { Component, OnInit } from '@angular/core';
import { offers } from 'src/models/offers';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  offers: offers[] = [];
  constructor() { }

  ngOnInit(): void {
    this.offers = [
      {
        provider: 'Vodafone',
        plan: '35 Offer',
        totalUnits: 4500,
        price: 35,
        subscribed: false
      },
      {
        provider: 'Etisalat',
        plan: '50 Offer',
        totalUnits: 750,
        price: 50,
        subscribed: false
      },
      {
        provider: 'Orange',
        plan: '100 Offer',
        totalUnits: 1500,
        price: 100,
        subscribed: false
      }
    ];
  }
  subscribe(offer: offers) {
    console.log("Subscribed to plan: ", offer.plan);
    this.offers.forEach(o => {
      o.subscribed = (o === offer);
    });
    const subscriptionMessage = `You have subscribed to ${offer.plan} plan from ${offer.provider} at ${offer.price} L.E.`;
    window.alert(subscriptionMessage);
  }
}
