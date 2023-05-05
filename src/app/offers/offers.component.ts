import { Component, OnInit } from '@angular/core';
import { DbservService } from '../dbserv.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  showDialog = false;
  providers = [
    {
      name: "Vodafone",
      offers: [
        // {
        //   plan: "Offer 1",
        //   totalUnits: 100,
        //   price: 50,
        //   subscribed: false
        // },
        // {
        //   plan: "Offer 2",
        //   totalUnits: 200,
        //   price: 100,
        //   subscribed: false
        // }
      ]
    },
    {
      name: "Orange",
      offers: [
        // {
        //   plan: "Offer 3",
        //   totalUnits: 150,
        //   price: 75,
        //   subscribed: false
        // },
        // {
        //   plan: "Offer 4",
        //   totalUnits: 300,
        //   price: 150,
        //   subscribed: false
        // }
      ]
    },
    {
      name:"Etisalat",
      offers:[

      ]
    }
  ];

  offers: { provider?: string; plan: string; totalUnits: number; price: number; subscribed: boolean; }[] = [];
  offers2=[]
  constructor(private usersService:DbservService) { }

  ngOnInit(): void {
    //this.offers = [];
    this.loadOffers();
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
    // console.log("Subscribed to plan: ", offer.plan);
    // this.offers.forEach(o => {
    //   o.subscribed = (o === offer);
    // });
    const subscriptionMessage = `You have Added ${offer.plan} plan from ${offer.provider} at ${offer.price} L.E. to your cart`;
    window.alert(subscriptionMessage);
  }

  loadOffers(){
    this.usersService.getAllOffers().subscribe((offers)=>{
      this.offers2=offers;
      for (let i = 0; i < this.providers.length; i++) {
        const provider = this.providers[i];
        const providerName = provider.name;
      
        // find the matching provider in the offers2 array
        this.offers2.forEach((offer)=>{

          if(offer.provider==providerName) this.providers[i].offers.push(offer)
        })
        // if a matching provider is found, assign its offers array to the provider's offers array
        console.log("Providers:")
        console.log(this.providers)
      }
    })
  }

}
