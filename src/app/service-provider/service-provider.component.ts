import { Component } from '@angular/core';

@Component({
  selector: 'app-service-providers',
  templateUrl: './service-provider.component.html',
  styleUrls: ['./service-provider.component.css']
})
export class ServiceProviderComponent {
  tariffs: string[] = [];
  selectedTariffs: string[] = [];
  showDialog = false;
  providers = [
    {
      name: "Provider A",
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
      name: "Provider B",
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

  showTariffs(provider: string) {
    this.tariffs = [];
    switch (provider) {
      case 'Vodafone':
        this.tariffs = ['Vodafone Plan 1', 'Vodafone Plan 2', 'Vodafone Plan 3'];
        break;
      case 'Etisalat':
        this.tariffs = ['Etisalat Plan 1', 'Etisalat Plan 2', 'Etisalat Plan 3'];
        break;
      case 'Orange':
        this.tariffs = ['Orange Plan 1', 'Orange Plan 2', 'Orange Plan 3'];
        break;
    }
    this.openDialog();
  }


  openDialog() {
    this.showDialog = true;
    console.log(this.tariffs)
  }

  closeDialog() {
    this.showDialog = false;
  }

  showSelectedTariffs(tariffs: string[]) {
    this.selectedTariffs = tariffs;
    this.openDialog();
  }
}
