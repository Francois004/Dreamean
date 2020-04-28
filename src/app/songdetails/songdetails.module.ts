import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SongdetailsPageRoutingModule } from './songdetails-routing.module';

import { SongdetailsPage } from './songdetails.page';
import { PanierPageModule} from '../panier/panier.module';
//import { FedaPayCheckoutModule } from 'fedapay-angular'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SongdetailsPageRoutingModule,
    PanierPageModule,
   // FedaPayCheckoutModule.forRoot({ public_key: 'pk_sandbox_rug9BPfv-ZNJeAPNexkE-Z5P', app_id: 'io.ionic.starter' })
  ],
  declarations: [SongdetailsPage]
})
export class SongdetailsPageModule {}
