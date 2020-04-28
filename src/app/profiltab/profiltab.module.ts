import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfiltabPageRoutingModule } from './profiltab-routing.module';
import { ProfiltabPage } from './profiltab.page';
import { PremiumPageModule} from '../premium/premium.module';
import { ListenpopovPageModule} from '../listenpopov/listenpopov.module';
//import { FedaPayCheckoutModule } from 'fedapay-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfiltabPageRoutingModule,
    PremiumPageModule,
    ListenpopovPageModule,
//    FedaPayCheckoutModule.forRoot({ public_key: 'pk_sandbox_rug9BPfv-ZNJeAPNexkE-Z5P', app_id: 'io.ionic.starter' })
  ],
  declarations: [ProfiltabPage]
})
export class ProfiltabPageModule {}
