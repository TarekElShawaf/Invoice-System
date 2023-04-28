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
  }

  closeDialog() {
    this.showDialog = false;
  }

  showSelectedTariffs(tariffs: string[]) {
    this.selectedTariffs = tariffs;
    this.openDialog();
  }
}
