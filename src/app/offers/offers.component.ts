import { Component, OnInit } from '@angular/core';
import { DbservService } from '../dbserv.service';
import { Bill } from 'src/models/bill';

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

  subscribe(offer: { provider?: string; plan: string; totalUnits: number; price: number; subscribed: boolean;id:string }) {
    // console.log("Subscribed to plan: ", offer.plan);
    // this.offers.forEach(o => {
    //   o.subscribed = (o === offer);
    // });
    // create a new Date object for the current date
    const currentDate = new Date();
    // get the day, month, and year values of the current date
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    // create a string representation of the date in the format "dd/mm/yyyy"
    const dateString = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year.toString()}`;

    let bill:Bill = {billNum:Math.floor(Math.random() * 1000) + 1,units:offer.totalUnits,dueDate:dateString,type:'telephoneBill',offerValue:offer.price,status:'Pending'}
    console.log(offer.id)
    this.usersService.addToCart(bill)
    this.usersService.addBill(this.usersService.loggedUser.id,'telephoneBills',bill).subscribe()
    this.usersService.subscribeToPlan(offer.id)
    console.log("user cart from subscribe: ",this.usersService.loggedUserCart)
    offer.subscribed=true;
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
      }
    })
  }

}
