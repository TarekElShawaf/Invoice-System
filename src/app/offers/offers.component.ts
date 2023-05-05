import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  showDialog = false;
  providers = [
    {
      name: "vodafone",
      offers: [
        {
          plan: "Offer 1",
          totalUnits: 100,
          price: 50,
          subscribed: false
        },
        {
          plan: "Offer 2",
          totalUnits: 200,
          price: 100,
          subscribed: false
        }
      ]
    },
    {
      name: "orange",
      offers: [
        {
          plan: "Offer 3",
          totalUnits: 150,
          price: 75,
          subscribed: false
        },
        {
          plan: "Offer 4",
          totalUnits: 300,
          price: 150,
          subscribed: false
        }
      ]
    }
  ];

  offers: { provider?: string; plan: string; totalUnits: number; price: number; subscribed: boolean; }[] = [];

  constructor() { }

  ngOnInit(): void {
    //this.offers = [];
    this.providers.forEach(provider => {
      provider.offers.forEach(offer => {
        this.offers.push({
          provider: provider.name,
          plan: offer.plan,
          totalUnits: offer.totalUnits,
          price: offer.price,
          subscribed: offer.subscribed
        } as { provider?: string; plan: string; totalUnits: number; price: number; subscribed: boolean; });
      });
    });
  }

  subscribe(offer: { provider?: string; plan: string; totalUnits: number; price: number; subscribed: boolean; }) {
    console.log("Subscribed to plan: ", offer.plan);
    this.offers.forEach(o => {
      o.subscribed = (o === offer);
    });
    const subscriptionMessage = `You have subscribed to ${offer.plan} plan from ${offer.provider} at ${offer.price} L.E.`;
    window.alert(subscriptionMessage);
  }
}
