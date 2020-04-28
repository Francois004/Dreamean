import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PremiumPageRoutingModule } from './premium-routing.module';

import { PremiumPage } from './premium.page';
import { FedaPayCheckoutModule } from 'fedapay-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PremiumPageRoutingModule,
    FedaPayCheckoutModule.forRoot({ public_key: 'pk_sandbox_rug9BPfv-ZNJeAPNexkE-Z5P', app_id: 'io.ionic.starter' })
  ],
  declarations: [PremiumPage]
})
export class PremiumPageModule {}
