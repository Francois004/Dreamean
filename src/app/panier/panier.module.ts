import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PanierPageRoutingModule } from './panier-routing.module';

import { PanierPage } from './panier.page';
import { FedaPayCheckoutModule } from 'fedapay-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PanierPageRoutingModule,
    FedaPayCheckoutModule.forRoot({ public_key: 'pk_sandbox_rug9BPfv-ZNJeAPNexkE-Z5P', app_id: 'io.ionic.starter' })
  ],
  declarations: [PanierPage]
})
export class PanierPageModule {}
