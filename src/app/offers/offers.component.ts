import { Component, OnInit } from '@angular/core';
import { DbservService } from '../dbserv.service';
import { Bill } from 'src/models/bill';
import { UserService } from '../user.service';
import { ControlsService } from '../controls.service';
import {Offer} from 'src/models/offers';
import { AdminService } from '../admin.service';
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
      offers: []
    },
    {
      name: "Orange",
      offers: [ ]
    },
    {
      name:"Etisalat",
      offers:[]
    }
  ];
  currentOffer: any;


  constructor(private usersService:DbservService,private userService:UserService,private controlsService:ControlsService,private adminService:AdminService) { }

  ngOnInit(): void {
    //this.offers = [];
    this.loadOffers();
    // this.providers.forEach(provider => {
    //   provider.offers.forEach(offer => {
    //     this.offers.push({
    //       provider: provider.name,
    //       plan: offer.plan,
    //       totalUnits: offer.totalUnits,
    //       price: offer.price,
    //       subscribed: offer.subscribed
    //     } as { provider?: string; plan: string; totalUnits: number; price: number; subscribed: boolean; });
    //   });
    // });
  }

  subscribe(offer:Offer) {
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

    let bill:Bill = {billNum:Math.floor(Math.random() * 1000) + 1,units:offer.totalUnits,dueDate:dateString,type:'Offer',offerValue:offer.price,offerPlan:offer.plan,status:'Pending'}
    // remove other offer's bill if the there was one
    let index=this.userService.loggedUserCart.findIndex((x=>x.type=="Offer"))
    if(index>-1){
      this.userService.loggedUserCart.splice(index, 1);
    }
    this.userService.addToCart(bill).subscribe(()=>{
      this.adminService.addBill(this.userService.loggedUser.id,bill).subscribe((addedBill)=>{
          bill.id=addedBill['name'];
          console.log(addedBill['name']);
          console.log("user cart from subscribe: ",this.userService.loggedUserCart)
          const subscriptionMessage = `You have Added ${offer.plan} plan from ${offer.provider} at ${offer.price} L.E. to your cart`;
          window.alert(subscriptionMessage);        
        })

      })
  }

  loadOffers(){
    this.controlsService.getAllOffers().subscribe((offers)=>{
      // this.offers2=offers;
      for (let i = 0; i < this.providers.length; i++) {
        let provider = this.providers[i];
        let providerName = provider.name;
      
        // find the matching provider in the offers array
        offers.forEach((offer)=>{
          if(offer.plan==this.userService.loggedUser.currentPlan) this.currentOffer=offer.plan
          if(offer.provider==providerName) this.providers[i].offers.push(offer)
        })
      }
    })
  }

}
